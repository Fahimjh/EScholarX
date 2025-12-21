import express from "express";
import { updateProgress, getMyProgress, completeLesson } from "../controllers/progressController";
import { protect } from "../middlerwares/authMiddleware";

const router = express.Router();

router.post("/update", protect, updateProgress);
router.get("/my", protect, getMyProgress);
router.post("/complete/:lessonId", protect, completeLesson);

export default router;
