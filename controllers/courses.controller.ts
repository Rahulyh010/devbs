import { Request, Response } from "express";
import { resHandler } from "../utils/helpers/resHandler";
import Course from "../models/courses.model";
import { GetCoursesQuery } from "../validators/courses/course.validator";

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

    // Optionally filter by status: if a status query param is provided
    const filter = {
      ...(req.query.category && {
        category: req.query.category,
      }),
      ...(query.isPublished && { isPublished: query.isPublished === "true" }),
    };

    console.log(filter);
    // @ts-ignore
    const courses = await Course.find(filter)
      .skip(skip)
      .limit(limit)
      .populate({ path: "banner", select: "viewUrl" }) // Populate only viewUrl from banner (if exists)
      .populate({ path: "previewImage", select: "viewUrl" }) // Populate only viewUrl from previewImage (if exists)
      .populate({ path: "logoUrl", select: "viewUrl" }); // Populate only viewUrl from logoUrl (if exists)
    // @ts-ignore
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
      .populate({ path: "banner", select: "viewUrl" }) // Populate only viewUrl from banner (if exists)
      .populate({ path: "previewImage", select: "viewUrl" }) // Populate only viewUrl from previewImage (if exists)
      .populate({ path: "logoUrl", select: "viewUrl" }) // Populate only viewUrl from logoUrl (if exists);
      .populate({
        path: "certification",
        populate: { path: "image", select: "viewUrl" },
      })
      .populate({
        path: "partnerShip",
        populate: { path: "image", select: "viewUrl" },
      })
      .populate({
        path: "skills",
        populate: { path: "logo", select: "viewUrl" },
      })
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
