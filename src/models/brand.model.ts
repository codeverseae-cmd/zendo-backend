import mongoose, { Schema, Document } from "mongoose";

export interface BrandDocument extends Document {
  name: {
    en: string;
    ar: string;
  };
}

const brandSchema = new Schema<BrandDocument>(
  {
    name: {
      en: { type: String, required: true },
      ar: { type: String, required: true },
    },
  },
  { timestamps: true }
);

export const Brand = mongoose.model<BrandDocument>("Brand", brandSchema);
