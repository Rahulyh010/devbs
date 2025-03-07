import { z } from "zod";

export const createCategoryValidator = {
  body: z.object({
    name: z
      .string()
      .min(3, "Name is required")
      .max(100, "Name must be less than 100 characters"),
    logo: z.string().length(24, "Logo is required").optional(),
    type: z.enum(["b2i", "b2b", "b2c", "b2g"]),
  }),
};

export const fetchCategoryvalidator = z.object({
  page: z.coerce.number().default(1),
  limit: z.coerce.number().default(40),
  type: z.enum(["b2i", "b2b", "b2c", "b2g"]).optional(),
});

export const updateCategorySchema = z.object({
  key: z
    .string()
    .min(1, "Key is required")
    .regex(/^[a-z0-9_]+$/, "Key must be lowercase with underscores")
    .optional(),
  name: z.string().min(1, "Name is required").optional(),
  banner: z.string().url("Banner must be a valid URL").optional(),
});

export const deleteCategorySchema = z.object({
  _id: z
    .string()
    .min(1, "Key is required")
    .regex(/^[a-z0-9_]+$/, "Key must be lowercase with underscores"),
});

export const getCategorySchema = z.object({
  _id: z
    .string()
    .min(1, "Key is required")
    .regex(/^[a-z00-9_]+$/, "Key must be lowercase with underscores"),
});
