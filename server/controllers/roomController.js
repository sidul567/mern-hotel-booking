import Hotel from "../models/HotelSchema.js";
import Room from "../models/RoomSchema.js";
import { createError } from "../utilities/error.js";

export const createRoom = async(req, res, next)=>{
    try{
        const {hotelId, roomNumbers, ...roomDetails} = req.body.roomInfo;
        roomDetails.roomNumbers = roomNumbers.split(",").map((room)=>{number: room.trim()});
        roomDetails.hotelId = hotelId;
        const newRoom = await new Room(roomDetails).save();

        await Hotel.findByIdAndUpdate(hotelId, {'$push': {rooms: newRoom._id}});

        res.status(200).json({
            success: true,
            newRoom,
        })
    }catch(err){  
        next(err);
    }
}

export const updateRoom = async(req, res, next)=>{
    try{
        const {roomInfo} = req.body;
        const prevRoom = await Room.findById(req.params.id, "hotelId");
        if(roomInfo.hotelId !== prevRoom.hotelId){
            await Hotel.findByIdAndUpdate(prevRoom.hotelId, {'$pull': {rooms: req.params.id}});
            await Hotel.findByIdAndUpdate(roomInfo.hotelId, {'$push': {rooms: req.params.id}});
        }
        const room = await Room.findByIdAndUpdate(req.params.id, roomInfo, {'new': true});
        res.status(200).json({
            success: true,
            room,
        })
    }catch(err){
        next(err);
    }
}

export const updateRoomAvailability = async(req, res, next)=>{
    try{
        const room = await Room.updateOne({"roomNumbers._id": req.params.roomNumberId}, {
            $push: {
                "roomNumbers.$.unavailableDates": req.body.dates,
            }
        }, {
            'new': true,
        })
        res.status(200).json({
            success: true,
            room,
        })
    }catch(err){
        next(err);
    }
}

export const deleteRoom = async(req, res, next)=>{
    try{
        const room = await Room.findById(req.params.id);
        if(!room){
            return next(createError(404, "Room not found!"));
        }
        await Room.findByIdAndDelete(req.params.id);
        await Hotel.findByIdAndUpdate(room.hotelId, {'$pull': {rooms: req.params.id}});
        res.status(200).json({
            success: true,
            message: "Room deleted successfully!",
        })
    }catch(err){
        next(err);
    }
}

export const getRoom = async(req, res, next)=>{
    try{
        const room = await Room.findById(req.params.id);
        res.status(200).json({
            success: true,
            room,
        })
    }catch(err){
        next(err);
    }
}

export const getAllRoom = async(req, res, next)=>{
    try{
        const rooms = await Room.find();
        res.status(200).json({
            success: true,
            rooms,
        })
    }catch(err){
        next(err);
    }
}

export const getAllHotelRooms = async(req, res, next)=>{
    try{
        const hotels = await Hotel.find({
            rooms: { $ne: [], $exists: true }
          }, {'name': 1}).populate({
            path: "rooms",
            select: "_id title price maxPeople",
            options: { sort: { price: 'asc' } }
          });
        
        res.status(200).json({
            success: true,
            hotels,
        })
    }catch(err){
        next(err);
    }
}