import { Order } from "../models/order.model";
import { AppError } from "../utils/AppError";

export class OrderService {
  async createOrder(data: any) {
    return await Order.create(data);
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
    if (!order) throw new AppError({ statusCode: 404, message: "Order not found" });
    return order;
  }

  async updateOrderStatus(id: string, status: string) {
    const order = await Order.findByIdAndUpdate(
      id,
      { orderStatus: status },
      { new: true }
    );
    if (!order) throw new AppError({ statusCode: 404, message: "Order not found" });
    return order;
  }
}
