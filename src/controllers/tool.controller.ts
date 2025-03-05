import ToolModel from "../models/tools.model";
import { resHandler } from "../utils/helpers/resHandler";
import { Request, Response } from "express";

export const createTool = async (req: Request, res: Response) => {
  try {
    const validatedData = req.body as any;

    // Check if skill already exists
    const existingTool = await ToolModel.findOne({
      title: validatedData?.title,
    });
    if (existingTool) {
      resHandler({
        res,
        success: false,
        message: "Tool already exists",
        code: 400,
      });
      return;
    }

    const tool = new ToolModel(req.body);
    await tool.save();

    resHandler({
      res,
      success: true,
      message: "Tool created successfully",
      data: tool,
      code: 201,
    });
  } catch (error) {
    resHandler({
      res,
      data: null,
      success: false,
      message: "Server error",
      code: 500,
      error,
    });
  }
};

export const getTools = async (req: Request, res: Response): Promise<void> => {
  try {
    const skills = await ToolModel.find()
      .populate({
        path: "logo",
        select: "viewUrl", // Fetch only the viewUrl field
      })
      .sort({ createdAt: -1 });

    resHandler({
      res,
      message: "Tools retrieved successfully",
      data: skills,
      code: 200,
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

export const deleteTool = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const tool = await ToolModel.findByIdAndDelete(id);
    if (!tool) {
      resHandler({
        res,
        success: false,
        message: "Tool not found",
        code: 404,
      });
      return;
    }
    resHandler({
      res,
      message: "Tool deleted successfully",
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

export const updateTool = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const validatedData = req.body;
    const tool = await ToolModel.findByIdAndUpdate(id, validatedData, {
      new: true,
    });
    if (!tool) {
      resHandler({
        res,
        success: false,
        message: "Tool not found",
        code: 404,
      });
      return;
    }
    resHandler({
      res,
      message: "Tool updated successfully",
      data: tool,
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
