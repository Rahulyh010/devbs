import { Request, Response, NextFunction } from "express";

import AWS from "aws-sdk";
import dotenv from "dotenv";
import FileModel from "../models/file.model";
import { resHandler } from "../utils/helpers/resHandler";
import sharp from "sharp";
dotenv.config();

const s3 = new AWS.S3({
  accessKeyId: process.env.S3_ACCESS_KEY,
  secretAccessKey: process.env.S3_SECRET_KEY,
  region: process.env.S3_REGION,
});

// Create a new file
// export const createFile = async (req: Request, res: Response) => {
//   try {
//     const { purpose, type } = req.body;
//     console.log(req.file);
//     const file = req.file;

//     if (!file) {
//       console.log(file);
//       resHandler({
//         message: "File is required",
//         res,
//         code: 400,
//         data: null,
//       });
//       return;
//     }

//     const params = {
//       Bucket: process.env.S3_BUCKET_NAME!,
//       Key: `files/${Date.now()}_${file.originalname}`,
//       Body: file.buffer,
//     };

//     const upload = await s3.upload(params).promise();

//     const newFile = await FileModel.create({
//       purpose,
//       type,
//       viewUrl: upload.Location,
//     });

//     resHandler({
//       message: "File uploaded successfully",
//       res,
//       code: 201,
//       data: newFile,
//     });
//   } catch (error: any) {
//     resHandler({
//       message: "File uploadation failed",
//       res,
//       code: 500,
//       success: false,
//     });
//     // next(new ErrorHandler(error.message, 500));
//   }
// };
export const createFile = async (req: Request, res: Response) => {
  try {
    const { purpose, type } = req.body;
    const file = req.file;

    if (!file) {
      resHandler({
        message: "File is required",
        res,
        code: 400,
        data: null,
      });
      return;
    }

    const metadata = await sharp(file.buffer).metadata();
    const fileExt = file.mimetype.split("/")[1]; // Extract file type (e.g., png, jpg, webp)

    let optimizedImageBuffer = file.buffer; // Default: use the original buffer
    const fileSize = file.buffer.length; // Get file size in bytes

    console.log(fileSize);
    if (fileSize > 102400 && fileExt !== "webp") {
      optimizedImageBuffer = await sharp(file.buffer)
        .resize(1080) // Resize width to 1080px (adjustable)
        .webp({ quality: 80 }) // Convert to WebP with 80% quality
        .toBuffer();
    }

    // Only optimize if:
    // 1. It's NOT WebP, OR
    // 2. It's WebP but width > 1080px
    // if (metadata.width && metadata.width > 1080) {
    //   optimizedImageBuffer = await sharp(file.buffer)
    //     .resize(metadata.width && metadata.width > 1080 ? 1080 : undefined) // Resize if needed
    //     .webp({ quality: 80 }) // Convert to WebP
    //     .toBuffer();
    // }

    // // Convert image to WebP and optimize
    // const optimizedImage = await sharp(file.buffer)
    //   .resize(1080) // Resize width to 1080px (adjustable)
    //   .webp({ quality: 80 }) // Convert to WebP with 80% quality
    //   .toBuffer();

    const fileName = `files/${Date.now()}_${
      file.originalname.split(".")[0]
    }.webp`;

    const params = {
      Bucket: process.env.S3_BUCKET_NAME!,
      Key: fileName,
      Body: optimizedImageBuffer,
      ContentType: "image/webp",
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
