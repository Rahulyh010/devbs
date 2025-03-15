import mongoose from "mongoose";

const otpSchema = new mongoose.Schema({
  phone: { type: String, required: true, unique: true },
  countryCode: { type: String, required: true },
  otp: { type: String, required: true },
  createdAt: { type: Date, default: Date.now, expires: 300 }, // Auto-delete after 5 minutes
});

export const OTPModel = mongoose.model("OTP", otpSchema);
