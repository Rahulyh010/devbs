import { Router } from "express";
import fileRoutes from "./file.routes";
import multer from "multer";

const router = Router();

const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // Example: 5MB file size limit
});

router.use("/", upload.single("file"), fileRoutes);

export default router;
