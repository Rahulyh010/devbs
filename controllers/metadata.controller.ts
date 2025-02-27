import { Request, Response } from "express";
import MetaData from "../models/metaData.model";
import { resHandler } from "../utils/helpers/resHandler";
import Course from "../models/courses.model";

export const upsertDraftMeta = async (req: Request, res: Response) => {
  try {
    const { courseId, ...validatedData } = req.body;

    const courseExists = await Course.findById(courseId);
    if (!courseExists) {
      return resHandler({
        res,
        success: false,
        message: "Course not found",
        code: 404,
      });
    }

    // Check if a draft meta already exists for the given courseId
    let draftMeta = await MetaData.findOne({ courseId, isPublished: false });

    if (draftMeta) {
      // Update existing draft meta
      draftMeta = await MetaData.findByIdAndUpdate(
        draftMeta._id,
        { ...validatedData, isPublished: false },
        { new: true }
      );
    } else {
      // Create a new draft meta
      draftMeta = await MetaData.create({
        ...validatedData,
        courseId,
        isPublished: false,
      });
    }

    resHandler({
      res,
      message: "Draft meta data processed successfully",
      data: draftMeta,
    });
  } catch (error) {
    resHandler({
      res,
      success: false,
      message: "Server error",
      code: 500,
      error,
    });
  }
};

// Publish Meta Data
export const publishMeta = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const validatedData = req.body;

    const updatedMeta = await MetaData.findByIdAndUpdate(
      id,
      { ...validatedData, isPublished: true },
      { new: true }
    );

    if (!updatedMeta) {
      resHandler({
        res,
        success: false,
        message: "Meta data not found",
        code: 404,
      });
      return;
    }

    resHandler({
      res,
      message: "Meta data published successfully",
      data: updatedMeta,
    });
  } catch (error) {
    resHandler({
      res,
      success: false,
      message: "Server error",
      code: 500,
      error,
    });
  }
};

// Get All Meta Data (Filter by isPublished)
export const getAllMeta = async (req: Request, res: Response) => {
  try {
    const { isPublished } = req.query;
    const filter = isPublished ? { isPublished: isPublished === "true" } : {};

    const metaList = await MetaData.find(filter);
    resHandler({
      res,
      message: "Meta data fetched successfully",
      data: metaList,
    });
  } catch (error) {
    resHandler({
      res,
      success: false,
      message: "Server error",
      code: 500,
      error,
    });
  }
};

// Get Meta Data by ID
export const getMetaById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const meta = await MetaData.findOne({
      courseId: id,
    });

    if (!meta) {
      resHandler({
        res,
        success: false,
        message: "Meta data not found",
        code: 404,
      });
      return;
    }

    resHandler({ res, message: "Meta data fetched successfully", data: meta });
  } catch (error) {
    resHandler({
      res,
      success: false,
      message: "Server error",
      code: 500,
      error,
    });
  }
};

// Update Published Meta Data
export const updateMeta = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const validatedData = req.body;

    const updatedMeta = await MetaData.findByIdAndUpdate(id, validatedData, {
      new: true,
    });

    if (!updatedMeta) {
      resHandler({
        res,
        success: false,
        message: "Meta data not found",
        code: 404,
      });
      return;
    }

    resHandler({
      res,
      message: "Meta data updated successfully",
      data: updatedMeta,
    });
  } catch (error) {
    resHandler({
      res,
      success: false,
      message: "Server error",
      code: 500,
      error,
    });
  }
};

// Delete Meta Data
export const deleteMeta = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const deletedMeta = await MetaData.findByIdAndDelete(id);

    if (!deletedMeta) {
      resHandler({
        res,
        success: false,
        message: "Meta data not found",
        code: 404,
      });
      return;
    }

    resHandler({ res, message: "Meta data deleted successfully" });
  } catch (error) {
    resHandler({
      res,
      success: false,
      message: "Server error",
      code: 500,
      error,
    });
  }
};
