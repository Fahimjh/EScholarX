import mongoose from "mongoose";

const PaymentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    amount: Number,
    status: {
      type: String,
      enum: ["success", "failed"],
    },
    gateway: String,
  },
  { timestamps: true }
);

export default mongoose.model("Payment", PaymentSchema);
