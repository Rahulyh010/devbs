import { Router } from "express";
import { getFormQuestions } from "../controllers/question.controller";

const router = Router();

router.get("/:formId", getFormQuestions);

export default router;
