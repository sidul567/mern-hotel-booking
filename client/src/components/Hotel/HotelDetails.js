import { faLocationDot } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React, { useContext, useState } from 'react'
import ImageGallery from './ImageGallery';
import './HotelDetails.css';
import Subscription from '../Home/Subscription';
import { useParams } from 'react-router-dom';
import useFetch from '../../hooks/useFetch';
import { HOST } from '../../host';
import Loader from '../Layout/Loader/Loader';
import { SearchContext } from '../../context/SearchContext';
import Reserve from './Reserve';
import { toast } from 'react-toastify';

function HotelDetails() {
    const { id } = useParams();
    const { data, loading, error } = useFetch(HOST + `/api/v1/hotel/${id}`);
    if(error){
        toast.error(error.message);
    }
    const { hotel } = data;
    const [openReserveModal, setOpenReserveModal] = useState(false);

    const {date} = useContext(SearchContext);

    const dayDifference = (startDate, endDate)=>{
        const timeDifference = Math.abs(new Date(endDate).getTime() - new Date(startDate).getTime());
        return Math.ceil((timeDifference+1) / 86400000);
    }

    const day = dayDifference(date[0]?.endDate || new Date() , date[0]?.startDate || new Date());
    return (
        <>
            {
                loading || !hotel ? <Loader /> : (
                    <>
                        <div className='hotelDetailsContainer'>
                            <div className="header">
                                <div className="details">
                                    <h3>{hotel.name}</h3>
                                    <p className='location'><FontAwesomeIcon icon={faLocationDot} /> {hotel.address}</p>
                                    <p className='distance'>Excellent location - {hotel.distance}m from center</p>
                                    <p className='green'>Book a stay over ${hotel.cheapestPrice} at this property and get a free airport taxi</p>
                                </div>
                                <div className="reserveBtn">
                                    {hotel.rooms.length !== 0 && <button onClick={()=>setOpenReserveModal(true)}>Reserve or Book now!</button>}
                                </div>
                            </div>
                            <ImageGallery images={hotel.photos} />
                            <div className="description-reservation">
                                <div className="description">
                                    <h3>{hotel.title}</h3>
                                    <p>{hotel.desc}</p>
                                </div>
                                <div className="reservation">
                                    <h4>Perfect for a {day}-night stay!</h4>
                                    <p>Located in the real heart of Krakow, this property has an excellent location score of 9.8!</p>
                                    <p className="price"><span>${day * hotel.cheapestPrice}</span> ({day} nights)</p>
                                    {hotel.rooms.length !== 0 ? <button onClick={()=>setOpenReserveModal(true)}>Reserve or Book now!</button>: <button className='unavailable'>Unavailable Room!</button>}
                                </div>
                            </div>
                        </div>
                        <Subscription />
                        {openReserveModal && <Reserve openModal={openReserveModal} setOpenModal = {setOpenReserveModal} hotelId={hotel._id} />}
                    </>
                )
            }
        </>
    )
}

export default HotelDetails