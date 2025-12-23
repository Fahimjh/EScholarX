import express from "express";
import { protect } from "../middlerwares/authMiddleware";
import {
  createPaymentSession,
  sslIpnHandler,
  paymentSuccess,
  paymentFail,
  paymentCancel,
} from "../controllers/paymentController";

const router = express.Router();

// Student initiates payment for a course
router.post("/create-session", protect, createPaymentSession);

// SSLCommerz IPN callback (server-to-server, no auth)
router.post("/ipn", sslIpnHandler);

// Browser redirect callbacks from SSLCommerz
router.post("/success", paymentSuccess);
router.post("/fail", paymentFail);
router.post("/cancel", paymentCancel);

export default router;
