import { Router } from "express";
import courseRoutes from "./new-course.routes";

const router = Router();

router.use("/", courseRoutes);

export default router;
