import mongoose from "mongoose";

const ReviewSchema = new mongoose.Schema({
  designation: { type: String, required: true },
  linkedinProfile: { type: String, required: true,unique: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  title: { type: String, required: true },
  comment: { type: String, required: true },
  userName: { type: String, required: true },
  userProfilePic: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  published: { type: Boolean, default: false },
});

// export default mongoose.model("Review", ReviewSchema);
const ReviewModel = mongoose.model("Review", ReviewSchema);

export default ReviewModel;