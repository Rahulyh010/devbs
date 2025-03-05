import { Router } from "express";
import categoryRoutes from "./category.routes";

const router = Router();

router.use("/", categoryRoutes);

export default router;
