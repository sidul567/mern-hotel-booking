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

function UpdateOrder() {
    const {id} = useParams();
    const {data, loading, error} = useFetch(HOST+`/api/v1/order/${id}`);
    const {order} = data;
    const [orderInfo, setOrderInfo] = useState({
        orderId: "",
        username: "",
        payment: "",
        status: "",
    });
    
    useEffect(()=>{
        if(order){
            const {_id, user, paymentInfo, status} = order;
            setOrderInfo({orderId: _id, username: user.username, payment: paymentInfo.status, status});
        }
    },[order])
    const navigate = useNavigate();

    const [isLoading, setIsLoading] = useState(false);

    const handleInputChange = (e)=>{
        setOrderInfo({
            ...orderInfo,
            status: e.target.value,
        })
    }
    
    const updateOrder = async (e)=>{
        e.preventDefault();
        setIsLoading(true);
        try{
            const {data} = await axios.put(HOST+`/api/v1/order/${id}`, {status: orderInfo.status}, {
                'withCredentials': true,
                'headers': {
                    'Content-Type': 'application/json',
                }
            })
            if(data.success){
                toast.success("Order updated successfully!");
                navigate("/admin/orders");
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
            <h2 className="title">Update Order</h2>
            <form className="hotelForm" onSubmit={updateOrder}>
                <div className="side1">
                <div className="form-group">
                    <label htmlFor="title">Order ID</label>
                    <input type="text" name='title' placeholder='Room Name' onChange={handleInputChange} value={"#"+orderInfo.orderId}  disabled/>
                </div>
                <div className="form-group">
                    <label htmlFor="title">Username</label>
                    <input type="text" name='title' placeholder='Room Name' onChange={handleInputChange} value={orderInfo.username}  disabled/>
                </div>
                <div className="form-submit align-flex-start">
                        <input type="submit" value="Update Order" />
                    </div>
                </div>
                <div className="side2">
                    <div className="form-group">
                        <label htmlFor="title">Payment</label>
                        <input type="text" name='title' placeholder='Room Name' onChange={handleInputChange} value={orderInfo.payment} disabled/>
                    </div>
                    <div className="form-group">
                        <label htmlFor="status">Status</label>
                        <select value={orderInfo.status}  name="status" onChange={handleInputChange} required>
                            <option value="" disabled>Status</option>
                            <option value="Pending">Pending</option>
                            <option value="Success">Success</option>
                        </select>
                    </div>
                </div>
            </form>
        </div>
    </div>
  )
}

export default UpdateOrder