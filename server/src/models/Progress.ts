import mongoose from "mongoose";

const ProgressSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
    },
    completedLessons: {
      type: Number,
      default: 0,
    },
    totalLessons: {
      type: Number,
      default: 0,
    },
    completedMaterials: {
      type: Number,
      default: 0,
    },
    totalMaterials: {
      type: Number,
      default: 0,
    },
    // Track which specific materials and lessons the student has completed
    completedMaterialEntries: [
      {
        lesson: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Lesson",
        },
        mediaId: {
          type: String,
          required: true,
        },
      },
    ],
    completedLessonIds: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Lesson",
      },
    ],
    completed: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Progress", ProgressSchema);
