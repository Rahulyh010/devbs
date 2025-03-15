import mongoose from "mongoose";

const sessionSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Student",
    required: true,
  },
  createdAt: { type: Date, default: Date.now, expires: "5h" }, // 5 hours TTL
});
export const Session = mongoose.model("UserSession", sessionSchema);
