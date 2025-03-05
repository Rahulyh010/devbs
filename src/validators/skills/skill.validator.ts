import { z } from "zod";

export const createSkillValidator = z.object({
  title: z.string().min(1, "Title is required"),
  logo: z.string().length(24, "Logo is required"),
});

export const fetchSkillValidator = z.object({
  page: z.coerce.number().default(1).optional(),
  limit: z.coerce.number().default(40).optional(),
});
