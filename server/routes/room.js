import express from "express";
import { verifyAdmin, verifyToken, verifyUser } from "../middlewares/verifyToken.js";
import { createRoom, deleteRoom, getAllHotelRooms, getAllRoom, getRoom, updateRoom, updateRoomAvailability } from "../controllers/roomController.js";

const router = express.Router();

// router.get("/ss", verifyToken, (req, res)=>{
//     res.json({
//         success: true,
//     })
// })

// Create
router.post("/room/new", verifyAdmin, createRoom);

// Update
router.put("/room/:id", verifyAdmin, updateRoom)

// Update Room Availability
router.put("/room/availability/:roomNumberId", verifyUser, updateRoomAvailability);

// Delete
router.delete("/room/:id", verifyAdmin, deleteRoom)

// Get Single Hotel
router.get("/room/:id", getRoom)

// Get All Hotel
router.get("/rooms", getAllRoom)

// Get all hotel rooms
router.get("/admin/hotel/rooms", verifyUser, getAllHotelRooms);

export default router;