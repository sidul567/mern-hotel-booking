import Order from "../models/OrderSchema.js";

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