import mongoose, { Schema, Document } from "mongoose";

export interface CategoryDocument extends Document {
  name: {
    en: string;
    ar: string;
  };
  subCategories: {
    name: { en: string; ar: string };
    items: { en: string; ar: string }[];
  }[];
}

const categorySchema = new Schema<CategoryDocument>(
  {
    name: {
      en: { type: String, required: true },
      ar: { type: String, required: true },
    },
    subCategories: [
      {
        name: {
          en: String,
          ar: String,
        },
        items: [
          {
            en: String,
            ar: String,
          },
        ],
      },
    ],
  },
  { timestamps: true }
);

export const Category = mongoose.model<CategoryDocument>(
  "Category",
  categorySchema
);
