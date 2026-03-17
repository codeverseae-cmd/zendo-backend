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
  paymentStatus: "pending" | "paid" | "failed" | "cancelled";
  orderStatus:
  | "pending_payment"
  | "placed"
  | "processing"
  | "shipped"
  | "delivered";
  tabbyPaymentId?: string;
  tamaraPaymentId?: string;
  paymentMethod: "tabby" | "tamara";
  checkoutUrl?: string;
  paymentLinkStatus: "none" | "active" | "used" | "expired";
  paymentLinkExpiresAt?: Date;
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
      enum: ["pending", "paid", "failed", "cancelled"],
      default: "pending",
    },
    orderStatus: {
      type: String,
      enum: ["pending_payment", "placed", "processing", "shipped", "delivered"],
      default: "pending_payment",
    },
    tabbyPaymentId: {
      type: String,
    },
    tamaraPaymentId: {
      type: String,
    },
    paymentMethod: {
      type: String,
      enum: ["tabby", "tamara"],
      default: "tabby",
    },
    checkoutUrl: {
      type: String,
    },
    paymentLinkStatus: {
      type: String,
      enum: ["none", "active", "used", "expired"],
      default: "none",
    },
    paymentLinkExpiresAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

export const Order = mongoose.model<OrderDocument>("Order", orderSchema);
