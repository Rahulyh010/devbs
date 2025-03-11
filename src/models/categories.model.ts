import mongoose, { Schema, InferSchemaType, Model } from "mongoose";

const MainCategorySchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
      maxlength: 100,
    },
    type: {
      type: String,
      enum: ["b2i", "b2b", "b2c", "b2g"],
      required: true,
    },
    slug: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      minlength: 3,
      maxlength: 100,
    },
    logo: {
      type: Schema.Types.ObjectId,
      ref: "file",
    },
    isPublished: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export type IMainCategory = InferSchemaType<typeof MainCategorySchema>; // Extract type here

export const CategoryModel: Model<IMainCategory> = mongoose.model(
  "Category",
  MainCategorySchema
);
