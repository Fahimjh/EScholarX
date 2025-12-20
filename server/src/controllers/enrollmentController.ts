import type { Request, Response } from "express";
import Enrollment from "../models/Enrollment";
import Progress from "../models/Progress";


export const enrollCourse = async (req: Request, res: Response) => {
  const userId = (req as any).user.id;
  const { courseId } = req.body;

  const enrollment = await Enrollment.create({
    student: userId,
    course: courseId,
  });

  await Progress.create({
    student: userId,
    course: courseId,
    totalLessons: 10, // placeholder, update dynamically later
  });

  res.status(201).json({ message: "Enrolled successfully", enrollment });
};


export const getMyEnrollments = async (req: Request, res: Response) => {
  const userId = (req as any).user.id;

  const enrollments = await Enrollment.find({ student: userId })
    .populate("course");

  res.json(enrollments);
};

