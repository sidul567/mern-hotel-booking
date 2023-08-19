import express from "express";
import { checkout, getRazorKey, paymentVerification } from "../controllers/paymentController.js";
import { verifyUser } from "../middlewares/verifyToken.js";

const router = express.Router();

// Get Razor key
router.get("/getRazorKey", getRazorKey);

// Create order
router.post("/payment/checkout", verifyUser, checkout);

// Payment verification
router.post("/payment/verification", paymentVerification);

export default router;