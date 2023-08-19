import express from "express";
import { deleteUser, getAllUser, getUser, loadUser, updateUser } from "../controllers/userController.js";
import { verifyUser, verifyAdmin } from "../middlewares/verifyToken.js";
import { hotelImageUpload } from "../middlewares/hotelImagesUpload.js";

const router = express.Router();

// Update
router.put("/user/:id", verifyUser, hotelImageUpload, updateUser);

// Delete 
router.delete("/user/:id", verifyUser, deleteUser);

// load user
router.get("/loadUser", verifyUser, loadUser);

// Get single user
router.get("/user/:id", verifyUser, getUser);

// Get all user
router.get("/users", verifyAdmin, getAllUser);

export default router;