import express from "express";
import {
  getReviews,
  publishReview,
  submitReview,
} from "../controllers/review.controller";
// import { submitReview } from "../controllers/reviewController";

const router = express.Router();

router.post("/reviews", submitReview);
router.get("/reviews", getReviews);

router.put("/reviews/:id/publish", publishReview);

export default router;
