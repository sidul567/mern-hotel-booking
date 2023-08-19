import Hotel from "../models/HotelSchema.js";
import Room from "../models/RoomSchema.js";
import {v2 as cloudinary} from 'cloudinary';
import { createError } from "../utilities/error.js";

export const createHotel = async (req, res, next)=>{
    try{
        const {hotelInfo} = req.body;
        let imageLinks = [];

        for(let i=0; i<req.files.length; i++){
            const cloud = await cloudinary.uploader.upload(req.files[i].path, {
                'folder': 'hotels',
            })
            imageLinks.push({
                public_id: cloud.public_id,
                url: cloud.secure_url,
            });
        }

        hotelInfo.photos = imageLinks;

        const hotel = await new Hotel(hotelInfo).save();
        res.status(200).json({
            success: true,
            hotel,
        })
    }catch(err){
        next(err);
    }
}

export const updateHotel = async(req, res, next)=>{
    try{
        let hotel = await Hotel.findById(req.params.id);
        if(!hotel){
            next(createError(404, "Hotel not found!"));
        }
        const {hotelInfo} = req.body;
        if(req.files.length > 0){
            // delete previous image
            for(let i=0; i<hotelInfo.photos.length; i++){
                await cloudinary.uploader.destroy(hotelInfo.photos[i].public_id);
            }

            // Upload new image
            let imageLinks = [];

            for(let i=0; i<req.files.length; i++){
                const cloud = await cloudinary.uploader.upload(req.files[i].path, {
                    'folder': 'hotels',
                })
                imageLinks.push({
                    public_id: cloud.public_id,
                    url: cloud.secure_url,
                });
            }

            hotelInfo.photos = imageLinks;
        }
        
        hotel = await Hotel.findByIdAndUpdate(req.params.id, hotelInfo, {
            'new':  true
        })

        res.status(200).json({
            success: true,
            hotel,
        })
    }catch(err){
        next(err);
    }
}

export const deleteHotel = async(req, res, next)=>{
    try{
        let hotel = await Hotel.findById(req.params.id);
        if(!hotel){
            next(createError(404, "Hotel not found!"));
        }

        for(let i=0; i<hotel.photos.length; i++){
            await cloudinary.uploader.destroy(hotel.photos[i].public_id);
        }

        await Hotel.findByIdAndDelete(req.params.id);
        res.status(200).json({
            success: true,
            message: "Hotel deleted successfully!",
        })
    }catch(err){
        next(err);
    }
}

export const getHotel = async(req, res, next)=>{
    try{
        const hotel = await Hotel.findById(req.params.id);
        res.status(200).json({
            success: true,
            hotel,
        })
    }catch(err){
        next(err);
    }
}

export const getAllHotel = async(req, res, next)=>{
    try{
        const {limit, min, max, city, maxPeople, room, ...rest} = req.query;
        let hotels = await Hotel.find({...rest, cheapestPrice: {$gte: min || 1, $lte: max || 999}, city: {$regex: city || "", $options: 'i'}}).populate("rooms", "maxPeople roomNumbers").limit(req.query.limit).sort({cheapestPrice: 'asc'});
        
        if(maxPeople){
            hotels = hotels.filter((hotel)=>{
                let totalRoom = 0;
                hotel.rooms.forEach((room)=> totalRoom += room.roomNumbers.length);
                if(totalRoom >= room){
                    const isMatch = hotel.rooms.some((room)=>room.maxPeople >= maxPeople)
                    if(isMatch) return hotel;
                }
            });
            
        }

        // console.log(hotels.rooms);

        res.status(200).json({ 
            success: true,
            hotels,
        })
    }catch(err){
        next(err);
    }
}

export const getHotelCountByCity = async(req, res, next)=>{
    try{
        const cities = req.query.cities.split(",");

        const list = await Promise.all(cities.map(async (city)=>{
            return await Hotel.countDocuments({city: city});
        }))

        res.json({
            success: true,
            list
        })
    }catch(err){
        next(err);
    }
}

export const getHotelCountByType = async(req, res, next)=>{
    try{
        const hotelCount = await Hotel.countDocuments({type: "hotel"});
        const apartmentCount = await Hotel.countDocuments({type: "apartment"});
        const resortCount = await Hotel.countDocuments({type: "resort"});
        const villaCount = await Hotel.countDocuments({type: "villa"});
        const cabinCount = await Hotel.countDocuments({type: "cabin"});

        res.json({
            success: true,
            countAll: [
                {type: "hotel", count: hotelCount },
                {type: "apartment", count: apartmentCount },
                {type: "resort", count: resortCount },
                {type: "villa", count: villaCount },
                {type: "cabin", count: cabinCount }
            ]
        })
    }catch(err){
        next(err);
    }
}

export const getHotelRooms = async (req, res, next)=>{
    try{
        const hotel = await Hotel.findById(req.params.id);

        const rooms = await Promise.all(hotel.rooms.map(async (room)=>{
            return await Room.findById(room);
        }))

        res.status(200).json({
            success: true,
            rooms,
        })
    }catch(err){
        next(err);
    }
}