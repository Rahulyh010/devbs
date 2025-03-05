import mongoose, { Schema } from "mongoose";

const SkillSchema = new Schema(
  {
    title: { type: String, required: true, trim: true, unique: true },
    logo: { type: Schema.Types.ObjectId, required: true, ref: "file" },
  },
  { timestamps: true }
);

const SkillModel = mongoose.model("skill", SkillSchema);

export default SkillModel;
