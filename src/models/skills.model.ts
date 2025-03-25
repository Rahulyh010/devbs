import mongoose, { Schema } from "mongoose";

const SkillSchema = new Schema(
  {
    title: { type: String, required: true, trim: true, unique: true },
  },
  { timestamps: true }
);

const SkillModel = mongoose.model("skill", SkillSchema);

export default SkillModel;
