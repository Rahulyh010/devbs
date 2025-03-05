import { Router } from "express";
import {
  createTool,
  deleteTool,
  getTools,
  updateTool,
} from "../../controllers/tool.controller";

const router = Router();

router.post("/", createTool);
router.get("/", getTools);
router.put("/:id", updateTool);
router.delete("/:id", deleteTool);

export default router;
