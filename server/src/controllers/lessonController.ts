import type { Request, Response } from "express";
import Lesson from "../models/Lesson";

export const getLessonById = async (req: Request, res: Response) => {
  try {
    const { lessonId } = req.params;
    const lesson = await Lesson.findById(lessonId).populate("course");

    if (!lesson) {
      return res.status(404).json({ message: "Lesson not found" });
    }

    res.json(lesson);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch lesson" });
  }
};

export const getLessonsByCourse = async (req: Request, res: Response) => {
  try {
    const { courseId } = req.params;
    const lessons = await Lesson.find({ course: courseId }).sort({ order: 1 });
    res.json(lessons);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch lessons" });
  }
};
