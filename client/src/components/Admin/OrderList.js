import React, { useState } from 'react'
import Sidebar from './Sidebar'
import useFetch from '../../hooks/useFetch';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import { HOST } from '../../host';
import { DataGrid } from '@mui/x-data-grid';
import Loader from '../Layout/Loader/Loader';
import { toast } from 'react-toastify';
import axios from 'axios';
import { format } from 'date-fns';
import { Link } from 'react-router-dom';

function OrderList() {
  const {data, loading, error, reFetchData} = useFetch(HOST+"/api/v1/admin/orders");
  const {orders} = data;
  const [isLoading, setIsLoading]  = useState(false);
  if(!loading && error){
    toast.error(error);
  }

  const deleteOrder = async (hotelId)=>{
    try{
      setIsLoading(true);
      const {data} = await axios.delete(HOST+`/api/v1/order/${hotelId}`, {
        'withCredentials': true,
      })
      if(data.success){
        setIsLoading(false);
        toast.success("Order Deleted successfully!");
        reFetchData();
      }
    }catch(err){
      toast.error(err.message);
      setIsLoading(false);
    }
  }

  const columns = [
    {field: "id", headerName: "ID", minWidth: 120},
    {field: "hotel", headerName: "Hotel", minWidth: 80},
    {field: "roomName", headerName: "Room", minWidth: 115, renderCell:(params)=>{
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
    {field: "roomNumber", headerName: "Room Number", minWidth: 165, renderCell:(params)=>{
      return (
        <div className="roomStatus">
            {
              params.row.roomNumber.map((name, index)=>(
                <div key={index}>{name.join(", ")}</div>
              ))
            }
        </div>
      )}},
    {field: "status", headerName: "Status", minWidth: 80, renderCell:(params)=>{
      return (
        <>
          {
            params.row.status === "Pending" ? <p className='red'>{params.row.status}</p> : <p className='green'>{params.row.status}</p>
          }
        </>
      )
    }},
    {field: "user", headerName: "User", minWidth: 80},
    {field: "payment", headerName: "Payment", minWidth: 120, renderCell:(params)=>{
      return (
        <>
          {
            params.row.payment === "Paid" ? <p className='green'>{params.row.payment}</p> : <p className='red'>{params.row.payment}</p>
          }
        </>
      )
    }},
    {field: "dates", headerName: "Dates", minWidth: 130},
    {field: "price", headerName: "Total Price", minWidth: 150},
    {field: "action", headerName: "Actions", minWidth: 120,renderCell:(params)=>{
        return (
          <div className="actions">
              <Link to={`/admin/order/${params.row.id}`}><FontAwesomeIcon icon={faEdit} /></Link>
              <button onClick={()=>deleteOrder(params.row.id)}><FontAwesomeIcon icon={faTrash} /></button>
          </div>
        )}},
  ];
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
      user: order?.user?.username,
      payment: order.paymentInfo.status,
      status: order.status,
      price: "$"+order.totalPrice,
      dates: `${format(new Date(order.dates.startDate), "dd MMM, yyyy")} - ${format(new Date(order.dates.endDate), "dd MMM, yyyy")}`
    })
  })

  return (
    <div className='hotels container'>
        <Sidebar active="order" />
        <div className="hotelsContainer containerList">
            {(loading || isLoading) && <Loader />}
            <h2 className="title">Order List</h2>
            <div className="hotelDataList">
            <DataGrid
                style={{overflow: "hidden"}}
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

export default OrderList