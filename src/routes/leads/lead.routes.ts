// routes/lead.routes.ts
import { Router } from "express";

import {
  createLead,
  getLeads,
  deleteLead,
  updateLead,
} from "../../controllers/lead.controller";
import { validate } from "../../utils/zodValidtor";
import { leadEditSchema, leadSchema } from "../../validators/lead.validator";

const router = Router();

router.post("/", validate({ body: leadSchema }), createLead);
router.get("/", getLeads);
router.put("/:id", validate({ body: leadEditSchema }), updateLead);
router.delete("/:id", deleteLead);

export default router;
