import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
  linkedinId: string; // Unique LinkedIn ID
  name: string;
  email: string;
  profilePic: string;
  headline?: string; // LinkedIn headline (optional)
  location?: string;
  company?: string; // Current company (optional)
  position?: string; // Job title
  review?: string; // User's review content
  isVerified: boolean; // Admin verification status
  publicKey?: string; // Unique key after admin verification
  createdAt: Date;
}

const UserSchema: Schema = new Schema({
  linkedinId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  profilePic: { type: String, required: true },
  headline: { type: String },
  location: { type: String },
  company: { type: String },
  position: { type: String },
  review: { type: String },
  ratings: { type: Number, default: 0 },
  isVerified: { type: Boolean, default: false },
  publicKey: { type: String, unique: true, sparse: true }, // Only generated after admin approval
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Review ||
  mongoose.model<IUser>("Review", UserSchema);
