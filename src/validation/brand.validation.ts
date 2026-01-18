import { z } from "zod";

export const createBrandSchema = z.object({
  body: z.object({
    name: z.object({
      en: z.string().min(2, "English name required"),
      ar: z.string().min(2, "Arabic name required")
    })
  })
});

export const updateBrandSchema = z.object({
  params: z.object({
    id: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid MongoDB ID")
  }),
  body: z.object({
    name: z.object({
      en: z.string().min(2).optional(),
      ar: z.string().min(2).optional()
    }).optional()
  }).strict()
});
