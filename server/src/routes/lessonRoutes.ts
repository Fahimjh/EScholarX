import express from "express";
import multer from "multer";
import {
	getLessonById,
	getLessonsByCourse,
	createLesson,
} from "../controllers/lessonController";
import { protect, adminOnly } from "../middlerwares/authMiddleware";

const router = express.Router();
const upload = multer({ dest: "uploads/" });

router.get("/:lessonId", protect, getLessonById);
router.get("/by-course/:courseId", protect, getLessonsByCourse);
router.post("/", protect, adminOnly, upload.any(), createLesson);

export default router;
