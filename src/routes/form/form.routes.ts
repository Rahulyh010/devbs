import { Router } from "express";
import {
  sendPhoneOTP,
  submitExam,
  verifyOTP,
} from "../../controllers/form.controller";
import { saveUser } from "../../controllers/formusers.controller";
import { validate } from "../../utils/zodValidtor";
import { z } from "zod";

const router = Router();
const answerValueSchema = z.union([z.number(), z.array(z.number()), z.null()]);

// Create an object schema with keys "1" through "50" prepopulated
const answersSchema = z.object(
  Object.fromEntries(
    Array.from({ length: 50 }, (_, i) => [i.toString(), answerValueSchema])
  )
);
const formSchema = z.object({
  email: z.string().email("Invalid email address").optional(),
  countryCode: z.string().min(2, "Select a country code"),
  phone: z
    .string()
    .min(10, "Phone number must be at least 10 digits")
    .max(15, "Phone number cannot exceed 15 digits"),
  rollNo: z.string().min(1, "Roll No is required"),
});

// Define a Zod schema to validate the request body
const submitExamSchema = z.object({
  rollNo: z.string().nonempty({ message: "rollNo is required" }),
  // Coerce courseId to a number in case it is sent as a string
  courseId: z.preprocess(
    (arg) => Number(arg),
    z.number({ invalid_type_error: "courseId must be a number" })
  ),
  // The answers object: keys can be question IDs (string) and value can be a number or an array of numbers
  answers: answersSchema,
});

export type FormSchema = z.infer<typeof formSchema>;

// 📌 Route to send OTP via WhatsApp
router.post("/send-otp", validate({ body: formSchema }), sendPhoneOTP);

// 📌 Route to verify OTP
router.post("/verify-otp", verifyOTP);

router.post("/submitExam", validate({ body: submitExamSchema }), submitExam);

// 📌 Route to save user details (only if OTP is verified)
router.post("/register", validate({ body: formSchema }), saveUser);

export default router;
