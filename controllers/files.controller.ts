import { Request, Response, NextFunction } from "express";

import AWS from "aws-sdk";
import dotenv from "dotenv";
import FileModel from "../models/file.model";
import { resHandler } from "../utils/helpers/resHandler";

dotenv.config();

const s3 = new AWS.S3({
  accessKeyId: process.env.S3_ACCESS_KEY,
  secretAccessKey: process.env.S3_SECRET_KEY,
  region: process.env.S3_REGION,
});

// Create a new file
export const createFile = async (req: Request, res: Response) => {
  try {
    const { purpose, type } = req.body;
    console.log(req.file);
    const file = req.file;

    if (!file) {
      console.log(file);
      resHandler({
        message: "File is required",
        res,
        code: 400,
        data: null,
      });
      return;
    }

    const params = {
      Bucket: process.env.S3_BUCKET_NAME!,
      Key: `files/${Date.now()}_${file.originalname}`,
      Body: file.buffer,
    };

    const upload = await s3.upload(params).promise();

    const newFile = await FileModel.create({
      purpose,
      type,
      viewUrl: upload.Location,
    });

    resHandler({
      message: "File uploaded successfully",
      res,
      code: 201,
      data: newFile,
    });
  } catch (error: any) {
    resHandler({
      message: "File uploadation failed",
      res,
      code: 500,
      success: false,
    });
    // next(new ErrorHandler(error.message, 500));
  }
};

export const deleteFile = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    // Extract the file ID from request parameters
    const { id } = req.params;

    // Find the file in the database by its ID
    const file = await FileModel.findById(id);
    if (!file) {
      resHandler({
        res,
        message: "File not found",
        code: 404,
        data: null,
      });
      return;
    }

    // Delete the file document from MongoDB
    await file.deleteOne();

    resHandler({
      res,
      message: "File record deleted successfully",
      code: 200,
      data: null,
    });
  } catch (error: any) {
    console.error("Error deleting file:", error);
    resHandler({
      res,
      message: "File deletion failed",
      code: 500,
      success: false,
    });
  }
};
