// routes/courses.routes.ts
import { Router } from "express";
// import { createDraftCourse } from "../../controllers/course.controller";
import {
  createDraftCourse,
  updateDraftCourse,
  getAllCourses,
  getCourse,
  updateCourse,
  deleteCourse,
  publishCourse,
} from "../../controllers/courses.controller";
// import { validate } from "../../utils/zodValidtor";
import {
  draftCourseSchema,
  getCoursesQueryValidator,
  publishedCourseSchema,
} from "../../validators/courses/course.validator";
import { validate } from "../../utils/zodValidtor";

const router = Router();

// Create a new course draft
router.post("/draft", validate({ body: draftCourseSchema }), createDraftCourse);
router.get("/draft/:id", getCourse);
// Update an existing course draft
router.put(
  "/draft/:id",
  validate({ body: draftCourseSchema }),
  updateDraftCourse
);

// Publish a course (validate and update as published)
router.post(
  "/:id/publish",
  validate({ body: publishedCourseSchema }),
  publishCourse
);

// Get all courses (can be filtered by query params, e.g., ?isPublished=true)
router.get("/", validate({ query: getCoursesQueryValidator }), getAllCourses);

// Get a single course by id
router.get("/:id", getCourse);

// Update a published course (or any course in general) - if needed
router.patch("/:id", updateCourse);

// Delete a course
router.delete("/:id", deleteCourse);

export default router;
