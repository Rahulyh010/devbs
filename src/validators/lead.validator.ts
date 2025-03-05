import { z } from "zod";

export const leadSchema = z
  .object({
    name: z.string().min(3, "Name must be at least 3 characters long"),
    email: z.string().email("Invalid email format"),
    countryCode: z.string().optional(),
    phoneNumber: z
      .string()
      .regex(/^\d{10,15}$/, "Phone number must be between 10 to 15 digits"),
    category: z.enum([
      "individual_course",
      "corporate_training",
      "institutional",
      "government",
    ]),
    subcategory: z.enum(["", "jobs", "skills"]).optional(),
    query: z.string().min(10, "Query must be at least 10 characters long"),
  })
  .superRefine((data, ctx) => {
    if (data.category === "institutional" && !data.subcategory) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Subcategory is required when category is 'institutional'",
        path: ["subcategory"],
      });
    }

    if (data.category !== "institutional" && data.subcategory) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message:
          "Subcategory should only be provided when category is 'institutional'",
        path: ["subcategory"],
      });
    }
  });
