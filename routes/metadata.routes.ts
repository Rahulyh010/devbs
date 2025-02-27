// import express from "express";

import { Router } from "express";
import {
  publishMeta,
  getAllMeta,
  getMetaById,
  updateMeta,
  deleteMeta,
  upsertDraftMeta,
} from "../controllers/metadata.controller";
import { validate } from "../utils/zodValidtor";
import {
  draftMetaSchema,
  publishedMetaSchema,
} from "../validators/metadata/metadata.validator";

const router = Router();

// Create Draft Meta Data
router.post("/draft", upsertDraftMeta);

// Publish Meta Data
router.put(
  "/publish/:id",
  validate({ body: publishedMetaSchema }),
  publishMeta
);

// Get All Meta Data (Filter by isPublished)
router.get("/", getAllMeta);

// Get Meta Data by ID
router.get("/draft/:id", getMetaById);

router.get("/publish/:id", getMetaById);

// Update Published Meta Data
router.put("/:id", validate({ body: publishedMetaSchema }), updateMeta);

// Delete Meta Data
router.delete("/:id", deleteMeta);

export default router;
