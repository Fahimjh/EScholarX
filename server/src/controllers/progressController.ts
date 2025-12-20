import type { Request, Response } from "express";
import Progress from "../models/Progress";

export const updateProgress = async (req: Request, res: Response) => {
  const userId = (req as any).user.id;
  const { courseId } = req.body;

  const progress = await Progress.findOne({ student: userId, course: courseId });

  if (!progress) {
    return res.status(404).json({ message: "Progress not found" });
  }

  progress.completedLessons += 1;

  if (progress.completedLessons >= progress.totalLessons) {
    progress.completed = true;
  }

  await progress.save();
  res.json(progress);
};

export const getMyProgress = async (req: Request, res: Response) => {
  const userId = (req as any).user.id;
  const progress = await Progress.find({ student: userId }).populate("course");
  res.json(progress);
};

