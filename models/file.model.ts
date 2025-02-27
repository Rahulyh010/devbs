import mongoose, { Schema, Document } from "mongoose";

interface IYourDocument extends Document {
  purpose: string;
  type: string;
  viewUrl: string;
}

const FileSchema: Schema = new Schema(
  {
    purpose: { type: String, required: true },
    type: { type: String, required: true },
    viewUrl: { type: String, required: true },
  },
  { timestamps: true }
);

const FileModel = mongoose.model<IYourDocument>("file", FileSchema);

export default FileModel;
