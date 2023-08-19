import React, { useContext, useState } from 'react'
import './ConfirmHotelReservation.css';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import useFetch from '../../hooks/useFetch';
import { HOST } from '../../host';
import Loader from '../Layout/Loader/Loader';
import axios from 'axios';
import { toast } from 'react-toastify';
import { AuthContext } from '../../context/AuthContext';
import { SearchContext } from '../../context/SearchContext';


function ConfirmHotelReservation() {
    const location = useLocation();
    const {state} = location;
    const {selectedRooms, selectedRoomsId, hotelId, dates} = state;
    const {date} = useContext(SearchContext);
    const {data: hotelData, loading: hotelLoading, error} = useFetch(HOST+`/api/v1/hotel/${hotelId}`);
    const {hotel} = hotelData;
    let totalPrice = 0;
    selectedRooms.forEach((room)=>totalPrice += (room.price * room.number.length));
    const {user} = useContext(AuthContext);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    if(!user){
        return <Navigate to="/login?redirect=confirmReservation" state={{selectedRooms, selectedRoomsId, hotelId, dates}} />
    }

    const order ={
        "hotelInfo": {
            "hotelId": hotelId,
            "roomInfo": selectedRooms.map((room)=>{
                return {roomName: room.roomName, roomNumber: room.number, roomPrice: room.price}
            }),
        },
        "user": user._id,
        "totalPrice": totalPrice,
        "dates": {
            startDate: date[0].startDate,
            endDate: date[0].endDate,
        }
    }

    const handlePayment = async ()=>{
        try{
            setLoading(true);
            const { data: {key} } = await axios.get(HOST + "/api/v1/getRazorKey", {
                'withCredentials': true,
            });
            const {data} = await axios.post(HOST+"/api/v1/payment/checkout", {total: totalPrice}, {
                'withCredentials': true,
                'headers': {
                    'Content-Type': 'application/json',
                }
            })
            var options = {
                "key": key, 
                "amount": data.order.amount,
                "currency": "INR",
                "name": "Mern Hotel Booking",
                "description": "Test Transaction",
                "image": "https://play-lh.googleusercontent.com/-LLFboO3-LMZDXn9_2DyCtssJPXqxlbBciKoJ25o5S5wulGJo1QXme4HlFbevrYxUg",
                "order_id": data.order.id,
                "handler": async function (response){
                    const razor_payment_id = response.razorpay_payment_id;
                    const razorpay_order_id = response.razorpay_order_id;
                    const razorpay_signature = response.razorpay_signature;
    
                    try{
                        const {data} = await axios.post(HOST + "/api/v1/payment/verification", {razor_payment_id, razorpay_order_id, razorpay_signature}, {
                            'headers': {
                                'Content-Type': 'application/json',
                            },
                            'withCredentials': true,
                        });
                        setLoading(true);
                        if(data.success){
                            order.paymentInfo = {
                                id: razor_payment_id,
                                status: "Paid",
                            }
                            await axios.post(HOST+"/api/v1/order/new", order, {
                                'withCredentials': true,
                                'headers': {
                                    'Content-Type': 'application/json',
                                }
                            })
                            await Promise.all(selectedRoomsId.map(async (id)=>{
                                return await axios.put(HOST+`/api/v1/room/availability/${id}`, {dates}, {
                                    'withCredentials': true,
                                    'headers': {
                                        'Content-Type': 'application/json',
                                    }
                                })
                            }))
                            toast.success("Hotel Reserved successfully!");
                            navigate("/");
                        }else{
                            toast.error("There are some problems while processing payment.");
                        }
                        setLoading(false);
                    }catch(err){
                        console.log(err);
                        toast.error(err.message);
                        setLoading(false);
                    }
                },
                "prefill": {
                    "name": user.username,
                    "email": user.email,
                    "contact": "9000090000"
                },
                "theme": {
                    "color": "#220092"
                }
            };
            var rzp1 = new window.Razorpay(options);
            rzp1.open();
            setLoading(false);
        }catch(err){
            toast.error(err.message);
        }
    }

  return (
    <>
        {loading && <Loader />}
        <h2 className='title'>Confirm Order</h2>
        <div className='confirmHotelReservation'>
        <div className="hotel-info">
            <div className="hotel">
                <h3>Hotel</h3>
                {hotelLoading ? <Loader /> : <p>{hotel && hotel.name}</p>}
            </div>
            <div className="room">
                <h3>Room</h3>
                {
                    selectedRooms.map((room, index)=>(
                        <div className="room-info" key={index}>
                            <h4>{room.roomName}</h4>
                            <p>Room number: <span>[ {room.number.join(", ")} ]</span></p>
                            <p>Room Price(Per): <span>${room.price}</span></p>
                            <p>Total Room Price: <span>${room.price} * {room.number.length} = {room.price * room.number.length}</span></p>
                        </div>
                    ))
                }
            </div>
        </div>
        <div className="payment">
            <h3>Payment</h3>
            <p>Total Price: ${totalPrice}</p>
            <button onClick={handlePayment}>Proceed To Payment</button>
        </div>
    </div>
    </>
  )
}

export default ConfirmHotelReservation