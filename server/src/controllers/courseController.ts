import type { Request, Response } from "express";
import Course from "../models/Course";

export const createCourse = async (req: Request, res: Response) => {
  try {
    const course = await Course.create(req.body);
    res.status(201).json(course);
  } catch (error: any) {
    console.error("Error creating course:", error);
    res.status(400).json({
      message:
        typeof error?.message === "string"
          ? error.message
          : "Failed to create course",
    });
  }
};

export const getAllCourses = async (_: Request, res: Response) => {
  try {
    const courses = await Course.find().populate("category");
    res.json(courses);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch courses" });
  }
};

export const updateCourse = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const course = await Course.findByIdAndUpdate(id, req.body, { new: true });
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }
    res.json(course);
  } catch (error) {
    res.status(500).json({ message: "Failed to update course" });
  }
};
