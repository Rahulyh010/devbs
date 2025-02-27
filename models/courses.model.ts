import mongoose, { Schema, Document, Model } from "mongoose";

export interface IOffer {
  type: "coupon" | "discount";
  value: number;
  code?: string;
}

export interface IOverview {
  title: string;
  description: string;
  certifications?: string[];
  keyFeatures?: string[];
  skillsCovered?: string[];
  trainingOption?: string;
}

export interface IChapterLesson {
  title: string;
  content: string;
}

export interface IChapter {
  title: string;
  lessons: IChapterLesson[];
}

export interface ICurriculum {
  eligibility: string;
  prerequisites: string;
  chapters: IChapter[];
  whyJoin: string;
}

export interface ICourse extends Document {
  title: string;
  description: string;
  durationHours: number;
  startTime: Date;
  endTime: Date;
  offers?: IOffer[];
  isPaid: boolean;
  appliedCount: number;
  trainedCount: number;
  highlights: string[];
  bannerUrl: string;
  previewImageUrl: string;
  logoUrl: string;
  category: string;
  overview: IOverview;
  curriculum: ICurriculum;
  images?: string[];
  isPublished: boolean;
}

// const CourseSchema: Schema = new Schema({
//   title: { type: String, required: true },
//   description: { type: String, required: true },
//   durationHours: { type: Number, required: true },
//   startTime: { type: Date, required: true },
//   endTime: { type: Date, required: true },
//   //   offers: [
//   //     {
//   //       type: { type: String, enum: ["coupon", "discount"], required: true },
//   //       value: { type: Number, required: true },
//   //       code: { type: String },
//   //     },
//   //   ],
//   isPaid: { type: Boolean, required: true },
//   appliedCount: { type: Number, default: 0 },
//   trainedCount: { type: Number, default: 0 },
//   highlights: [{ type: String }],
//   banner: { type: Schema.Types.ObjectId, required: true },
//   previewImage: { type: Schema.Types.ObjectId, required: true },
//   logoUrl: { type: Schema.Types.ObjectId, required: true },
//   category: { type: String, required: true },
//   overview: {
//     title: { type: String, required: true },
//     description: { type: String, required: true },
//     // certifications: [{ type: String }],
//     keyFeatures: [{ type: String }],
//     skillsCovered: [{ type: String }],
//     trainingOption: { type: String },
//   },
//   curriculum: {
//     eligibility: { type: String, required: true },
//     prerequisites: { type: String, required: true },
//     chapters: [
//       {
//         title: { type: String, required: true },
//         lessons: [
//           {
//             title: { type: String, required: true },
//             content: { type: String, required: true },
//           },
//         ],
//       },
//     ],
//     whyJoin: { type: String, required: true },
//   },
//   images: [{ type: Schema.Types.ObjectId }],
//   status: {
//     type: String,
//     enum: ["draft", "published"],
//     default: "draft",
//   },
// });

const CourseSchema: Schema = new Schema({
  title: { type: String },
  variant: { type: Number },
  slug: { type: String },
  description: { type: String },
  skills: [{ type: Schema.Types.ObjectId, ref: "skill" }],
  tools: [{ type: Schema.Types.ObjectId, ref: "tool" }],
  videoUrl: { type: String },
  whyJoin: [{ type: String }],
  durationHours: { type: Number },
  startTime: { type: Date },
  endTime: { type: Date },
  price: {
    amount: {
      type: Number,
    },
    currency: {
      type: String,
      enum: ["INR", "USD", "EUR", "GBP"],
      default: "INR",
    },
  },
  isPaid: { type: Boolean },
  appliedCount: { type: Number, default: 0 },
  trainedCount: { type: Number, default: 0 },
  highlights: [{ type: String }],
  banner: { type: Schema.Types.ObjectId, ref: "file" },
  previewImage: { type: Schema.Types.ObjectId, ref: "file" },
  logoUrl: { type: Schema.Types.ObjectId, ref: "file" },
  category: { type: String },
  certification: {
    image: { type: Schema.Types.ObjectId, ref: "file" },
    title: { type: String },
    content: { type: String },
  },
  partnerShip: {
    image: { type: Schema.Types.ObjectId, ref: "file" },
    title: { type: String },
    content: { type: String },
  },
  jobs: [
    {
      role: { type: String },
      salary: { type: Number },
    },
  ],
  faqs: [
    {
      question: { type: String },
      answer: { type: String },
    },
  ],
  overview: {
    title: { type: String },
    description: { type: String },
    keyFeatures: [{ type: String }],
    skillsCovered: [{ type: String }],
    trainingOption: { type: String },
  },
  curriculum: {
    eligibility: [{ type: String }],
    prerequisites: [{ type: String }],
    projects: [{ title: { type: String }, content: [{ type: String }] }],

    certification: {
      title: { type: String },
      content: { type: String },
      img: { type: Schema.Types.ObjectId, ref: "file" },
    },
    chapters: [
      {
        title: { type: String },
        lessons: [
          {
            title: { type: String },
            content: { type: String },
          },
        ],
      },
    ],
    whyJoin: { type: String },
  },
  images: [{ type: Schema.Types.ObjectId, ref: "file" }],
  isPublished: { type: Boolean, default: false },
});

const Course: Model<ICourse> = mongoose.model<ICourse>(
  "NewCourses",
  CourseSchema
);

export default Course;
