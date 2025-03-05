import express from "express";
import {
  createSkill,
  updateSkill,
  deleteSkill,
  getSkills,
} from "../../controllers";
// import {
//   createSkillValidator,
//   fetchSkillValidator,
// } from "../../validators/skills/skill.validator";
import { validate } from "../../utils/zodValidtor";
import {
  createSkillValidator,
  fetchSkillValidator,
} from "../../validators/skills/skill.validator";

const router = express.Router();

router.post("/", validate({ body: createSkillValidator }), createSkill);
router.get("/", validate({ query: fetchSkillValidator }), getSkills);
router.put("/:id", updateSkill);
router.delete("/:id", deleteSkill);

export default router;
