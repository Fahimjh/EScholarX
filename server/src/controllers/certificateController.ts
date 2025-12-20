import type { Request, Response } from "express";
import Certificate from "../models/Certificate";

export const generateCertificate = async (req: Request, res: Response) => {
  const userId = (req as any).user.id;
  const { courseId } = req.body;

  const cert = await Certificate.create({
    student: userId,
    course: courseId,
  });

  res.json({ message: "Certificate generated", cert });
};

