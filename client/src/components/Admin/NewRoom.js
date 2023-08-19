import React, { useState } from 'react'
import Sidebar from './Sidebar'
import './NewHotel.css';
import { toast } from 'react-toastify';
import axios from 'axios';
import { HOST } from '../../host';
import { useNavigate } from 'react-router-dom';
import Loader from '../Layout/Loader/Loader';
import useFetch from '../../hooks/useFetch';

function NewRoom() {
    const navigate = useNavigate();
    const [roomInfo, setRoomInfo] = useState({
        title: "",
        desc: "",
        maxPeople: "",
        price: "",
        roomNumbers: "",
        hotelId: "",
    })
    const {data, loading} = useFetch(HOST+"/api/v1/hotels");
    const {hotels} = data;
    const [isLoading, setIsLoading] = useState(false);

    const handleInputChange = (e)=>{
        setRoomInfo((prevInfo)=>{
            return {
                ...prevInfo,
                [e.target.name]: e.target.value,
            }
        })
    }

    const handleSelectChange = (e)=>{
        setRoomInfo((prevInfo)=>{
            return {
                ...prevInfo,
                [e.target.name]: e.target.value,
            }
        })
    }

    const createRoom = async (e)=>{
        e.preventDefault();
        setIsLoading(true)
        try{
            const {data} = await axios.post(HOST+"/api/v1/room/new", {roomInfo}, {
                'withCredentials': true,
                'headers': {
                    'Content-Type': 'application/json',
                }
            })
            if(data.success){
                toast.success("Room created successfully!");
                navigate("/admin/rooms");
            }
            setIsLoading(false);
        }catch(err){
            toast.error(err.response.data.message);
            setIsLoading(false);
        }
    }
    
  return (
    <div className='newHotel container'>
        <Sidebar open="rooms" active="newRoom" />
        <div className="newHotelContainer containerList">
            {
                (isLoading || loading) && <Loader />
            }
            <h2 className="title">New Room</h2>
            <form className="hotelForm" onSubmit={createRoom}>
                <div className="side1">
                    <div className="form-group">
                        <input type="text" name='title' placeholder='Room Name' onChange={handleInputChange} value={roomInfo.title}  required/>
                    </div>
                    <div className="form-group">
                        <input type="text" name='price' placeholder='Room Price' onChange={handleInputChange} value={roomInfo.price}  required/>
                    </div>
                    <div className="form-group">
                        <input type="text" name='desc' placeholder='Room Description' onChange={handleInputChange} value={roomInfo.desc}  required/>
                    </div>
                    <div className="form-submit align-flex-start">
                        <input type="submit" value="Create Room" />
                    </div>
                </div>
                <div className="side2">
                    <div className="form-group">
                        <input type="text" name='maxPeople' placeholder='Max People' onChange={handleInputChange} value={roomInfo.maxPeople}  required/>
                    </div>
                    <div className="form-group">
                        <input type="text" name='roomNumbers' placeholder='Room Numbers' onChange={handleInputChange} value={roomInfo.roomNumbers}  required/>
                    </div>
                    <div className="form-group">
                        <select defaultValue="" name="hotelId" onChange={handleSelectChange} required>
                            <option value="" disabled>Choose Hotel</option>
                            {
                                hotels && hotels.map((hotel)=>(
                                    <option value={hotel._id} key={hotel._id}>{hotel.name}</option>
                                ))
                            }
                        </select>
                    </div>
                </div>
            </form>
        </div>
    </div>
  )
}

export default NewRoom