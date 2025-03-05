import { Request, Response } from "express";
import ReviewModel from "../models/review.model";

const validateLinkedInURL = (url: string) => {
  return /^(https?:\/\/)?(www\.)?linkedin\.com\/in\/[A-Za-z0-9-]+\/?$/.test(
    url
  );
};

export const submitReview = async (req: Request, res: Response) => {
  try {
    const {
      linkedinProfile,
      rating,
      title,
      comment,
      userName,
      userProfilePic,
      designation,
    } = req.body;

    if (!validateLinkedInURL(linkedinProfile)) {
      return res.status(400).json({ message: "Invalid LinkedIn Profile URL" });
    }

    const newReview = new ReviewModel({
      linkedinProfile,
      rating,
      title,
      comment,
      userName,
      userProfilePic,
      designation,
    });
    await newReview.save();

    res.status(201).json({ message: "Review submitted successfully!" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getReviews = async (req: Request, res: Response) => {
  try {
    const { isPublished, page = 1, limit = 10 } = req.query;

    // Convert query params to correct types
    const filter: any = {};
    if (isPublished !== undefined) {
      filter.published = isPublished === "true"; // Convert string to boolean
    }

    const pageNumber = parseInt(page as string, 10);
    const limitNumber = parseInt(limit as string, 10);

    // Get total count (for pagination)
    const total = await ReviewModel.countDocuments(filter);

    // Fetch paginated reviews
    const reviews = await ReviewModel.find(filter)
      .sort({ createdAt: -1 }) // Sort by latest first
      .skip((pageNumber - 1) * limitNumber)
      .limit(limitNumber);

    res.status(200).json({
      total, // Total number of reviews matching the filter
      page: pageNumber,
      limit: limitNumber,
      totalPages: Math.ceil(total / limitNumber),
      reviews, // Paginated results
    });
  } catch (error) {
    console.error("Error fetching reviews:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Controller to update the publish status of a review
export const publishReview = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { isPublished } = req.body;

    if (typeof isPublished !== "boolean") {
      return res.status(400).json({ message: "Invalid isPublished value" });
    }

    const review = await ReviewModel.findByIdAndUpdate(
      id,
      { published: isPublished },
      { new: true }
    );

    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }

    res.status(200).json({ message: "Review publish status updated", review });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Route setup (in your routes file)
