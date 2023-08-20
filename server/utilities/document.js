import QRCode from "qrcode"
import Order from "../models/OrderSchema.js";
import {format} from "date-fns";

export const document = async (id)=>{
    const order = await Order.findById(id).populate("hotelInfo.hotelId", "name").populate("user", "username email");

    const qr = await QRCode.toDataURL(id);
    console.log(new Date(order.dates.startDate).getTime());
    console.log(new Date(order.dates.startDate) - new Date().getTimezoneOffset());
    console.log("Timezoneoffset: "+ new Date().getTimezoneOffset());
    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Document</title>
    </head>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Quicksand:wght@300;400;500;600;700&display=swap');
        html {
            -webkit-print-color-adjust: exact;
        }
        *{
            margin: 0;
            padding: 0;
            font-family: 'Quicksand', sans-serif;
            box-sizing: border-box;
        }
        body{
            margin: 20px;
            padding: 20px;
        }
        header{
            text-align: center;
            border-bottom: 1px solid #220092;
            width: 450px;
            padding-bottom: 5px;
            margin: 0 auto;
            margin-bottom: 50px;
            display: flex;
            justify-content: center;
            align-items: center;
        }
        header img{
            width: 80px;
            border-radius: 50%;
        }
        p{
            font-weight: 500;
        }
        .visitor-info{
            display: flex;
            justify-content: space-between;        
            margin-top: 10px;
        }
        .qrcode{
            margin-top: -10px;
        }
        .user-info{
            font-size: 18px;
            padding-left: 10px;
        }
        .hotel-info h3, .room-title, .visitor, .ticket-title{
            font-size: 25px;
            margin-bottom: 10px;
            background-color: #f0f8ff;
            padding: 5px 10px;
            color: #220092;
        }
        .hotel-info p{
            margin-bottom: 20px;
            padding-left: 10px;
        }
        .room-info{
            display: flex;
            flex-direction: column;
        }
        .room-header, .total-price, .ticket-header{
            display: flex;
            justify-content: space-between;
            padding: 5px 10px;
            font-size: 20px;
            border: 1px solid rgba(0, 0, 0, 0.2);
        }
        .total-price{
            border-top: none;
            border-bottom: none;
            border-right: none;
            width: 34%;
            align-self: flex-end;
            flex: 1;
        }
        .rooms{
            display: flex;
            flex-direction: column;
            border: 1px solid rgba(0, 0, 0, 0.2);
            border-top: none;
            margin-bottom: 20px;
        }
        .room, .ticket-info{
            display: flex;
            justify-content: space-between;
            padding: 10px;
            border-bottom: 1px solid rgba(0, 0, 0, 0.2);
        }
        .ticket-info{
            border-left: 1px solid rgba(0, 0, 0, 0.2);
            border-right: 1px solid rgba(0, 0, 0, 0.2);
        }
        .room:last-of-type{
            border-bottom: none;
        }
        .room p, .ticket-info p{
            flex: 1;
        }
        .room-header h5, .ticket-header h5{
            flex: 1;
        }
    </style>
    <body>
        <header>
            <img src="https://play-lh.googleusercontent.com/-LLFboO3-LMZDXn9_2DyCtssJPXqxlbBciKoJ25o5S5wulGJo1QXme4HlFbevrYxUg" alt="">
            <h1>Mern Hotel Booking</h1>
        </header>
        <h3 class="visitor">User Details</h3>
        <div class="visitor-info">
            <div class="user-info">
                <p>Username: ${order.user.username}</p>
                <p>Email: ${order.user.email}</p>
            </div>
            <div class="qrcode">
                <img src="${qr}" alt="">
            </div>
        </div>
        <div class="hotel-info">
            <h3>Hotel</h3>
            <p>${order.hotelInfo.hotelId.name}</p>
        </div>
        <h3 class="room-title">Room</h3>
        <div class="room-info">
            <div class="room-header">
                <h5>Room Name</h5>
                <h5>Room Number</h5>
                <h5>Room Price</h5>
            </div>
            <div class="rooms">
                ${order.hotelInfo.roomInfo.map((room)=>{
                    return `<div class="room">
                        <p>${room.roomName}</p>
                        <p>[${room.roomNumber.join(", ")}]</p>
                        <p>$${room.roomPrice}</p>
                    </div>`
                }).join("")}
                <div class="total-price">
                    <h5>Total: $${order.totalPrice}</h5>
                </div>
            </div>
        </div>
        <h3 class="ticket-title">Ticket Info</h3>
        <div>
            <div class="ticket-header">
                <h5>Ticket ID</h5>
                <h5>Dates</h5>
            </div>
            <div class="ticket-info">
                <p>#${order._id}</p>
                <p>${format(new Date(order.dates.startDate).getTime() - new Date().getTimezoneOffset(), "dd MMM, yyyy")} to ${format(new Date(order.dates.endDate).getTime() - new Date().getTimezoneOffset(), "dd MMM, yyyy")}</p>
            </div>
        </div>
    </body>
    </html>
    `
}