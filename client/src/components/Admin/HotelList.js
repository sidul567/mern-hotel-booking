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

function HotelList() {
  const {data, loading, error, reFetchData} = useFetch(HOST+"/api/v1/hotels");
  const {hotels} = data;
  const [isLoading, setIsLoading]  = useState(false);
  if(error){
    toast.error(error);
  }

  const deleteHotel = async (hotelId)=>{
    try{
      setIsLoading(true);
      const {data} = await axios.delete(HOST+`/api/v1/hotel/${hotelId}`, {
        'withCredentials': true,
      })
      if(data.success){
        setIsLoading(false);
        toast.success("Hotel Deleted successfully!");
        reFetchData();
      }
    }catch(err){
      toast.error(err.response.data.message);
      setIsLoading(false);
    }
  }

  const columns = [
    {field: "id", headerName: "ID", width: 220},
    {field: "hotel", headerName: "Hotel", width: 200},
    {field: "type", headerName: "Type", width: 100},
    {field: "cheapestPrice", headerName: "Cheapest Price", width: 200},
    {field: "action", headerName: "Actions", minWidth: 150, flex: 1,renderCell:(params)=>{
        return (
          <div className="actions">
              <Link to={`/admin/hotel/${params.row.id}`}><FontAwesomeIcon icon={faEdit} /></Link>
              <button onClick={()=>deleteHotel(params.row.id)}><FontAwesomeIcon icon={faTrash} /></button>
          </div>
        )}},
  ];
  const rows = [];
  hotels && hotels.forEach((hotel)=>{
    rows.push({
      id: hotel._id,
      hotel: hotel.name,
      type: hotel.type,
      cheapestPrice: hotel.cheapestPrice,
    })
  })

  return (
    <div className='hotels container'>
        <Sidebar open="hotels" active="hotels" />
        <div className="hotelsContainer containerList">
            {(loading || isLoading) && <Loader />}
            <h2 className="title">Hotel List</h2>
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
            />
            </div>
        </div>
    </div>
  )
}

export default HotelList