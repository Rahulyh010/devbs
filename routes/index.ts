import { Router } from "express";
import categoryRoutes from "./categories";
import fileRoues from "./files";
import courseRoutes from "./courses";
import skillRoutes from "./skills";
import toolRoutes from "./tools";
import metadataRoutes from "./metadata.routes";
const router = Router();

router.use("/categories", categoryRoutes);
router.use("/files", fileRoues);
router.use("/courses", courseRoutes);
router.use("/skills", skillRoutes);
router.use("/tools", toolRoutes);
router.use("/meta-data", metadataRoutes);

export default router;
