import { Order } from "../models/order.model";
import { AppError } from "../utils/AppError";
import {
  assertValidTransition,
  OrderStatus,
  PaymentStatus,
} from "../utils/orderStatusTransition";
import { tabbyService } from "./tabby.service";

export class OrderService {
  /**
   * Creates a new order in `pending_payment` state and initiates a Tabby checkout.
   * Returns the saved order and the Tabby-hosted checkout URL.
   */
  async createOrder(data: any) {
    const order = new Order({
      ...data,
      orderStatus: "pending_payment",
      paymentStatus: "pending",
    });
    await order.save();

    const { checkoutUrl, paymentId } = await tabbyService.createCheckoutSession(
      order
    );

    order.tabbyPaymentId = paymentId;
    await order.save();

    return { order, checkoutUrl };
  }

  async getOrders(query: any) {
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 10;

    const total = await Order.countDocuments();
    const orders = await Order.find()
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ createdAt: -1 });

    return {
      orders,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getOrderById(id: string) {
    const order = await Order.findById(id);
    if (!order)
      throw new AppError({ statusCode: 404, message: "Order not found" });
    return order;
  }

  /**
   * Handles an incoming Tabby webhook event.
   * Verifies the HMAC signature, then updates paymentStatus + orderStatus.
   *
   * Tabby statuses:
   *   "authorized" → payment succeeded
   *   "rejected" | "expired" | "closed" → payment failed
   */
  async handleTabbyWebhook(
    rawBody: Buffer,
    signature: string,
    payload: any
  ): Promise<void> {
    const isValid = tabbyService.verifyWebhookSignature(rawBody, signature);
    if (!isValid) {
      throw new AppError({
        statusCode: 401,
        code: "INVALID_WEBHOOK_SIGNATURE",
        message: "Tabby webhook signature verification failed.",
      });
    }

    const tabbyPaymentId = payload?.id as string | undefined;
    const tabbyStatus = payload?.status as string | undefined;

    if (!tabbyPaymentId || !tabbyStatus) {
      throw new AppError({
        statusCode: 400,
        code: "INVALID_WEBHOOK_PAYLOAD",
        message: "Webhook payload is missing required fields (id, status).",
      });
    }

    const order = await Order.findOne({ tabbyPaymentId });
    if (!order) {
      // Unknown payment ID — return silently so Tabby doesn't retry
      return;
    }

    if (tabbyStatus === "authorized") {
      order.paymentStatus = "paid";
      order.orderStatus = "placed";
      order.paymentLinkStatus = "used";
    } else if (["rejected", "expired"].includes(tabbyStatus)) {
      order.paymentStatus = "failed";
      // Keep orderStatus as pending_payment (allow retry)
    } else if (tabbyStatus === "closed") {
      order.paymentStatus = "cancelled";
      // Keep orderStatus as pending_payment (allow retry)
    }

    await order.save();
  }

  /**
   * Returns the active payment link for an order, or creates a fresh one if
   * there is none or it has expired.
   *
   * Decision logic:
   *   paid           → 403 (already paid, link is used)
   *   active + valid → return existing checkoutUrl (no new Tabby call)
   *   none/expired   → create new Tabby session, store URL, set 24h expiry
   */
  async getOrCreatePaymentLink(
    id: string
  ): Promise<{ checkoutUrl: string; expiresAt: Date; fresh: boolean }> {
    const order = await Order.findById(id);
    if (!order)
      throw new AppError({ statusCode: 404, message: "Order not found" });

    // Terminal state — block all link access
    if (order.paymentStatus === "paid" || order.paymentLinkStatus === "used") {
      throw new AppError({
        statusCode: 403,
        code: "LINK_ALREADY_USED",
        message: "This order has already been paid.",
      });
    }

    const now = new Date();
    const hasActiveLink =
      order.paymentLinkStatus === "active" &&
      !!order.checkoutUrl &&
      !!order.paymentLinkExpiresAt &&
      now <= order.paymentLinkExpiresAt;

    // Re-use existing active link — no new Tabby session needed
    if (hasActiveLink) {
      return {
        checkoutUrl: order.checkoutUrl!,
        expiresAt: order.paymentLinkExpiresAt!,
        fresh: false,
      };
    }

    // Link is expired or never created — generate a new Tabby session
    if (order.paymentLinkStatus === "active") {
      order.paymentLinkStatus = "expired"; // persist expired state
    }

    const { checkoutUrl, paymentId } =
      await tabbyService.createCheckoutSession(order);

    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // +24h

    order.tabbyPaymentId = paymentId;
    order.checkoutUrl = checkoutUrl;
    order.paymentLinkStatus = "active";
    order.paymentLinkExpiresAt = expiresAt;
    await order.save();

    return { checkoutUrl, expiresAt, fresh: true };
  }

  /**
   * Retries payment for an order that previously failed.
   * Creates a new Tabby checkout session without creating a new order.
   */
  async retryPayment(id: string): Promise<{ checkoutUrl: string }> {
    const order = await Order.findById(id);
    if (!order)
      throw new AppError({ statusCode: 404, message: "Order not found" });

    if (!["pending", "failed", "cancelled"].includes(order.paymentStatus)) {
      throw new AppError({
        statusCode: 400,
        code: "RETRY_NOT_ALLOWED",
        message: `Payment retry is only allowed when paymentStatus is "failed" or "cancelled". Current status: "${order.paymentStatus}".`,
      });
    }

    const { checkoutUrl, paymentId } =
      await tabbyService.createCheckoutSession(order);

    order.tabbyPaymentId = paymentId;
    await order.save();

    return { checkoutUrl };
  }

  /**
   * Syncs the order's payment status by fetching the live state from Tabby.
   * Called by the frontend after returning from the Tabby-hosted payment page
   * (success / cancel / failure redirect URLs), as a safety net for delayed webhooks.
   */
  async syncPaymentStatus(id: string) {
    const order = await Order.findById(id);
    if (!order)
      throw new AppError({ statusCode: 404, message: "Order not found" });

    if (!order.tabbyPaymentId) {
      throw new AppError({
        statusCode: 400,
        code: "NO_PAYMENT_SESSION",
        message: "No Tabby payment session found for this order.",
      });
    }

    // Already in a terminal paid state — nothing to sync
    if (order.paymentStatus === "paid") {
      return order;
    }

    const { status } = await tabbyService.getPaymentStatus(order.tabbyPaymentId);

    if (status === "authorized") {
      order.paymentStatus = "paid";
      order.orderStatus = "placed";
    } else if (["rejected", "expired"].includes(status)) {
      order.paymentStatus = "failed";
    } else if (status === "closed") {
      order.paymentStatus = "cancelled";
    }
    // "created" / "pending" / unknown → leave as-is

    await order.save();
    return order;
  }

  /**
   * Updates the order status (admin-driven).
   * Enforces valid transitions and payment guard via assertValidTransition.
   */
  async updateOrderStatus(id: string, status: string) {
    const order = await Order.findById(id);
    if (!order)
      throw new AppError({ statusCode: 404, message: "Order not found" });

    assertValidTransition(
      order.orderStatus as OrderStatus,
      status as OrderStatus,
      order.paymentStatus as PaymentStatus
    );

    order.orderStatus = status as OrderStatus;
    await order.save();

    return order;
  }
}
