import { Request, Response } from "express";
import SkillModel from "../models/skills.model";
import { resHandler } from "../utils/helpers/resHandler";

/**
 * @desc    Create a new skill
 * @route   POST /api/skills
 * @access  Public / Protected (Adjust as needed)
 */
export const createSkill = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    // Validate request body
    const validatedData = req.body;

    // Check if skill already exists
    const existingSkill = await SkillModel.findOne({
      title: validatedData.title,
    });
    if (existingSkill) {
      resHandler({
        res,
        success: false,
        message: "Skill already exists",
        code: 400,
      });
      return;
    }

    // Generate slug & create new skill
    const skill = new SkillModel({
      ...validatedData,
    });

    await skill.save();

    resHandler({
      res,
      message: "Skill created successfully",
      data: skill,
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

/**
 * @desc    Get all skills
 * @route   GET /api/skills
 * @access  Public
 */
export const getSkills = async (req: Request, res: Response): Promise<void> => {
  try {
    const skills = await SkillModel.find().sort({ createdAt: -1 });

    resHandler({
      res,
      message: "Skills retrieved successfully",
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

/**
 * @desc    Get a single skill by slug
 * @route   GET /api/skills/:slug
 * @access  Public
 */
export const getSkillBySlug = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { slug } = req.params;
    const skill = await SkillModel.findOne({ slug });

    if (!skill) {
      resHandler({
        res,
        success: false,
        message: "Skill not found",
        code: 404,
      });
      return;
    }

    resHandler({
      res,
      message: "Skill retrieved successfully",
      data: skill,
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

/**
 * @desc    Update a skill
 * @route   PUT /api/skills/:id
 * @access  Protected
 */
export const updateSkill = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;

    // Validate request body
    const validatedData = req.body;

    const skill = await SkillModel.findById(id);
    if (!skill) {
      resHandler({
        res,
        success: false,
        message: "Skill not found",
        code: 404,
      });
      return;
    }

    // Update slug if title is changed

    const updatedSkill = await SkillModel.findByIdAndUpdate(id, validatedData, {
      new: true,
    });

    resHandler({
      res,
      message: "Skill updated successfully",
      data: updatedSkill,
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

/**
 * @desc    Delete a skill
 * @route   DELETE /api/skills/:id
 * @access  Protected
 */
export const deleteSkill = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const skill = await SkillModel.findById(id);

    if (!skill) {
      resHandler({
        res,
        success: false,
        message: "Skill not found",
        code: 404,
      });
      return;
    }

    await skill.deleteOne();

    resHandler({
      res,
      message: "Skill deleted successfully",
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
