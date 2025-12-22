
import express from "express";
import cors from "cors";
import authRoutes from "./routes/authRoutes";
import courseRoutes from "./routes/courseRoutes";
import enrollmentRoutes from "./routes/enrollmentRoutes";
import progressRoutes from "./routes/progressRoutes";
import lessonRoutes from "./routes/lessonRoutes";
import categoryRoutes from "./routes/categoryRoutes";
import paymentRoutes from "./routes/paymentRoutes";

const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/enrollments", enrollmentRoutes);
app.use("/api/progress", progressRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/lessons", lessonRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/payments", paymentRoutes);

export default app;