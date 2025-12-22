import type { Request, Response } from "express";
import mongoose from "mongoose";
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
  const { mediaId } = req.body as { mediaId?: string };

  try {
    if (!mediaId) {
      return res.status(400).json({ message: "mediaId is required" });
    }

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
    // Ensure totals are initialized (for older progress documents)
    if (!progress.totalLessons || !progress.totalMaterials) {
      const lessonsForCourse = await Lesson.find({ course: lesson.course });
      progress.totalLessons = lessonsForCourse.length;
      let totalMaterials = 0;
      lessonsForCourse.forEach((l) => {
        const mediaItems = Array.isArray((l as any).media)
          ? (l as any).media
          : [];
        if (mediaItems.length > 0) {
          totalMaterials += mediaItems.length;
        } else if ((l as any).mediaUrl) {
          totalMaterials += 1;
        }
      });
      progress.totalMaterials = totalMaterials;
    }

    const mediaIdStr = String(mediaId);

    // Avoid double-counting the same material
    const alreadyCompleted = (progress.completedMaterialEntries || []).some(
      (entry: any) =>
        String(entry.lesson) === String(lessonId) && entry.mediaId === mediaIdStr
    );

    if (!alreadyCompleted) {
      // Use the lesson's ObjectId so types stay consistent
      const lessonObjectId =
        (lesson as any)._id instanceof mongoose.Types.ObjectId
          ? (lesson as any)._id
          : new mongoose.Types.ObjectId(String((lesson as any)._id));

      (progress.completedMaterialEntries as any).push({
        lesson: lessonObjectId,
        mediaId: mediaIdStr,
      });
      (progress as any).completedMaterials =
        (progress as any).completedMaterials + 1 || 1;
    }

    // Check if this lesson is now fully completed
    const mediaItemsForLesson = Array.isArray((lesson as any).media)
      ? (lesson as any).media
      : [];
    const lessonMediaCount =
      mediaItemsForLesson.length > 0
        ? mediaItemsForLesson.length
        : (lesson as any).mediaUrl
        ? 1
        : 0;

    if (lessonMediaCount > 0) {
      const completedForLesson = (progress.completedMaterialEntries || []).filter(
        (entry: any) => String(entry.lesson) === String(lessonId)
      ).length;

      const lessonAlreadyCounted = (progress.completedLessonIds || []).some(
        (id: any) => String(id) === String(lessonId)
      );

      if (completedForLesson >= lessonMediaCount && !lessonAlreadyCounted) {
        (progress as any).completedLessons =
          (progress as any).completedLessons + 1 || 1;
        (progress.completedLessonIds as any).push((lesson as any)._id);
      }
    }

    if (
      (progress.totalMaterials &&
        progress.completedMaterials >= progress.totalMaterials) ||
      (progress.totalLessons &&
        progress.completedLessons >= progress.totalLessons)
    ) {
      progress.completed = true;
    }

    await progress.save();
    res.json(progress);
  } catch (error) {
    res.status(500).json({ message: "Failed to update progress" });
  }
};

export const getCourseProgress = async (req: Request, res: Response) => {
  const userId = (req as any).user.id;
  const { courseId } = req.params;

  try {
    const progress = await Progress.findOne({ student: userId, course: courseId });
    if (!progress) {
      return res.status(404).json({ message: "Progress not found for this course" });
    }
    res.json(progress);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch course progress" });
  }
};


