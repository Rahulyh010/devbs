import mongoose, { Schema, Document, Model } from "mongoose";

export interface ICourseSEO extends Document {
  courseId: Schema.Types.ObjectId; // Reference to the Course
  metaTitle?: string; // Optional for draft, required for published
  metaDescription?: string;
  metaKeywords?: string[];
  metaUrl?: string;
  metaImage?: Schema.Types.ObjectId; // For social sharing
  ogTitle?: string;
  ogDescription?: string;
  ogType?: "website" | "article" | "course";
  ogImage?: Schema.Types.ObjectId;
  twitterCard?: "summary" | "summary_large_image";
  twitterTitle?: string;
  twitterDescription?: string;
  twitterImage?: Schema.Types.ObjectId;
  schemaMarkup?: string; // JSON-LD structured data
  sitemapPriority?: number; // 0.1 to 1.0
  robotsIndex?: boolean; // true = index, false = noindex
  robotsFollow?: boolean; // true = follow links, false = nofollow
  isPublished: boolean; // Distinguishes drafts from published metadata
}

const CourseSEOSchema: Schema = new Schema({
  courseId: {
    type: Schema.Types.ObjectId,
    ref: "NewCourses",
    required: true,
    unique: true,
  },
  metaTitle: {
    type: String,
    required: function (this: ICourseSEO) {
      return this.isPublished;
    },
  },
  metaDescription: {
    type: String,
    required: function (this: ICourseSEO) {
      return this.isPublished;
    },
  },
  metaKeywords: [{ type: String }],
  metaUrl: {
    type: String,
    required: function (this: ICourseSEO) {
      return this.isPublished;
    },
  },
  metaImage: { type: Schema.Types.ObjectId, ref: "file" },
  ogTitle: { type: String },
  ogDescription: { type: String },
  ogType: {
    type: String,
    enum: ["website", "article", "course"],
    default: "course",
  },
  ogImage: { type: Schema.Types.ObjectId, ref: "file" },
  twitterCard: {
    type: String,
    enum: ["summary", "summary_large_image"],
    default: "summary_large_image",
  },
  twitterTitle: { type: String },
  twitterDescription: { type: String },
  twitterImage: { type: Schema.Types.ObjectId, ref: "file" },
  schemaMarkup: { type: String },
  sitemapPriority: { type: Number, min: 0.1, max: 1.0, default: 0.5 },
  robotsIndex: { type: Boolean, default: true },
  robotsFollow: { type: Boolean, default: true },
  isPublished: { type: Boolean, default: false }, // Controls draft vs. published state
});

const CourseSEO: Model<ICourseSEO> = mongoose.model<ICourseSEO>(
  "CourseMetaData",
  CourseSEOSchema
);

export default CourseSEO;
