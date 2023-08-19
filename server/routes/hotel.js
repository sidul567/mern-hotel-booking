import express from "express";
import { createHotel, deleteHotel, getAllHotel, getHotel, getHotelCountByCity, getHotelCountByType, getHotelRooms, updateHotel } from "../controllers/hotelController.js";
import { verifyAdmin } from "../middlewares/verifyToken.js";
import { hotelImageUpload } from "../middlewares/hotelImagesUpload.js";

const router = express.Router();

// countByCity
router.get("/hotel/countByCity", getHotelCountByCity);

// countByCity
router.get("/hotel/countByType", getHotelCountByType);

// Create Hotel
router.post("/hotel/new",verifyAdmin, hotelImageUpload, createHotel)

// Update
router.put("/hotel/:id", verifyAdmin, hotelImageUpload, updateHotel)

// Delete
router.delete("/hotel/:id", verifyAdmin, deleteHotel)

// Get Single Hotel
router.get("/hotel/:id", getHotel)

// Get All Hotel
router.get("/hotels", getAllHotel)

// Get Hotel Room
router.get("/hotel/rooms/:id", getHotelRooms);

export default router;