import { Request, Response } from "express";
import { OrderService } from "../services/order.service";

const orderService = new OrderService();

export const createOrder = async (req: Request, res: Response) => {
  const { order, checkoutUrl } = await orderService.createOrder(req.body);
  res.status(201).json({ success: true, data: { order, checkoutUrl } });
};

export const getOrders = async (req: Request, res: Response) => {
  const result = await orderService.getOrders(req.query);
  res.status(200).json({ success: true, ...result });
};

export const getOrderById = async (req: Request, res: Response) => {
  const order = await orderService.getOrderById(req.params.id!);
  res.status(200).json({ success: true, data: order });
};

/**
 * Tabby webhook handler.
 * Must receive raw body (Buffer) — see app.ts for raw-body middleware.
 */
export const handleTabbyWebhook = async (req: Request, res: Response) => {
  const signature = (req.headers["tabby-signature"] as string) ?? "";
  const rawBody = req.body as Buffer;

  // Ack immediately (Tabby expects a fast 200 response)
  res.status(200).json({ received: true });

  // Process asynchronously after responding
  await orderService.handleTabbyWebhook(rawBody, signature, JSON.parse(rawBody.toString()));
};

/**
 * Retry payment for a previously failed order.
 * Does NOT create a new order — only a new Tabby checkout session.
 */
export const retryPayment = async (req: Request, res: Response) => {
  const { checkoutUrl } = await orderService.retryPayment(req.params.id!);
  res.status(200).json({ success: true, data: { checkoutUrl } });
};

/**
 * Syncs payment status from Tabby for a given order.
 * Called by the frontend on the success / cancel / failure redirect landing pages.
 */
export const syncPaymentStatus = async (req: Request, res: Response) => {
  const order = await orderService.syncPaymentStatus(req.params.id!);
  res.status(200).json({ success: true, data: order });
};

export const updateOrderStatus = async (req: Request, res: Response) => {
  const order = await orderService.updateOrderStatus(
    req.params.id!,
    req.body.status
  );
  res.status(200).json({ success: true, data: order });
};

/**
 * Admin: get or create a valid 24h Tabby payment link for an order.
 * Returns existing link if still active, creates a new one if expired/none.
 * Blocked if order is already paid.
 */
export const handlePaymentLink = async (req: Request, res: Response) => {
  const result = await orderService.getOrCreatePaymentLink(req.params.id!);
  res.status(200).json({ success: true, data: result });
};
