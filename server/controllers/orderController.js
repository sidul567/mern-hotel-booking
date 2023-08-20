import Order from "../models/OrderSchema.js";
import {createError} from "../utilities/error.js";

// Create Order
export const createOrder = async(req, res, next)=>{
    try{
        const order = await new Order(req.body).save();

        res.status(200).json({
            success: true,
            order,
        })
    }catch(err){
        next(err);
    }
}

// Get Order
export const getOrders = async(req, res, next)=>{
    try{
        const orders = await Order.find({user: req.user.id}).populate("hotelInfo.hotelId", "name");
        res.json({
            success: true,
            orders,
        })
    }catch(err){
        next(err);
    }
}

// Get Order
export const getAllOrders = async(req, res, next)=>{
    try{
        const orders = await Order.find().populate("hotelInfo.hotelId", "name").populate("user", "username");
        res.json({
            success: true,
            orders,
        })
    }catch(err){
        next(err);
    }
}

// Delete Order
export const deleteOrder = async(req, res, next)=>{
    try{
        await Order.findByIdAndDelete(req.params.id);
        res.json({
            success: true,
            message: "Order deleted successfully!",
        })
    }catch(err){
        next(err);
    }
}

// verify order
export const verifyOrder = async(req, res, next)=>{
    try{
        const order = await Order.findById(req.params.id);
        if(!order){
            next(createError(404, "Ticket not found!"));
        }

        const currentDate = new Date(new Date().setHours(0, 0, 0, 0)).getTime();
        const startDate = new Date(order.dates.startDate).getTime();
        const endDate = new Date(order.dates.endDate).getTime();

        console.log("currentDate: "+currentDate);
        console.log("startDate: "+startDate);
        console.log("endDate: "+endDate);

        if(startDate <= currentDate && currentDate <= endDate){
            order.status = "Success";
            await order.save();
            res.status(200).json({
                success: true,
            })
        }else{
            next(createError(403, "Ticket isn't valid for today!"));
        }
    }catch(err){
        next(err)
    }
}