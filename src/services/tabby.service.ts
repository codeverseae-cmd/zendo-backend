import crypto from "crypto";
import config from "../config/config";
import { AppError } from "../utils/AppError";
import { OrderDocument } from "../models/order.model";

const TABBY_API_BASE = "https://api.tabby.ai/api/v2";

interface TabbyCheckoutResult {
    checkoutUrl: string;
    paymentId: string;
}

export class TabbyService {
    /**
     * Creates a Tabby checkout session for the given order.
     * Returns the hosted checkout URL and the Tabby payment ID.
     */
    async createCheckoutSession(
        order: OrderDocument
    ): Promise<TabbyCheckoutResult> {
        const payload = {
            payment: {
                amount: order.total.toFixed(2),
                currency: "SAR",
                description: `Order #${order._id}`,
                buyer: {
                    phone: order.contact.phone,
                    email: order.contact.email,
                    name: order.contact.fullName,
                },
                buyer_history: {
                    registered_since: new Date().toISOString(),
                    loyalty_level: 0,
                },
                order: {
                    tax_amount: order.tax.toFixed(2),
                    shipping_amount: order.shippingCost.toFixed(2),
                    discount_amount: "0.00",
                    updated_at: new Date().toISOString(),
                    reference_id: String(order._id),
                    items: order.items.map((item) => ({
                        title: item.name,
                        description: item.name,
                        quantity: item.quantity,
                        unit_price: item.price.toFixed(2),
                        discount_amount: "0.00",
                        reference_id: item.productId,
                        image_url: item.image ?? "",
                        product_url: "",
                        category: "products",
                    })),
                },
                shipping_address: {
                    city: order.shipping.city,
                    address: order.shipping.address,
                    zip: order.shipping.zipCode,
                },
                order_history: [],
            },
            lang: "en",
            merchant_code: config.tabbyMerchantCode,
            merchant_urls: {
                success: `${process.env.FRONTEND_URL ?? "http://localhost:3000"}/order/${order._id}/success`,
                cancel: `${process.env.FRONTEND_URL ?? "http://localhost:3000"}/order/${order._id}/cancel`,
                failure: `${process.env.FRONTEND_URL ?? "http://localhost:3000"}/order/${order._id}/failure`,
            },
        };

        const response = await fetch(`${TABBY_API_BASE}/checkout`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${config.tabbyPublicKey}`,
            },
            body: JSON.stringify(payload),
        });

        if (!response.ok) {
            const errorBody = await response.text();
            throw new AppError({
                statusCode: 502,
                code: "TABBY_CHECKOUT_FAILED",
                message: "Failed to create Tabby checkout session.",
                metadata: { tabbyError: errorBody },
            });
        }

        const data = (await response.json()) as any;

        const checkoutUrl =
            data?.configuration?.available_products?.installments?.[0]?.web_url;
        const paymentId = data?.payment?.id;

        if (!checkoutUrl || !paymentId) {
            throw new AppError({
                statusCode: 502,
                code: "TABBY_INVALID_RESPONSE",
                message:
                    "Tabby checkout response did not contain a valid URL or payment ID.",
                metadata: { tabbyResponse: data },
            });
        }

        return { checkoutUrl, paymentId };
    }

    /**
     * Fetches the live status of a Tabby payment by its ID.
     * Used to sync order status after frontend redirect (success/cancel/failure pages).
     */
    async getPaymentStatus(paymentId: string): Promise<{ status: string }> {
        const response = await fetch(`${TABBY_API_BASE}/payments/${paymentId}`, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${config.tabbySecretKey}`,
            },
        });

        if (!response.ok) {
            const errorBody = await response.text();
            throw new AppError({
                statusCode: 502,
                code: "TABBY_FETCH_FAILED",
                message: "Failed to fetch Tabby payment status.",
                metadata: { tabbyError: errorBody },
            });
        }

        const data = (await response.json()) as any;
        return { status: data?.status ?? "unknown" };
    }

    /**
     * Verifies the HMAC-SHA256 signature from Tabby's webhook header.
     * Returns true if authentic, false otherwise.
     */
    verifyWebhookSignature(rawBody: Buffer, signature: string): boolean {
        if (!config.tabbyWebhookSecret || !signature) return false;

        const expected = crypto
            .createHmac("sha256", config.tabbyWebhookSecret)
            .update(rawBody)
            .digest("hex");

        // Constant-time comparison to prevent timing attacks
        try {
            return crypto.timingSafeEqual(
                Buffer.from(signature),
                Buffer.from(expected)
            );
        } catch {
            return false;
        }
    }
}

export const tabbyService = new TabbyService();
