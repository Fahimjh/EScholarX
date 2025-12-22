import type { Request, Response } from "express";
import mongoose from "mongoose";
// eslint-disable-next-line @typescript-eslint/no-var-requires
const SSLCommerzPayment = require("sslcommerz-lts");
import Course from "../models/Course";
import User from "../models/User";
import Enrollment from "../models/Enrollment";
import Lesson from "../models/Lesson";
import Progress from "../models/Progress";

const getSslConfig = () => {
  const storeId = process.env.SSLCZ_STORE_ID;
  const storePassword = process.env.SSLCZ_STORE_PASSWD;
  const isLive = process.env.SSLCZ_IS_SANDBOX === "false";

  if (!storeId || !storePassword) {
    throw new Error("SSLCommerz credentials are not configured");
  }

  return { storeId, storePassword, isLive };
};

// Create a payment session and return the gateway redirect URL
export const createPaymentSession = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const { courseId } = req.body as { courseId?: string };

    if (!courseId) {
      return res.status(400).json({ message: "courseId is required" });
    }

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    const price = (course as any).price;
    const amount = typeof price === "number" ? price : Number(price) || 0;
    if (!amount || amount <= 0) {
      return res
        .status(400)
        .json({ message: "This course does not have a valid price set." });
    }

    const user = await User.findById(userId);

    const { storeId, storePassword, isLive } = getSslConfig();
    const tranId = `COURSE_${courseId}_${userId}_${Date.now()}`;

    const baseUrl = process.env.BASE_URL || "http://localhost:5000";
    const sslData = {
      store_id: storeId,
      store_passwd: storePassword,
      total_amount: amount,
      currency: "BDT",
      tran_id: tranId,
      success_url: `${baseUrl}/api/payments/success`,
      fail_url: `${baseUrl}/api/payments/fail`,
      cancel_url: `${baseUrl}/api/payments/cancel`,
      ipn_url: `${baseUrl}/api/payments/ipn`,
      shipping_method: "NO",
      product_name: course.title,
      product_category: "Course",
      product_profile: "non-physical-goods",
      cus_name: user?.name || "Student",
      cus_email: user?.email || "student@example.com",
      cus_add1: "Dhaka",
      cus_city: "Dhaka",
      cus_postcode: "1000",
      cus_country: "Bangladesh",
      cus_phone: (user as any)?.phone || "01700000000",
      value_a: userId,
      value_b: courseId,
    } as any;

    const sslcz = new SSLCommerzPayment(storeId, storePassword, isLive);
    const apiResponse = await sslcz.init(sslData);

    const gatewayUrl = apiResponse?.GatewayPageURL as string | undefined;

    if (!gatewayUrl) {
      return res
        .status(500)
        .json({ message: "Failed to create payment session" });
    }

    return res.json({ url: gatewayUrl, tranId });
  } catch (error: any) {
    console.error("Error creating payment session:", error);
    return res.status(500).json({
      message:
        typeof error?.message === "string"
          ? error.message
          : "Failed to create payment session",
    });
  }
};

// Helper: create enrollment + progress after successful payment
const enrollAfterPayment = async (studentId: string, courseId: string) => {
  const existing = await Enrollment.findOne({
    student: studentId,
    course: courseId,
  });
  if (existing) return existing;

  const enrollment = await Enrollment.create({
    student: studentId,
    course: courseId,
  });

  const lessons = await Lesson.find({ course: courseId });
  const totalLessons = lessons.length;
  let totalMaterials = 0;

  lessons.forEach((lesson) => {
    const mediaItems = Array.isArray((lesson as any).media)
      ? (lesson as any).media
      : [];

    if (mediaItems.length > 0) {
      totalMaterials += mediaItems.length;
    } else if ((lesson as any).mediaUrl) {
      totalMaterials += 1;
    }
  });

  await Progress.create({
    student: studentId,
    course: courseId,
    totalLessons,
    totalMaterials,
  });

  return enrollment;
};

// IPN endpoint called by SSLCommerz after payment
export const sslIpnHandler = async (req: Request, res: Response) => {
  try {
    const data = req.body as any;
    const { status, tran_id, value_a, value_b } = data;

    if (!tran_id || !value_a || !value_b) {
      return res.status(400).json({ message: "Invalid IPN payload" });
    }

    // Basic validation: only treat VALID / VALIDATED as successful
    if (status === "VALID" || status === "VALIDATED") {
      const studentId = String(value_a);
      const courseId = String(value_b);

      if (!mongoose.Types.ObjectId.isValid(studentId) ||
          !mongoose.Types.ObjectId.isValid(courseId)) {
        return res.status(400).json({ message: "Invalid student or course id" });
      }

      await enrollAfterPayment(studentId, courseId);
    }

    // SSLCommerz expects some kind of response body
    return res.json({ received: true });
  } catch (error) {
    console.error("Error handling SSLCommerz IPN:", error);
    return res.status(500).json({ message: "Failed to process IPN" });
  }
};

