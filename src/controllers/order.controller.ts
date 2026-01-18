import { Request, Response } from "express";
import { OrderService } from "../services/order.service";

const orderService = new OrderService();

export const createOrder = async (req: Request, res: Response) => {
  const order = await orderService.createOrder(req.body);
  res.status(201).json({ success: true, data: order });
};

export const getOrders = async (req: Request, res: Response) => {
  const result = await orderService.getOrders(req.query);
  res.status(200).json({ success: true, ...result });
};

export const getOrderById = async (req: Request, res: Response) => {
  const order = await orderService.getOrderById(req.params.id!);
  res.status(200).json({ success: true, data: order });
};

export const updateOrderStatus = async (req: Request, res: Response) => {
  const order = await orderService.updateOrderStatus(
    req.params.id!,
    req.body.status
  );
  res.status(200).json({ success: true, data: order });
};
