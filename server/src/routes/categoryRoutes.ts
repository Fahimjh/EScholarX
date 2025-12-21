import express from "express";
import { createCategory, getCategories } from "../controllers/categoryController";
import { protect, adminOnly } from "../middlerwares/authMiddleware";

const router = express.Router();

router.post("/", protect, adminOnly, createCategory);
router.get("/", getCategories);

export default router;
