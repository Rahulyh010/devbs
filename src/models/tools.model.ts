import mongoose, { Schema } from "mongoose";

const ToolSchema = new Schema(
  {
    title: { type: String, required: true, trim: true, unique: true },
    logo: { type: Schema.Types.ObjectId, required: true, ref: "file" },
  },
  { timestamps: true }
);

const ToolModel = mongoose.model("tool", ToolSchema);

export default ToolModel;
