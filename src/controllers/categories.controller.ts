import { Request, Response } from "express";
import { CategoryModel } from "../models/categories.model";
import { resHandler } from "../utils/helpers/resHandler";
// import { resHandler } from "../utils/helpers/resHandler";

const generateSlug = (text: string): string => {
  return text
    .toLowerCase() // Convert to lowercase
    .replace(/&/g, "") // Remove "&"
    .replace(/\s+/g, "-") // Replace spaces with "-"
    .replace(/[^a-z0-9-]/g, ""); // Remove special characters except "-"
};

export const createCategory = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    console.log(req.body);
    const slug = generateSlug(req.body.name);
    const category = new CategoryModel({
      ...req.body,
      slug,
    });
    await category.save();
    resHandler({
      res,
      message: "Category created successfully",
      data: category,
      code: 201,
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
export const getAllCategories = async (
  req: Request,
  res: Response
): Promise<void> => {
  const page = parseInt(req.query.page as string, 10) || 1;
  const limit = parseInt(req.query.limit as string, 10) || 10;
  const type = req.query.type as "b2c" | "b2b" | "b2i" | "b2g";

  const skip = (page - 1) * limit;
  const filter = {
    ...(req.query.type && {
      type,
    }),
    ...(req.query.isPublished && {
      isPublished: req.query.isPublished,
    }),
  };
  console.log(filter);

  const categories = await CategoryModel.find(filter)
    .skip(skip)
    .limit(limit)
    .populate("logo", "viewUrl");
  // console.log(categories);

  const totalCategories = await CategoryModel.countDocuments();

  const totalPages = Math.ceil(totalCategories / limit);

  resHandler({
    res,
    message: "Categories fetched successfully",
    data: {
      categories,
      pagination: {
        totalItems: totalCategories,
        totalPages,
        currentPage: page,
        itemsPerPage: limit,
      },
    },
  });
};

export const getCategory = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { key } = req.params;
    const category = await CategoryModel.findOne({ key });
    if (!category) {
      resHandler({
        res,
        success: false,
        message: "Category not found",
        code: 404,
      });
      return;
    }
    resHandler({
      res,
      message: "Category fetched successfully",
      data: category,
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

export const updateCategory = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { key } = req.params;
    console.log(key);
    const category = await CategoryModel.findByIdAndUpdate(key, req.body, {
      new: true,
    });
    if (!category) {
      resHandler({
        res,
        success: false,
        message: "Category not found",
        code: 404,
      });
      return;
    }
    resHandler({
      res,
      message: "Category updated successfully",
      data: category,
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

export const deleteCategory = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { key } = req.params;
    console.log(key);
    const category = await CategoryModel.findByIdAndDelete(key);
    if (!category) {
      resHandler({
        res,
        success: false,
        message: "Category not found",
        code: 404,
      });
      return;
    }
    resHandler({ res, message: "Category deleted successfully" });
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
