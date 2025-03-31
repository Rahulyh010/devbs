// controllers/lead.controller.ts
import { Request, Response } from "express";
import Lead from "../models/lead.model";
import { resHandler } from "../utils/helpers/resHandler";
import { LeadSchema } from "../validators/lead.validator";

// Create a new lead
export const createLead = async (req: Request, res: Response) => {
  try {
    const { email, type, phoneNumber } = req.body as unknown as LeadSchema;

    // Build query object for finding existing lead
    const query: any = {
      email,
      phoneNumber,
      type,
    };

    // Only add subCategory to query if it exists in the request body
    if (req.body.subCategory) {
      query.subCategory = req.body.subCategory;
    }

    // Check if a lead with the same details already exists
    const existingLead = await Lead.findOne(query);

    if (existingLead) {
      return resHandler({
        res,
        success: false,
        message:
          "You have already submitted a request for this program. Our team will contact you soon.",
        code: 409, // Conflict status code
      });
    }
    const lead = new Lead(req.body);
    await lead.save();

    resHandler({
      res,
      success: true,
      message: "Lead created successfully",
      data: lead,
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

// Get all leads
export const getLeads = async (req: Request, res: Response) => {
  try {
    const leads = await Lead.find().sort({ createdAt: -1 });
    resHandler({
      res,
      success: true,
      message: "Leads retrieved successfully",
      data: leads,
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

// Delete a lead
export const deleteLead = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const lead = await Lead.findByIdAndDelete(id);
    if (!lead) {
      resHandler({ res, success: false, message: "Lead not found", code: 404 });
      return;
    }
    resHandler({ res, success: true, message: "Lead deleted successfully" });
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

// Update a lead
export const updateLead = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const lead = await Lead.findByIdAndUpdate(id, req.body, { new: true });
    if (!lead) {
      resHandler({ res, success: false, message: "Lead not found", code: 404 });
      return;
    }
    resHandler({
      res,
      success: true,
      message: "Lead updated successfully",
      data: lead,
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
