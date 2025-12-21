import type { Request, Response } from "express";
import Enrollment from "../models/Enrollment";
import Progress from "../models/Progress";
import Course from "../models/Course";
import User from "../models/User";
import { sendEmail } from "../utils/sendEmail";


export const enrollCourse = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const { courseId } = req.body;

    if (!courseId) {
      return res.status(400).json({ message: "courseId is required" });
    }

    // Avoid duplicate enrollments
    const existing = await Enrollment.findOne({ student: userId, course: courseId });
    if (existing) {
      return res.status(400).json({ message: "You are already enrolled in this course." });
    }

    const enrollment = await Enrollment.create({
      student: userId,
      course: courseId,
    });

    await Progress.create({
      student: userId,
      course: courseId,
      totalLessons: 10, // placeholder, update dynamically later
    });

    // Send congratulations email with course price information
    const [course, user] = await Promise.all([
      Course.findById(courseId),
      User.findById(userId),
    ]);

    if (course && user) {
      const price = (course as any).price;
      const priceText = typeof price === "number" ? price.toFixed(2) : String(price);
      const subject = `Congratulations on enrolling in ${course.title}`;
      const text = `Hi ${user.name},\n\n` +
        `You have successfully enrolled in the course "${course.title}".\n` +
        `Course price (for future payments): BDT ${priceText}.\n\n` +
        `You can now start learning from your dashboard.\n\n` +
        `Best regards,\n` +
        `ScholarX Team`;

      // We don't block enrollment if email fails
      try {
        await sendEmail(user.email, subject, text);
      } catch {
        // ignore email errors for now
      }
    }

    res.status(201).json({ message: "Enrolled successfully", enrollment });
  } catch (error: any) {
    console.error("Error enrolling course:", error);
    res.status(500).json({
      message:
        typeof error?.message === "string"
          ? error.message
          : "Failed to enroll in course",
    });
  }
};


export const getMyEnrollments = async (req: Request, res: Response) => {
  const userId = (req as any).user.id;

  const enrollments = await Enrollment.find({ student: userId }).populate("course");

  res.json(enrollments);
};

