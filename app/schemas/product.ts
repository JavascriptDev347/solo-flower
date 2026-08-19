import { z } from "zod";
import { PACKAGING_TYPES, type PackagingType } from "~/types/product";

const packagingValues = PACKAGING_TYPES.map((p) => p.value);

export const productFormSchema = z
  .object({
    name: z.string().trim().min(1, "Nomi kiritilishi shart"),
    categoryId: z.string().min(1, "Kategoriya tanlanishi shart"),
    packagingType: z
      .string()
      .min(1, "Qadoqlash turi tanlanishi shart")
      .refine((v) => packagingValues.includes(v as PackagingType), {
        message: "Qadoqlash turi tanlanishi shart",
      }),
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
    freshnessLifespan: z
      .number()
      .min(1, "Yangilik muddati 1 dan 7 kungacha bo'lishi kerak")
      .max(7, "Yangilik muddati 1 dan 7 kungacha bo'lishi kerak")
      .nullable()
      .optional(),
    stemCount: z
      .number()
      .nonnegative("Poya soni manfiy bo'lishi mumkin emas")
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
