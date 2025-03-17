import { Router } from "express";
import { z } from "zod";
import { validate } from "../utils/zodValidtor";
import { getStudents } from "../controllers/student.controller";

const router = Router();

export const queryformSchema = z.object({
  email: z.string().email("Invalid email address").optional(),
  phone: z
    .string()
    .min(10, "Phone number must be at least 10 digits")
    .max(15, "Phone number cannot exceed 15 digits")
    .optional(),
  rollNo: z.string().optional(),
  limit: z.coerce.number().default(40).optional(),
  page: z.coerce.number().default(1).optional(),
  courseId: z.string().length(4).optional(),
});

export type FormSchema = z.infer<typeof queryformSchema>;

router.get("/", validate({ query: queryformSchema }), getStudents);

export default router;
