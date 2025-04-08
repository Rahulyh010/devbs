import { Request, Response } from "express";
import { resHandler } from "../utils/helpers/resHandler";
import Course from "../models/newcourses.model";
import { GetCoursesQuery } from "../validators/courses/newcourse.validator";

// controllers/courses.controller.ts

export const createDraftCourse = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const validatedData = req.body;
    const course = new Course({
      ...validatedData,
      isPublished: false,
    });
    await course.save();
    resHandler({
      res,
      message: "Draft course saved successfully",
      data: course,
      code: 201,
    });
  } catch (error: any) {
    resHandler({
      res,
      success: false,
      message: "Server error",
      code: 500,
      error,
    });
  }
};

export const migrateCategoryToArray = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    // Direct MongoDB updateMany operation
    const result = await Course.collection.updateMany(
      // Find documents where category exists and is not an array
      {
        category: { $exists: true },
        $expr: { $not: { $isArray: "$category" } },
      },
      // Update to wrap the category in an array
      [
        {
          $set: {
            category: ["$category"],
          },
        },
      ]
    );

    resHandler({
      res,
      message: "Category migration completed",
      data: {
        matched: result.matchedCount,
        modified: result.modifiedCount,
      },
      code: 200,
    });
  } catch (error: any) {
    console.error("Migration error:", error);
    resHandler({
      res,
      success: false,
      message: "Migration failed",
      code: 500,
      error: error.message,
    });
  }
};

export const updateDraftCourse = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const validatedData = req.body;
    const course = await Course.findByIdAndUpdate(
      id,
      { ...validatedData, isPublished: false },
      { new: true }
    );
    if (!course) {
      resHandler({
        res,
        success: false,
        message: "Course not found",
        code: 404,
      });
      return;
    }
    resHandler({
      res,
      message: "Draft course updated successfully",
      data: course,
    });
  } catch (error: any) {
    resHandler({
      res,
      success: false,
      message: "Server error",
      code: 500,
      error,
    });
  }
};

// controllers/courses.controller.ts (continued)

export const publishCourse = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const course = await Course.findById(id);
    if (!course) {
      resHandler({
        res,
        success: false,
        message: "Course not found",
        code: 404,
      });
      return;
    }

    // Validate the existing course data using the published schema.
    // (You might need to convert the Mongoose document to a plain object first.)
    const courseObj = course.toObject();
    // Force isPublished to true so the validator will check for all required fields.
    courseObj.isPublished = true;

    // publishedCourseSchema.parse(courseObj); // Throws if missing required fields

    // If validation passes, update the course as published.
    course.isPublished = true;
    await course.save();

    resHandler({
      res,
      message: "Course published successfully",
      data: course,
    });
  } catch (error: any) {
    resHandler({
      res,
      success: false,
      message: "Publishing failed: ",
      code: 500,
      error,
    });
  }
};
export const getAllCourses = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string, 10) || 1;
    const limit = parseInt(req.query.limit as string, 10) || 10;
    const skip = (page - 1) * limit;

    const query = req.query as unknown as GetCoursesQuery;

    // Build filter object
    const filter: any = {};

    // Handle category filtering with proper ObjectId and $in operator
    if (req.query.category) {
      const mongoose = require("mongoose"); // Ensure mongoose is imported
      const categoryId = new mongoose.Types.ObjectId(req.query.category); // Use 'new' keyword
      filter.category = { $in: [categoryId] };
    }

    // Add other filters
    if (query.isPublished !== undefined) {
      filter.isPublished = query.isPublished === "true";
    }

    if (query.type) {
      filter.type = query.type;
    }

    console.log("Filter:", filter);

    // Rest of your code remains the same
    const courses = await Course.find(filter)
      .skip(skip)
      .limit(limit)
      .populate({ path: "banner", select: "viewUrl" })
      .populate({ path: "previewImage", select: "viewUrl" })
      .populate({ path: "logoUrl", select: "viewUrl" })
      .populate({ path: "tools", select: "viewUrl" });

    const totalCourses = await Course.countDocuments(filter);
    const totalPages = Math.ceil(totalCourses / limit);

    resHandler({
      res,
      message: "Courses fetched successfully",
      data: {
        courses,
        pagination: {
          totalItems: totalCourses,
          totalPages,
          currentPage: page,
          itemsPerPage: limit,
        },
      },
    });
  } catch (error) {
    console.error("Error fetching courses:", error);
    resHandler({
      res,
      success: false,
      message: "Server error",
      code: 500,
      error,
    });
  }
};
export const getCourse = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const course = await Course.findById(id)
      .populate({ path: "banner", select: "viewUrl" })
      .populate({ path: "previewImage", select: "viewUrl" })
      .populate({ path: "logoUrl", select: "viewUrl" })
      // Remove the category populate since it doesn't exist in the schema
      .populate({
        path: "tools",
        populate: { path: "logo", select: "viewUrl" },
      });

    if (!course) {
      resHandler({
        res,
        success: false,
        message: "Course not found",
        code: 404,
      });
      return;
    }
    resHandler({
      res,
      message: "Course fetched successfully",
      data: course,
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

export const updateCourse = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const course = await Course.findByIdAndUpdate(id, req.body, { new: true });
    if (!course) {
      resHandler({
        res,
        success: false,
        message: "Course not found",
        code: 404,
      });
      return;
    }
    resHandler({
      res,
      message: "Course updated successfully",
      data: course,
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

export const deleteCourse = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const course = await Course.findByIdAndDelete(id);
    if (!course) {
      resHandler({
        res,
        success: false,
        message: "Course not found",
        code: 404,
      });
      return;
    }
    resHandler({
      res,
      message: "Course deleted successfully",
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
