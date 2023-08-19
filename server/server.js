import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import cors from "cors";
import {v2 as cloudinary} from 'cloudinary';

const app = express();
dotenv.config({path: ".env"});

// MongoDB Connection
const connect = async ()=>{
    try{
        await mongoose.connect(process.env.MONGO_STRING);
        console.log("Database connect successfully!");
    }catch(err){
        throw err;
    }
}

mongoose.connection.on("disconnected", ()=>{
    console.log("MongoDB disconnected!");
})

// Cloudinary Connection
cloudinary.config({
    'cloud_name': process.env.CLOUDINARY_CLOUD_NAME,
    'api_key':  process.env.CLOUDINARY_API_KEY,
    'api_secret': process.env.CLOUDINARY_API_SECRET,
    'secure': true,
})

// Internal import
import hotelRoute from "./routes/hotel.js";
import authRoute from "./routes/auth.js";
import roomRoute from "./routes/room.js";
import userRoute from "./routes/user.js";
import paymentRoute from "./routes/payment.js";
import orderRoute from "./routes/order.js";
import ticketRoute from "./routes/ticket.js";

// middleware
app.use(cors({
    'credentials': true,
    'origin': [
        "http://localhost:3000",
        "https://mern-hotel-booking-567.netlify.app"
    ],
    'methods': ['GET', 'POST', 'PUT', 'DELETE'],
    'allowedHeaders': [
        'Access-Control-Allow-Origin',
        'Content-Type',
        'Authorization' 
    ]
}))
app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.urlencoded({'extended': true}));

// Route
app.use("/api/v1", hotelRoute); 
app.use("/api/v1", authRoute); 
app.use("/api/v1", roomRoute); 
app.use("/api/v1", userRoute); 
app.use("/api/v1", paymentRoute); 
app.use("/api/v1", orderRoute);
app.use("/api/v1", ticketRoute);

// error middleware
app.use((err, req, res, next)=>{
    let message  = err.message || "Something went wrong!";
    const statusCode = err.statusCode || 404;

    if(err.code === 11000){
        message = `${Object.keys(err.keyValue)} already exist!`;
    }

    res.status(statusCode).json({
        success: false,
        message,
        stack: err.stack,
    })
})

app.listen(process.env.PORT, ()=>{
    console.log(`Server is connected at port ${process.env.PORT}`);
    connect();
})