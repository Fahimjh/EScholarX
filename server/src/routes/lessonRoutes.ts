import express from "express";
import { getLessonById, getLessonsByCourse } from "../controllers/lessonController";
import { protect } from "../middlerwares/authMiddleware";

const router = express.Router();

router.get("/:lessonId", protect, getLessonById);
router.get("/by-course/:courseId", protect, getLessonsByCourse);

export default router;
