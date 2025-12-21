import mongoose from "mongoose";

const LessonSchema = new mongoose.Schema(
  {
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: false,
    },
    mediaUrl: {
      type: String,
    },
    mediaType: {
      type: String,
      enum: ["image", "video", "pdf", "file"],
    },
    media: [
      {
        url: {
          type: String,
          required: true,
        },
        type: {
          type: String,
          enum: ["image", "video", "pdf", "file"],
          required: true,
        },
      },
    ],
    order: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Lesson", LessonSchema);
