import { Router } from "express";
import fileRoutes from "./file.routes";

const router = Router();

router.use("/", fileRoutes);

export default router;
