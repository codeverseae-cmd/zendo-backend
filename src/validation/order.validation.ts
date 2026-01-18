import { z } from "zod";

export const createOrderSchema = z.object({
  body: z.object({
    contact: z.object({
      fullName: z.string().min(2),
      email: z.string().email(),
      phone: z.string().min(5),
    }),

    shipping: z.object({
      address: z.string().min(3),
      city: z.string(),
      state: z.string(),
      zipCode: z.string(),
      country: z.string(),
    }),

    items: z
      .array(
        z.object({
          productId: z.string(),
          name: z.string(),
          price: z.number().positive(),
          quantity: z.number().min(1),
          image: z.string().optional(),
        })
      )
      .min(1),

    subtotal: z.number().positive(),
    shippingCost: z.number().default(0),
    tax: z.number().default(0),
    total: z.number().positive(),
  }),
});
