import { z } from "zod";

const allowedMimeTypes = [
  "image/jpeg",
  "image/png",
  "image/jpg",
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];

export const fileZodSchema = z.object({
  purpose: z.string().min(1, "Purpose is required"),
  type: z.string().min(1, "Type is required"),
  file: z.any(),
});
