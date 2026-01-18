import z from "zod";

export const createCategorySchema = z.object({
  body: z.object({
    name: z.object({
      en: z.string().min(2),
      ar: z.string().min(2),
    }),
    subCategories: z
      .array(
        z.object({
          name: z.object({
            en: z.string().min(2),
            ar: z.string().min(2),
          }),
          items: z
            .array(
              z.object({
                en: z.string().min(1),
                ar: z.string().min(1),
              })
            )
            .optional(),
        })
      )
      .optional(),
  }),
});
