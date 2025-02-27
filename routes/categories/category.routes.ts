import express from "express";
import {
  createCategory,
  deleteCategory,
  getAllCategories,
  getCategory,
  updateCategory,
} from "../../controllers/categories.controller";
// import { validate } from "../../utils/zodValidtor";
import {
  createCategoryValidator,
  fetchCategoryvalidator,
} from "../../validators/categories";
import { updateCategorySchema } from "../../validators/categories/category.validator";
import { validate } from "../../utils/zodValidtor";

const router = express.Router();

router.post("/", validate(createCategoryValidator), createCategory);

router.get("/", validate({ query: fetchCategoryvalidator }), getAllCategories);
router.get("/:key", getCategory);
router.put("/:key", validate({ body: updateCategorySchema }), updateCategory);
router.delete("/:key", deleteCategory);

export default router;
