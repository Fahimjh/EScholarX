import express from "express";
import { protect } from "../middlerwares/authMiddleware";
import {
  createPaymentSession,
  sslIpnHandler,
} from "../controllers/paymentController";

const router = express.Router();

// Student initiates payment for a course
router.post("/create-session", protect, createPaymentSession);

// SSLCommerz IPN callback (no auth)
router.post("/ipn", sslIpnHandler);

export default router;
