import express from "express";
import {
  getAllUsers,
  getUserByPhone,
} from "../../controllers/formusers.controller";

const router = express.Router();

// 📌 Get all registered users (For Admin)
router.get("/users", getAllUsers);

// 📌 Get a single user by phone number
router.get("/users/:phone", getUserByPhone);

export default router;
