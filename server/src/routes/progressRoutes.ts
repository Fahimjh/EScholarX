import express from "express";
import { updateProgress, getMyProgress } from "../controllers/progressController";
import { protect } from "../middlerwares/authMiddleware";

const router = express.Router();

router.post("/update", protect, updateProgress);
router.get("/my", protect, getMyProgress);

export default router;
