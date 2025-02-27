import { Router } from "express";
import SkillRoutes from "./skill.routes";

const router = Router();

router.use("/", SkillRoutes);

export default router;
