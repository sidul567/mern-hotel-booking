import React, { useEffect, useState } from 'react'
import Sidebar from './Sidebar'
import './NewHotel.css';
import { toast } from 'react-toastify';
import axios from 'axios';
import { HOST } from '../../host';
import { useNavigate, useParams } from 'react-router-dom';
import Loader from '../Layout/Loader/Loader';
import useFetch from '../../hooks/useFetch';
import { DateRange } from 'react-date-range';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck } from '@fortawesome/free-solid-svg-icons';

function UpdateRoom() {
    const {id} = useParams();
    const {data, loading, error} = useFetch(HOST+`/api/v1/room/${id}`);
    const {room} = data;
    const [selectedRoomNumber, setSelectedRoomNumber] = useState("");
    const [addRoomText, setAddRoomText] = useState("");
    useEffect(()=>{
        if(room){
            const {__v, _id, createdAt, updatedAt , ...filteredRoom} = room;
            setRoomInfo({...filteredRoom});
            setAddRoomText(filteredRoom.roomNumbers.map((room)=>room.number).join(", "))
        }
    },[room])
    const {data: {hotels}} = useFetch(HOST+"/api/v1/hotels");
    const navigate = useNavigate();
    const [roomInfo, setRoomInfo] = useState({
        title: "",
        desc: "",
        maxPeople: "",
        price: "",
        roomNumbers: [],
        hotelId: "",
    })
    const [date, setDate] = useState([
        {
            startDate: new Date(), 
            endDate: new Date(),
            key: "selection",
        }
    ])

    const [isLoading, setIsLoading] = useState(false);

    const handleInputChange = (e)=>{
        setRoomInfo((prevInfo)=>{
            return {
                ...prevInfo,
                [e.target.name]: e.target.value,
            }
        })
    }
    
    const dateRange = (startDate, endDate)=>{
        const end = new Date(endDate);
        const date = new Date(startDate);

        const dates = [];

        while(date <= end){
            dates.push(new Date(date).getTime());
            date.setDate(date.getDate() + 1);
        }
        
        return dates;
    }

    const handleSelectChange = (e)=>{
        if(e.target.name === "roomNumbers"){
            setSelectedRoomNumber(e.target.value);
            const roomNumber = roomInfo.roomNumbers.find((room)=>room.number.toString()===e.target.value);
            if(roomNumber && roomNumber.unavailableDates.length!==0){
                setDate([{
                    key: "selection",
                    startDate: new Date(roomNumber.unavailableDates[0]),
                    endDate: new Date(roomNumber.unavailableDates[roomNumber?.unavailableDates.length - 1]),
                }])
            }else{
                setDate([{
                    startDate: new Date(), 
                    endDate: new Date(),
                    key: "selection",
                }])
            }
        }else{
            setRoomInfo((prevInfo)=>{
                return {
                    ...prevInfo,
                    [e.target.name]: e.target.value,
                }
            })
        }
    }

    const handleRoomNumber = ()=>{
        const roomNumber = addRoomText.split(",").map((number)=>Number(number.trim()));
        const newRoomNumbers = roomNumber.map((number)=>{
            const isExistRoom = roomInfo.roomNumbers.findIndex((room)=>room.number===number);
            if(isExistRoom === -1){
                return {
                    number,
                    unavailableDates: [],
                }
            }
            return roomInfo.roomNumbers[isExistRoom];
        })
        setRoomInfo({...roomInfo, roomNumbers: newRoomNumbers});
    }

    const updateRoom = async (e)=>{
        e.preventDefault();
        setIsLoading(true);

        try{
            const {data} = await axios.put(HOST+`/api/v1/room/${id}`, {roomInfo}, {
                'withCredentials': true,
                'headers': {
                    'Content-Type': 'application/json',
                }
            })
            if(data.success){
                toast.success("Room updated successfully!");
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
        <Sidebar/>
        <div className="newHotelContainer containerList">
            {
                (isLoading || loading) && <Loader />
            }
            <h2 className="title">Update Room</h2>
            <form className="hotelForm" onSubmit={updateRoom}>
                <div className="side1">
                    <div className="form-group">
                        <label htmlFor="title">Room Title</label>
                        <input type="text" name='title' placeholder='Room Name' onChange={handleInputChange} value={roomInfo.title}  required/>
                    </div>
                    <div className="form-group">
                        <label htmlFor="price">Room Price</label>
                        <input type="text" name='price' placeholder='Room Price' onChange={handleInputChange} value={roomInfo.price}  required/>
                    </div>
                    <div className="form-group">
                        <label htmlFor="number">Room Numbers</label>
                        <div className='wrapper'>
                            <input type="text" name='number' placeholder='Room Number' onChange={(e)=>setAddRoomText(e.target.value)} value={addRoomText}  required/>
                            <div className="icon" onClick={handleRoomNumber}><FontAwesomeIcon icon={faCheck} /></div>
                        </div>
                        <select defaultValue="" name="roomNumbers" onChange={handleSelectChange}>
                            <option value="">Choose Room Number</option>
                            {
                                roomInfo && roomInfo.roomNumbers.map((room, index)=>(
                                    <option value={room.number} key={index}>{room.number}</option>
                                ))
                            }
                        </select>
                    </div>
                    {selectedRoomNumber && <div className="form-group">
                        <label htmlFor="unavailableDates">Unavailable Dates</label>
                        <DateRange
                            className='dateRange'
                            editableDateInputs={true}
                            minDate={new Date()}
                            ranges={date}
                            onChange={(item) => {
                                setDate([item.selection])
                                const roomNumberIndex = roomInfo.roomNumbers.findIndex((room)=>room.number.toString()===selectedRoomNumber);
                                roomInfo.roomNumbers[roomNumberIndex].unavailableDates = dateRange(item.selection.startDate, item.selection.endDate);
                            }}
                            moveRangeOnFirstSelection={false}
                        />
                    </div>}
                    <div className="form-submit align-flex-start">
                        <input type="submit" value="Update Room" />
                    </div>
                </div>
                <div className="side2">
                    <div className="form-group">
                        <label htmlFor="maxPeople">Max People</label>
                        <input type="text" name='maxPeople' placeholder='Max People' onChange={handleInputChange} value={roomInfo.maxPeople}  required/>
                    </div>
                    <div className="form-group">
                        <label htmlFor="desc">Room Description</label>
                        <input type="text" name='desc' placeholder='Room Description' onChange={handleInputChange} value={roomInfo.desc}  required/>
                    </div>
                    <div className="form-group">
                        <label htmlFor="hotelId">Hotels</label>
                        <select value={roomInfo.hotelId} name="hotelId" onChange={handleSelectChange} required>
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

export default UpdateRoom