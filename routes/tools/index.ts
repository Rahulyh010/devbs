import { Router } from "express";
import toolRoutes from "./tools.routes";

const router = Router();

router.use("/", toolRoutes);

export default router;
