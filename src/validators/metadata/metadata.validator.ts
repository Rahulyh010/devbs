import { z } from "zod";

// Draft Meta Data Validator - allows optional fields
export const draftMetaSchema = z.object({
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional(),
  metaKeywords: z.array(z.string()).optional(),
  metaUrl: z.string().optional(),
  metaImage: z.string().optional(),
  ogTitle: z.string().optional(),
  ogDescription: z.string().optional(),
  ogType: z.enum(["website", "article", "course"]).optional(),
  ogImage: z.string().optional(),
  twitterCard: z.enum(["summary", "summary_large_image"]).optional(),
  twitterTitle: z.string().optional(),
  twitterDescription: z.string().optional(),
  twitterImage: z.string().optional(),
  schemaMarkup: z.string().optional(),
  sitemapPriority: z.number().min(0.1).max(1.0).optional(),
  robotsIndex: z.boolean().optional(),
  robotsFollow: z.boolean().optional(),
});

// Published Meta Data Validator - requires all necessary fields
export const publishedMetaSchema = z.object({
  metaTitle: z.string().min(1, "Meta title is required"),
  metaDescription: z.string().min(1, "Meta description is required"),
  metaKeywords: z.array(z.string()).min(1, "At least one keyword is required"),
  metaUrl: z.string().min(1, "Meta URL is required"),
  metaImage: z.string().min(1, "Meta image is required"),
  ogTitle: z.string().optional(),
  ogDescription: z.string().optional(),
  ogType: z.enum(["website", "article", "course"]).default("course"),
  ogImage: z.string().optional(),
  twitterCard: z
    .enum(["summary", "summary_large_image"])
    .default("summary_large_image"),
  twitterTitle: z.string().optional(),
  twitterDescription: z.string().optional(),
  twitterImage: z.string().optional(),
  schemaMarkup: z.string().optional(),
  sitemapPriority: z.number().min(0.1).max(1.0).default(0.5),
  robotsIndex: z.boolean().default(true),
  robotsFollow: z.boolean().default(true),
});

// Get Meta Data Query Validator
export const getMetaQueryValidator = z.object({
  isPublished: z.string().optional(), // Query param, not boolean directly
});
