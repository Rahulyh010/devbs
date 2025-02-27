import mongoose, { Schema, InferSchemaType, Model } from "mongoose";

const MainCategorySchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      index: true,
      minlength: 3,
      maxlength: 100,
    },
    slug: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      index: true,
      lowercase: true,
      minlength: 3,
      maxlength: 100,
    },
    logo: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "file",
    },
  },
  { timestamps: true }
);

export type IMainCategory = InferSchemaType<typeof MainCategorySchema>; // Extract type here

export const CategoryModel: Model<IMainCategory> = mongoose.model(
  "Category",
  MainCategorySchema
);
