import express from "express";
import {verifyAdmin, verifyUser} from '../middlewares/verifyToken.js';
import { createOrder, deleteOrder, getAllOrders, getOrders } from "../controllers/orderController.js";

const router = express.Router();

// Create order
router.post("/order/new", verifyUser, createOrder);

// Get orders
router.get("/orders", verifyUser, getOrders);

// Get admin orders
router.get("/admin/orders", verifyAdmin, getAllOrders);

// Delete order
router.delete("/order/:id", verifyAdmin, deleteOrder);

export default router;