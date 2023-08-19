import React, { useState } from 'react'
import Sidebar from './Sidebar'
import useFetch from '../../hooks/useFetch';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import { HOST } from '../../host';
import { Link } from 'react-router-dom';
import { DataGrid } from '@mui/x-data-grid';
import Loader from '../Layout/Loader/Loader';
import { toast } from 'react-toastify';
import axios from 'axios';

function RoomList() {
  const {data, loading, error, reFetchData} = useFetch(HOST+"/api/v1/admin/hotel/rooms");
  const {hotels} = data;
  const [isLoading, setIsLoading]  = useState(false);
  if(error){
    toast.error(error);
  }


  const deleteRoom = async (roomId)=>{
    console.log(roomId);
    try{
      setIsLoading(true);
      const {data} = await axios.delete(HOST+`/api/v1/room/${roomId}`, {
        'withCredentials': true,
      }) 
      if(data.success){
        setIsLoading(false);
        toast.success("Room Deleted successfully!");
        reFetchData();
      }
    }catch(err){
      toast.error(err.response.data.message);
      setIsLoading(false);
    }
  }

  const columns = [
    {field: "roomId", headerName: "ID", width: 220, renderCell:(params)=>{
        return (
          <div className="roomStatus">
              {
                params.row.roomId.map((name, index)=>(
                  <div key={index}>{name}</div>
                ))
              }
          </div>
        )}},
    {field: "hotel", headerName: "Hotel", width: 100},
    {field: "roomName", headerName: "Room Name", width: 150, renderCell:(params)=>{
      return (
        <div className="roomStatus">
            {
              params.row.roomName.map((name, index)=>(
                <div key={index}>{name}</div>
              ))
            }
        </div>
      )}
    },
    {field: "maxPeople", headerName: "Max People", width: 150, renderCell:(params)=>{
      return (
        <div className="roomStatus">
            {
              params.row.maxPeople.map((name, index)=>(
                <div key={index}>{name}</div>
              ))
            }
        </div>
      )}},
    {field: "price", headerName: "Price", width: 100, renderCell:(params)=>{
    return (
        <div className="roomStatus">
            {
            params.row.price.map((name, index)=>(
                <div key={index}>${name}</div>
            ))
            }
        </div>
    )}},
    {field: "action", headerName: "Actions", minWidth: 150, flex: 1,renderCell:(params)=>{
        return (
        <div className="roomStatus">
            {
            params.row.roomId.map((id, index)=>(
                <div className="actions" key={index}>
                    <Link to={`/admin/room/${id}`}><FontAwesomeIcon icon={faEdit} /></Link>
                   <button onClick={()=>deleteRoom(id)}><FontAwesomeIcon icon={faTrash} /></button>
                </div>
            ))
            }
        </div>
        )}
    },
  ];
  const rows = [];
  hotels && hotels.forEach((hotel)=>{
    rows.push({
      id: hotel._id,
      roomId: hotel.rooms.map((room)=>{
        return room._id
      }),
      hotel: hotel.name,
      roomName: hotel.rooms.map((room)=>{
        return room.title
      }),
      maxPeople: hotel.rooms.map((room)=>{
        return room.maxPeople
      }),
      price: hotel.rooms.map((room)=>{
        return room.price
      }),
    })
  })

  return (
    <div className='hotels container'>
        <Sidebar open="rooms" active="rooms" />
        <div className="hotelsContainer containerList">
            {(loading || isLoading) && <Loader />}
            <h2 className="title">Room List</h2>
            <div className="hotelDataList">
            <DataGrid
                rows={rows}
                columns={columns}
                initialState={{
                pagination: {
                    paginationModel: {
                    pageSize: 10,
                    },
                },
                }}
                pageSizeOptions={[10]}
                disableRowSelectionOnClick
                disableColumnMenu 
                autoHeight
                className='orderList'
                getRowHeight={() => 'auto'}
            />
            </div>
        </div>
    </div>
  )
}

export default RoomList