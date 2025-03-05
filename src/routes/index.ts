import { Router } from "express";
import categoryRoutes from "./categories";
import fileRoues from "./files";
import courseRoutes from "./new-courses";
import skillRoutes from "./skills";
import toolRoutes from "./tools";
import metadataRoutes from "./metadata.routes";
import leadRoutes from "./leads/lead.routes";
const router = Router();

router.use("/categories", categoryRoutes);
router.use("/files", fileRoues);
router.use("/courses", courseRoutes);
router.use("/skills", skillRoutes);
router.use("/tools", toolRoutes);
router.use("/meta-data", metadataRoutes);
router.use("/lead", leadRoutes);

export default router;
