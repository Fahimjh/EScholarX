import express from "express";
import { createCourse, getAllCourses } from "../controllers/courseController";
import { protect, adminOnly } from "../middlerwares/authMiddleware";

const router = express.Router();

router.post("/", protect, adminOnly, createCourse);
router.get("/", getAllCourses);

export default router;
