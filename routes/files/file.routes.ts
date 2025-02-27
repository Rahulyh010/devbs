import { Router } from "express";
import { createFile, deleteFile } from "../../controllers/files.controller";
// import { validate } from "../../utils/zodValidtor";
import { fileZodSchema } from "../../validators/files/file.validator";

const router = Router();

router.post("/", createFile);
// router.get('/files', getFiles);
// router.put('/files/:id', updateFile);
router.delete("/:id", deleteFile);

export default router;
