import type { Request, Response } from "express";
import * as fs from "fs";
import Lesson from "../models/Lesson";
import cloudinary from "../config/cloudinary";

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

export const createLesson = async (req: Request, res: Response) => {
  try {
    const { courseId, title, content, order } = req.body;

    if (!courseId || !title) {
      return res
        .status(400)
        .json({ message: "courseId and title are required" });
    }

    const filesArray = (req as any).files as Express.Multer.File[] | undefined;
    const singleFile = (req as any).file as Express.Multer.File | undefined;
    const files = filesArray || (singleFile ? [singleFile] : undefined);

    let media:
      | { url: string; type: "image" | "video" | "pdf" | "file" }[]
      | undefined;

    if (files && files.length > 0) {
      media = [];
      for (const file of files) {
        const uploadResult = await cloudinary.uploader.upload(file.path, {
          resource_type: "auto",
        });

        let mediaType: "image" | "video" | "pdf" | "file";

        switch (uploadResult.resource_type) {
          case "image":
            mediaType = "image";
            break;
          case "video":
            mediaType = "video";
            break;
          case "raw":
          default:
            mediaType =
              file.mimetype === "application/pdf" ? "pdf" : "file";
        }

        media.push({ url: uploadResult.secure_url, type: mediaType });

        fs.promises
          .unlink(file.path)
          .catch(() => undefined);
      }
    }

    const lesson = await Lesson.create({
      course: courseId,
      title,
      content,
      order: order ? Number(order) : 0,
      // keep single fields for backward compatibility using the first media item
      mediaUrl: media && media.length > 0 ? media[0].url : undefined,
      mediaType: media && media.length > 0 ? media[0].type : undefined,
      media,
    });

    res.status(201).json(lesson);
  } catch (error: any) {
    console.error("Error creating lesson:", error);
    res.status(500).json({
      message:
        typeof error?.message === "string"
          ? error.message
          : "Failed to create lesson",
    });
  }
};
