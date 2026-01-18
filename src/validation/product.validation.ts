import { z } from "zod";

export const createProductSchema = z.object({
  body: z.object({
    name: z.object({
      en: z.string().min(2, "English name required"),
      ar: z.string().min(2, "Arabic name required"),
    }),
    categoryId: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid MongoDB ID"),
    brandId: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid MongoDB ID"),

    image: z.string().url("Invalid image URL"),
    price: z.number().positive(),

    originalPrice: z.number().optional(),
    rating: z.number().min(0).max(5).optional(),
    discount: z.string().optional(),
    discountColor: z.string().optional(),
    badge: z.string().optional(),
    badgeColor: z.string().optional(),
  }),
});
export const updateProductSchema = z.object({
  params: z.object({
    id: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid MongoDB ID"),
  }),

  body: z.object({
    name: z.object({
      en: z.string().min(2).optional(),
      ar: z.string().min(2).optional(),
    }).optional(),

    categoryId: z.string().regex(/^[0-9a-fA-F]{24}$/).optional(),
    brandId: z.string().regex(/^[0-9a-fA-F]{24}$/).optional(),

    image: z.string().url().optional(),
    price: z.number().positive().optional(),
    originalPrice: z.number().optional(),
    rating: z.number().min(0).max(5).optional(),

    discount: z.string().optional(),
    discountColor: z.string().optional(),
    badge: z.string().optional(),
    badgeColor: z.string().optional(),
  }).strip(),
});
