import mongoose from "mongoose";

const errorLogSchema = new mongoose.Schema(
  {
    message: { type: String, required: true },
    stack: { type: String, required: true },
    method: { type: String, required: true },
    url: { type: String, required: true },
    headers: { type: Object },
    body: { type: Object },
    query: { type: Object },
    timestamp: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export const ServerLogs = mongoose.model("ServerLogs", errorLogSchema);
