import express from "express";
import { enrollCourse, getMyEnrollments } from "../controllers/enrollmentController";
import { protect } from "../middlerwares/authMiddleware";

const router = express.Router();

router.post("/", protect, enrollCourse);
router.get("/my", protect, getMyEnrollments);

export default router;
