import React, { useMemo, useState } from 'react'
import { DataGrid } from '@mui/x-data-grid';
import useFetch from '../../hooks/useFetch';
import { HOST } from '../../host';
import './HotelReservation.css';
import { format } from 'date-fns';
import Loader from '../Layout/Loader/Loader';
import { toast } from 'react-toastify';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDownload } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import { Button } from '@mui/material';

function HotelReservation() {
  const {data, loading, error} = useFetch(HOST+"/api/v1/orders");
  const [isLoading, setIsLoading] = useState(false);
  if(error){
    toast.error(error.message);
  }

  const downloadTicket = async (id)=>{
    try {
      setIsLoading(true);
      const response = await axios.post(HOST+'/api/v1/generate-pdf', {order_id: id}, { responseType: 'arraybuffer' });
      setIsLoading(false);

      // Create a Blob from the received ArrayBuffer
      const blob = new Blob([response.data], { type: 'application/pdf' });

      // Create a URL for the Blob and set it as the PDF data
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = id+'.pdf';
      a.click();
    } catch (error) {
      console.error(error);
      setIsLoading(false);
    } 
  }

  const {orders} = data;
  const columns = useMemo(
    ()=>[
      {field: "id", headerName: "ID", width: 220},
      {field: "hotel", headerName: "Hotel", width: 100},
      {field: "roomName", headerName: "Room Name", width: 170, renderCell:(params)=>{
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
      {field: "roomNumber", headerName: "Room Number", minWidth: 170, renderCell:(params)=>{
        return (
          <div className="roomStatus">
              {
                params.row.roomNumber.map((name, index)=>(
                  <div key={index}>{name.join(", ")}</div>
                ))
              }
          </div>
        )}},
      {field: "dates", headerName: "Dates", width: 150},
      {field: "ticket", headerName: "Ticket", width: 100, renderCell: (params)=>{
        return(
          <Button className='ticket' variant='contained' onClick={()=>downloadTicket(params.row.id)} disabled={isLoading}><FontAwesomeIcon icon={faDownload} /></Button>
        )
      }},
      {field: "price", headerName: "Total Price", minWidth: 150, flex: 1},
    ],
    [isLoading]
  )
  const rows = [];
  orders && orders.forEach((order)=>{
    rows.push({
      id: order._id,
      hotel: order.hotelInfo.hotelId.name,
      roomName: order.hotelInfo.roomInfo.map((room)=>{
        return room.roomName
      }),
      roomNumber: order.hotelInfo.roomInfo.map((room)=>{
        return room.roomNumber
      }),
      price: "$"+order.totalPrice,
      dates: `${format(new Date(order.dates.startDate), "dd MMM, yyyy")} to ${format(new Date(order.dates.endDate), "dd MMM, yyyy")}`
    })
  })
  return (
    <div className='hotelReservationContainer'>
      <h2 className='title'>My Orders</h2>
      {(loading || isLoading) && <Loader />}
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
  )
}

export default HotelReservation