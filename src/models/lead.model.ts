import mongoose from "mongoose";

const noteSchema = new mongoose.Schema(
  {
    text: { type: String, required: true },
    status: {
      type: String,
      enum: [
        "NEW",
        "Attempted to Contact",
        "Not Contact",
        "In-conversation",
        "Prospect",
        "Not-Eligible",
        "Not-Interested",
        "Spam",
        "Opportunity",
        "Contact-in-Future",
        "Closed-Won",
        "Closed-Lost",
      ],
      required: true,
    },
    addedBy: { type: String }, // Optional: If you want to track who added the note
  },
  { timestamps: true } // This adds createdAt and updatedAt timestamps to each note
);

const leadSchema = new mongoose.Schema(
  {
    name: { type: String, minlength: 3, required: true },
    email: {
      type: String,
      required: true,
    },
    countryCode: { type: String, required: true },
    phoneNumber: {
      type: String,
      required: true,
      minlength: 5,
    },

    type: {
      type: String,
      enum: ["b2i", "b2b", "b2c", "b2g", "general"],
      required: true,
    },
    subCategory: { type: String, enum: ["jobs", "skills"] },
    query: { type: String, required: true, minlength: 10 },
    status: {
      type: String,
      enum: [
        "NEW",
        "Attempted to Contact",
        "Not Contact",
        "In-conversation",
        "Prospect",
        "Not-Eligible",
        "Not-Interested",
        "Spam",
        "Opportunity",
        "Contact-in-Future",
        "Closed-Won",
        "Closed-Lost",
      ],
      default: "NEW",
      required: true,
    },

    websiteUrl: { type: String },
    notes: [noteSchema],
  },
  { timestamps: true }
);

const Lead = mongoose.model("Lead", leadSchema);

export default Lead;
