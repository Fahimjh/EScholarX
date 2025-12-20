import type { Request, Response } from "express";
import User from "../models/User";
import { generateToken } from "../utils/generateToken";
import { sendEmail } from "../utils/sendEmail";

export const register = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const verificationToken = Math.floor(100000 + Math.random() * 900000).toString();
    const verificationTokenExpires = new Date(Date.now() + 24 * 60 * 60 * 1000);

    await User.create({
      name,
      email,
      password,
      verificationToken,
      verificationTokenExpires,
      isVerified: false,
    });

    const sent = await sendEmail(
      email,
      "Your verification code",
      `Your verification code is ${verificationToken}. It will expire in 24 hours.`
    );

    if (!sent) {
      return res.status(500).json({ message: "Failed to send verification email" });
    }

    res.status(201).json({
      message: "OTP sent to your email. Please verify to complete registration.",
    });
  } catch (error) {
    res.status(500).json({ message: "Registration failed" });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    if (!user.isVerified) {
      return res.status(403).json({ message: "Please verify your email before logging in" });
    }

    if (!(await user.comparePassword(password))) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    res.json({
      token: generateToken(user._id.toString(), user.role),
      user: {
        id: user._id,
        name: user.name,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Login failed" });
  }
};

export const verifyOtp = async (req: Request, res: Response) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ message: "Email and OTP are required" });
    }

    const user = await User.findOne({
      email,
      verificationToken: otp,
      verificationTokenExpires: { $gt: new Date() },
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    user.isVerified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpires = undefined;
    await user.save();

    res.json({ message: "Email verified successfully. You can now log in." });
  } catch (error) {
    res.status(500).json({ message: "Verification failed" });
  }
};

