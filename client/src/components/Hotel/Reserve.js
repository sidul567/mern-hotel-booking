import React, { useContext, useState } from 'react'
import './Reserve.css';
import useFetch from '../../hooks/useFetch';
import { HOST } from '../../host';
import Loader from '../Layout/Loader/Loader';
import { SearchContext } from '../../context/SearchContext';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { Checkbox } from '@mui/material';
import { Hotel, HotelOutlined } from '@mui/icons-material';

function Reserve({openModal, setOpenModal, hotelId}) {
    const [openModalClass, setOpenModalClass] = useState(openModal);
    const [selectedRooms, setSelectedRooms] = useState([]);
    const [selectedRoomsId, setSelectedRoomsId] = useState([]);
    const navigate = useNavigate();
    const closeModal = ()=>{
        setOpenModalClass(false);
        setTimeout(() => {
            setOpenModal(false);
        }, 300);   
    }

    const {data, loading, error} = useFetch(HOST+`/api/v1/hotel/rooms/${hotelId}`);
    if(error){
      toast.error(error.message);
    }
    const {rooms} = data;

    const {date} = useContext(SearchContext);
    
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

    const allDates = dateRange(date[0]?.startDate || new Date(), date[0]?.endDate || new Date());
    
    const isAvailable = (roomNumber)=>{
        const isFound = roomNumber.unavailableDates.some((date)=>allDates.includes(new Date(date).getTime()));

        return !isFound;
    }

    const handleCheck = (e, roomNumber, room)=>{
      const checked = e.target.checked;
      const value = e.target.value;
      const number = [];
      number.push(roomNumber);

      const isRoomExist = selectedRooms.some((selectedRoom)=>selectedRoom.roomName === room.title);

      if(isRoomExist){
        if(checked){
          setSelectedRooms(selectedRooms.map((selectedRoom)=>{
            if(selectedRoom.roomName === room.title){
              selectedRoom.number.push(roomNumber);
            }
            return selectedRoom;
          }))
        }else{
          setSelectedRooms(selectedRooms.map((selectedRoom)=>{
            if(selectedRoom.roomName === room.title){
              const index = selectedRoom.number.indexOf(roomNumber);
              selectedRoom.number.splice(index, 1);
            }
            return selectedRoom;
          }));
        }
      }else{
        setSelectedRooms(checked ? [...selectedRooms, {roomName: room.title, number, price: room.price}] : selectedRooms.map((selectedRoom)=>{
          if(selectedRoom.roomName === room.title){
            const index = selectedRoom.number.indexOf(roomNumber);
            selectedRoom.number.splice(index, 1);
          }
          return selectedRoom;
        }));
      }

      setSelectedRoomsId(checked ? [...selectedRoomsId, value] : selectedRoomsId.filter((selectedRoomId)=>selectedRoomId!==value));
    }

    const handleReserve = ()=>{
        if(selectedRooms.length !== 0){
          navigate("/confirmReservation", {state: {
            hotelId,
            selectedRooms,
            selectedRoomsId,
            dates: allDates,
          }})
          closeModal();
        }   
    }
    
  return (
    <div className={`modal ${openModalClass ? "open" : "close"}`}>
        <div className="modal-content">
        <span className="close" onClick={closeModal}>&times;</span>
        <h2>Select Your Room</h2>
        <div className="rooms">
          {
            loading ? <Loader /> : rooms && rooms.map((room)=>(
              <div className="room" key={room._id}>
            <div className="roomInfo">
              <h4>{room.title}</h4>
              <p className="desc">{room.desc}</p>
              <p>Max People: <strong>{room.maxPeople}</strong></p>
              <p className="price green">${room.price}</p>
            </div>
            <div className="roomNumber">
              {
                room.roomNumbers.map((roomNumber)=>(
                  <div className="roomNumberInfo" key={roomNumber._id}>
                    <label htmlFor={`${roomNumber._id}`}>{roomNumber.number}</label>
                    <Checkbox 
                      type="checkbox" 
                      name={`${roomNumber._id}`} 
                      value={`${roomNumber._id}`} 
                      onChange={(e)=>handleCheck(e, roomNumber.number, room)} 
                      id={`${roomNumber._id}`} disabled={!isAvailable(roomNumber)} 
                      icon={<HotelOutlined />}
                      checkedIcon={<Hotel />} 
                    />
                  </div>
                ))
              }
            </div>
          </div>
            ))
          }

          <button onClick={handleReserve}>Reserve Now!</button>
        </div>
        </div>
    </div>
  )
}

export default Reserve