// validators/course.validators.ts
import { z } from "zod";

export const baseOverviewSchema = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
  keyFeatures: z.array(z.string()).optional(),
  skillsCovered: z.array(z.string()).optional(),
  trainingOption: z.string().optional(),
});

export const baseCurriculumSchema = z.object({
  eligibility: z.array(z.string()).optional(),
  prerequisites: z.array(z.string()).optional(),
  projects: z.array(
    z
      .object({
        title: z.string(),
        content: z.array(z.string()),
      })
      .optional()
  ),
  chapters: z
    .array(
      z.object({
        title: z.string(),
        lessons: z.array(
          z.object({
            title: z.string(),
            content: z.string(),
          })
        ),
      })
    )
    .optional(),
});

// Draft course validator: all fields are optional.
export const draftCourseSchema = z.object({
  title: z.string().optional(),
  slug: z.string().optional(),
  outcomes: z.array(z.string()).optional(),
  variant: z.number().optional(),
  price: z
    .object({
      amount: z.number().optional(),
      currency: z.enum(["INR", "USD", "EUR", "GBP"]).optional(),
    })
    .optional(),
  whyJoin: z.array(z.string()).optional(),
  skills: z.array(z.string()).optional(),
  videoUrl: z.string().optional(),
  description: z.string().optional(),
  durationHours: z.number().optional(),
  startTime: z.preprocess(
    (arg) =>
      typeof arg === "string" || arg instanceof Date ? new Date(arg) : arg,
    z.date().optional()
  ),
  endTime: z.preprocess(
    (arg) =>
      typeof arg === "string" || arg instanceof Date ? new Date(arg) : arg,
    z.date().optional()
  ),
  certification: z
    .object({
      title: z.string().optional(),
    })
    .optional(),
  partnerShip: z
    .object({
      title: z.string().optional(),
    })
    .optional(),
  isPaid: z.boolean().optional(),
  appliedCount: z.number().optional(),
  trainedCount: z.number().optional(),
  highlights: z.array(z.string()).optional(),
  banner: z.string().optional(), // expect an ObjectId string
  previewImage: z.string().optional(),
  logoUrl: z.string().optional(),
  category: z.string().length(24).optional(),
  tools: z.array(z.string()).optional(),
  overview: baseOverviewSchema.optional(),
  curriculum: baseCurriculumSchema.optional(),
  images: z.array(z.string()).optional(),
  isPublished: z.boolean().optional(),
  faqs: z
    .array(
      z.object({
        question: z.string(),
        answer: z.string(),
      })
    )
    .optional(),
});

// Published course validator: all fields are required.
export const publishedCourseSchema = z.object({
  title: z.string(),
  outcomes: z.array(z.string()).optional(),
  description: z.string(),
  durationHours: z.number(),
  variant: z.number().optional(),
  whyJoin: z.array(z.string()),
  skills: z.array(z.string()),
  videoUrl: z.string(),
  slug: z.string(),
  price: z.object({
    amount: z.coerce.number(),
    currency: z.enum(["INR", "USD", "EUR", "GBP"]),
  }),

  startTime: z.preprocess(
    (arg) =>
      typeof arg === "string" || arg instanceof Date ? new Date(arg) : arg,
    z.date()
  ),
  endTime: z.preprocess(
    (arg) =>
      typeof arg === "string" || arg instanceof Date ? new Date(arg) : arg,
    z.date()
  ),
  certification: z.object({
    title: z.string(),
  }),
  partnerShip: z
    .object({
      title: z.string().optional(),
    })
    .optional(),
  isPaid: z.boolean(),
  // appliedCount and trainedCount can still be optional since they default to 0.
  appliedCount: z.number().optional(),
  trainedCount: z.number().optional(),
  highlights: z.array(z.string()),
  banner: z.string().length(24), // required ObjectId string
  previewImage: z.string().length(24),
  logoUrl: z.string().length(24),
  category: z.string().length(24),
  overview: baseOverviewSchema,
  curriculum: baseCurriculumSchema,
  images: z.array(z.string()).optional(),
  // When publishing, we enforce isPublished to be true.
  // isPublished: z.literal(true),
  faqs: z.array(
    z.object({
      question: z.string(),
      answer: z.string(),
    })
  ),
});

export const getCoursesQueryValidator = z.object({
  page: z.coerce.number().int().min(1).optional(),
  limit: z.coerce.number().int().min(10).optional(),
  isPublished: z.string().optional(), // e.g., "draft" or "published"
  category: z.string().optional(),
});

export type GetCoursesQuery = z.infer<typeof getCoursesQueryValidator>;
