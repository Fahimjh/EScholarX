import type { Request, Response } from "express";
import Progress from "../models/Progress";
import Lesson from "../models/Lesson";

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

export const completeLesson = async (req: Request, res: Response) => {
  const userId = (req as any).user.id;
  const { lessonId } = req.params;

  try {
    const lesson = await Lesson.findById(lessonId);
    if (!lesson) {
      return res.status(404).json({ message: "Lesson not found" });
    }

    const progress = await Progress.findOne({
      student: userId,
      course: lesson.course,
    });

    if (!progress) {
      return res.status(404).json({ message: "Progress not found for this course" });
    }

    if (progress.completedLessons < progress.totalLessons) {
      progress.completedLessons += 1;
    }

    if (progress.completedLessons >= progress.totalLessons) {
      progress.completed = true;
    }

    await progress.save();
    res.json(progress);
  } catch (error) {
    res.status(500).json({ message: "Failed to update progress" });
  }
};


