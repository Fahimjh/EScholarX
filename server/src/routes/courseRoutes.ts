import express from "express";
import { createCourse, getAllCourses, getCourseById, updateCourse } from "../controllers/courseController";
import { protect, adminOnly } from "../middlerwares/authMiddleware";

const router = express.Router();

router.post("/", protect, adminOnly, createCourse);
router.get("/", getAllCourses);
router.get("/:id", getCourseById);
router.put("/:id", protect, adminOnly, updateCourse);

export default router;
