import { Request, Response } from "express";
import { OTPModel } from "../models/otp.model";
import { FormUserModel } from "../models/formusers.model";

// 📌 Save User After OTP Verification
export const saveUser = async (req: Request, res: Response) => {
  const { name, email, phone, otp } = req.body;

  if (!name || !email || !phone || !otp) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const storedOTP = await OTPModel.findOne({ phone });

  if (!storedOTP || storedOTP.otp !== otp) {
    return res.status(400).json({ message: "Invalid or expired OTP" });
  }

  try {
    // Check if user already exists
    const existingUser = await FormUserModel.findOne({ phone });
    if (existingUser) {
      return res.status(400).json({ message: "User already registered" });
    }

    // Save new user
    const newUser = new FormUserModel({ name, email, phone });
    await newUser.save();

    // Delete OTP after successful registration
    await OTPModel.deleteOne({ phone });

    res
      .status(201)
      .json({ message: "User registered successfully", user: newUser });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// 📌 Get All Users (For Admin)
export const getAllUsers = async (_req: Request, res: Response) => {
  try {
    const users = await FormUserModel.find();
    res.status(200).json({ success: true, users });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// 📌 Get a Single User by Phone Number
export const getUserByPhone = async (req: Request, res: Response) => {
  const { phone } = req.params;

  try {
    const user = await FormUserModel.findOne({ phone });
    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(200).json({ success: true, user });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};
