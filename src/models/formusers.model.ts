import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true, unique: true },
  createdAt: { type: Date, default: Date.now },
});

export const FormUserModel = mongoose.model("FormUser", userSchema);
