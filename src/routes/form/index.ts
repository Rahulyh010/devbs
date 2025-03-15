import { Router } from "express";
import formRoutes from "./form.routes";
import formuserRoutes from "./formusers.routes";

const router = Router();

router.use("/", formRoutes);
router.use("/", formuserRoutes);

export default router;
