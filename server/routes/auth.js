import express from "express";
import { login, logout, register } from "../controllers/authController.js";
import { hotelImageUpload } from "../middlewares/hotelImagesUpload.js";

const router = express.Router();

// Register
router.post("/register", hotelImageUpload, register);

// Login
router.post("/login", login);

// Log out
router.get("/logout", logout);

export default router;