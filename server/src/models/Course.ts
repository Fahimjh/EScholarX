import mongoose from "mongoose";

const CourseSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: String,
    price: { type: Number, required: true },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
    },
    isPublished: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.model("Course", CourseSchema);
