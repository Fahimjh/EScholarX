import nodemailer from "nodemailer";

export const sendEmail = async (
  to: string,
  subject: string,
  text: string
): Promise<boolean> => {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.log("[DEV EMAIL MOCK]", { to, subject, text });
    return true;
  }

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const info = await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to,
    subject,
    text,
  });

  return Array.isArray((info as any).accepted) && (info as any).accepted.length > 0;
};

