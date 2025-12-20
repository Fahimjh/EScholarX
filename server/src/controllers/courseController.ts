import type { Request, Response } from "express";
import Course from "../models/Course";

export const createCourse = async (req: Request, res: Response) => {
  const course = await Course.create(req.body);
  res.status(201).json(course);
};

export const getAllCourses = async (_: Request, res: Response) => {
  const courses = await Course.find().populate("category");
  res.json(courses);
};
