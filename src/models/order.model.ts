import mongoose, { Document, Schema } from "mongoose";

export interface OrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

export interface OrderDocument extends Document {
  contact: {
    fullName: string;
    email: string;
    phone: string;
  };
  shipping: {
    address: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  items: OrderItem[];
  subtotal: number;
  shippingCost: number;
  tax: number;
  total: number;
  paymentStatus: "pending" | "paid" | "failed";
  orderStatus: "placed" | "processing" | "shipped" | "delivered";
  createdAt: Date;
}

const orderSchema = new Schema<OrderDocument>(
  {
    contact: {
      fullName: { type: String, required: true },
      email: { type: String, required: true },
      phone: { type: String, required: true },
    },
    shipping: {
      address: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      zipCode: { type: String, required: true },
      country: { type: String, required: true },
    },
    items: [
      {
        productId: String,
        name: String,
        price: Number,
        quantity: Number,
        image: String,
      },
    ],
    subtotal: Number,
    shippingCost: Number,
    tax: Number,
    total: Number,
    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed"],
      default: "pending",
    },
    orderStatus: {
      type: String,
      enum: ["placed", "processing", "shipped", "delivered"],
      default: "placed",
    },
  },
  {
    timestamps: true,
  }
);

export const Order = mongoose.model<OrderDocument>("Order", orderSchema);
