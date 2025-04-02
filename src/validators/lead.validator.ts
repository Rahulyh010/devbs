import { z } from "zod";

export const leadSchema = z
  .object({
    name: z.string().min(3, "Name must be at least 3 characters long"),
    email: z.string().email("Invalid email format"),
    countryCode: z.string().optional(),
    phoneNumber: z
      .string()
      .regex(/^\d{10,15}$/, "Phone number must be between 10 to 15 digits"),
    subCategory: z.enum(["jobs", "skills"]).optional(),
    query: z.string().min(10, "Query must be at least 10 characters long"),
    type: z.enum(["b2i", "b2b", "b2c", "b2g", "general"]),
    websiteUrl: z.string().url("Invalid URL format").optional(),
  })
  .superRefine((data, ctx) => {
    if (data.type === "b2i" && !data.subCategory) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Subcategory is required when category is 'institutional'",
        path: ["subcategory"],
      });
    }

    if (data.type !== "b2i" && data.subCategory) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message:
          "Subcategory should only be provided when category is 'institutional'",
        path: ["subcategory"],
      });
    }
  });

const noteSchema = z.object({
  text: z.string().min(1, "Note text is required"),
  status: z.enum(
    [
      "NEW",
      "Attempted to Contact",
      "Not Contact",
      "In-conversation",
      "Prospect",
      "Not-Eligible",
      "Not-Interested",
      "Spam",
      "Opportunity",
      "Contact-in-Future",
      "Closed-Won",
      "Closed-Lost",
    ],
    {
      invalid_type_error: "Invalid status selection",
    }
  ),
  addedBy: z.string().optional(),
  createdAt: z.date().optional(), // Will be set by MongoDB
  updatedAt: z.date().optional(), // Will be set by MongoDB
});

// Schema specifically for editing leads (only status and comment)
export const leadEditSchema = z.object({
  status: z
    .enum(
      [
        "NEW",
        "Attempted to Contact",
        "Not Contact",
        "In-conversation",
        "Prospect",
        "Not-Eligible",
        "Not-Interested",
        "Spam",
        "Opportunity",
        "Contact-in-Future",
        "Closed-Won",
        "Closed-Lost",
      ],
      {
        invalid_type_error: "Invalid status selection",
      }
    )
    .optional(),
  comment: z.string().optional(),
  notes: z.array(noteSchema).optional(),
});

// Export types
export type LeadSchema = z.infer<typeof leadSchema>;
export type LeadEditSchema = z.infer<typeof leadEditSchema>;
