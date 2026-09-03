import { z } from "zod";

export const productFormSchema = z
  .object({
    nameUz: z.string().trim().min(1, "O'zbekcha nomi kiritilishi shart"),
    nameEng: z.string().trim().min(1, "Inglizcha nomi kiritilishi shart"),
    nameRu: z.string().trim().min(1, "Ruscha nomi kiritilishi shart"),
    categoryId: z.string().min(1, "Kategoriya tanlanishi shart"),
    amount: z
      .number("Narx to'g'ri kiritilishi shart")
      .positive("Narx to'g'ri kiritilishi shart"),
    currency: z.string().trim().min(1, "Valyuta kiritilishi shart"),
    discountAmount: z.number().nonnegative().nullable().optional(),
    clearDiscount: z.boolean().optional(),
    rating: z
      .number()
      .min(1, "Reyting 1 dan 5 gacha bo'lishi kerak")
      .max(5, "Reyting 1 dan 5 gacha bo'lishi kerak")
      .nullable()
      .optional(),
    stock: z
      .number()
      .nonnegative("Ombordagi soni manfiy bo'lishi mumkin emas")
      .nullable()
      .optional(),
  })
  .superRefine((data, ctx) => {
    if (
      !data.clearDiscount &&
      data.discountAmount != null &&
      data.discountAmount >= data.amount
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Chegirma narxi asosiy narxdan kichik bo'lishi kerak",
        path: ["discountAmount"],
      });
    }
  });

export type ProductFormValues = z.infer<typeof productFormSchema>;
export type ProductFormErrors = Partial<Record<keyof ProductFormValues, string>>;
