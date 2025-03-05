import mongoose from "mongoose";

const leadSchema = new mongoose.Schema(
  {
    name: { type: String, minlength: 3, required: true },
    email: {
      type: String,
      required: true,
      match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    },
    phoneNumber: { type: String, required: true, match: /^\d{10,15}$/ }, // Supports 10-15 digit numbers
    category: {
      type: String,
      enum: [
        "individual_course",
        "corporate_training",
        "institutional",
        "government",
      ],
      required: true,
    },
    subCategory: { type: String, required: false },
    query: { type: String, required: true, minlength: 10 },
  },
  { timestamps: true }
);

const Lead = mongoose.model("Lead", leadSchema);

export default Lead;
