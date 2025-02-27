import { Router } from "express";
import courseRoutes from "./course.routes";

const router = Router();

router.use("/", courseRoutes);

export default router;
