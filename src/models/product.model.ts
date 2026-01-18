import mongoose, { Schema, Document, Model, ObjectId } from "mongoose";
import { Category } from "./category.model";
import { Brand } from "./brand.model";

export interface ProductDocument extends Document {
  name: { en: string; ar: string };
  categoryId: ObjectId;
  brandId: ObjectId;
  image: string;
  price: number;
  originalPrice?: number;
  rating: number;
  discount?: string;
  discountColor?: string;
  badge?: string;
  badgeColor?: string;
}

const ProductSchema: Schema<ProductDocument> = new Schema(
  {
    name: {
      en: { type: String, required: true },
      ar: { type: String, required: true },
    },
    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: Category,
      required: true,
    },
    brandId: { type: mongoose.Schema.Types.ObjectId, ref: Brand, required: true },
    image: { type: String, required: true },
    price: { type: Number, required: true },
    originalPrice: { type: Number },
    rating: { type: Number, required: true, default: 0 },
    discount: { type: String },
    discountColor: { type: String },
    badge: { type: String },
    badgeColor: { type: String },
  },
  { timestamps: true }
);

export const Product: Model<ProductDocument> = mongoose.model<ProductDocument>(
  "Product",
  ProductSchema
);
