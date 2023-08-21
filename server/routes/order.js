import express from "express";
import {verifyAdmin, verifyUser} from '../middlewares/verifyToken.js';
import { createOrder, deleteOrder, getAllOrders, getOrder, getOrders, updateOrder, verifyOrder } from "../controllers/orderController.js";

const router = express.Router();

// Create order
router.post("/order/new", verifyUser, createOrder);

// Get orders
router.get("/orders", verifyUser, getOrders);

// Get admin orders
router.get("/admin/orders", verifyAdmin, getAllOrders);

// Get admin single orders
router.get("/order/:id", verifyAdmin, getOrder);

// Updaet order
router.put("/order/:id", verifyAdmin, updateOrder);

// Delete order
router.delete("/order/:id", verifyAdmin, deleteOrder);

// Verify order
router.get("/order/verify/:id", verifyAdmin, verifyOrder);

export default router;