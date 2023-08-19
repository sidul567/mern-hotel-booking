import { faCalendarDays } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { format } from 'date-fns'
import React, { useContext, useEffect, useState } from 'react'
import { DateRange } from 'react-date-range'
import './Hotel.css';
import { Link, useLocation } from 'react-router-dom'
import { HOST } from '../../host'
import useFetch from '../../hooks/useFetch'
import Loader from '../Layout/Loader/Loader'
import { SearchContext } from '../../context/SearchContext'
import { toast } from 'react-toastify'

function Hotel() {
    const location = useLocation();
    const { state } = location;
    const [openDate, setOpenDate] = useState(false);
    const [date, setDate] = useState(state.date);
    const [destination, setDestination] = useState(state.destination);
    const [options, setOptions] = useState(state.options);
    const [min, setMin] = useState("");
    const [max, setMax] = useState("");
    const { data, loading, error, reFetchData } = useFetch(HOST + `/api/v1/hotels?city=${destination}&min=${min || 0}&max=${max || 10000}&maxPeople=${Number(options.adult)+Number(options.child)}&room=${options.room}`);
    if(error){
        toast.error(error.message);
    }
    const { hotels } = data;

    const {dispatch} = useContext(SearchContext);

    const handleOptions = (e) => {
        setOptions((prevState) => {
            return {
                ...prevState,
                [e.target.name]: e.target.value,
            }
        })
    }

    useEffect(()=>{
        dispatch({type: "NEW_SEARCH", payload: {destination, options, date}})
    }, [destination, options, date, dispatch])

    return (
        <div className='hotelListContainer'>
            <div className="search">
                <h3>Search</h3>
                <div className="destination">
                    <p>Destination</p>
                    <input type="text" name="destination" value={destination} onChange={(e) => setDestination(e.target.value)} />
                </div>
                <div className="checkInDate">
                    <p>Check In Date</p>
                    <div className="date">
                        <FontAwesomeIcon icon={faCalendarDays} />
                        <span onClick={() => setOpenDate(!openDate)}>{`${format(date[0].startDate, "dd MMM, yyyy")} to ${format(date[0].endDate, "dd MMM, yyyy")}`}</span>
                        {
                            openDate && (
                                <DateRange
                                    className='dateRange'
                                    editableDateInputs={true}
                                    minDate={new Date()}
                                    ranges={date}
                                    onChange={(item) => setDate([item.selection])}
                                    moveRangeOnFirstSelection={false}
                                />
                            )
                        }
                    </div>
                </div>
                <div className="options">
                    <p>Options</p>
                    <div>
                        <p>Min price per night</p>
                        <input type="number" name="price" id="" min="1" value={min} onChange={(e)=>setMin(e.target.value)} />
                    </div>
                    <div>
                        <p>Max price per night</p>
                        <input type="number" name="price" id="" min="1" value={max} onChange={(e)=>setMax(e.target.value)} />
                    </div>
                    <div>
                        <p>Adult</p>
                        <input type="number" name="adult" id="" placeholder="1" min="1" value={options.adult} onChange={handleOptions} />
                    </div>
                    <div>
                        <p>Children</p>
                        <input type="number" name="child" id="" placeholder="0" min="0" value={options.child} onChange={handleOptions} />
                    </div>
                    <div>
                        <p>Room</p>
                        <input type="number" name="room" id="" placeholder="1" min="1" value={options.room} onChange={handleOptions} />
                    </div>
                </div>
                <div className="searchBtn">
                    <button onClick={()=>reFetchData()}>Search</button>
                </div>
            </div>
            {
                loading ? <Loader /> : (
                <div className="searchResult">
                {
                    hotels && hotels.map((hotel) => (
                        <div className="searchItem" key={hotel._id}>
                            <div className="hotelImage">
                                <img src={hotel.photos[0].url} alt="" />
                            </div>
                            <div className="hotelDetails">
                                <h3>{hotel.name}</h3>
                                <p>{hotel.distance}m from center</p>
                                <p className="taxi">Free airport taxi</p>
                                <h5>Studio Apartment with Air conditioning</h5>
                                <p>{hotel.desc}</p>
                                <h5 className="green">Free cancellation</h5>
                                <p className='green'>You can cancel later, so lock in this great price today!</p>
                            </div>
                            <div className="hotelRating">
                                <div className="rating">
                                    {
                                        hotel.rating && (
                                            <>
                                                <p>Excellent</p>
                                                <p>8.9</p>
                                            </>
                                        )
                                    }
                                </div>
                                <div className="price">
                                    <p>${hotel.cheapestPrice}</p>
                                    <p>Includes taxes and fees</p>
                                    <Link to={`/hotel/${hotel._id}`}>See availability</Link>
                                </div>
                            </div>
                        </div>
                    ))
                }
                {
                    hotels && hotels.length === 0 && (<div className='notFound'><h1>Not found any hotel!</h1></div>)
                }
                </div>
                )
            }
        </div>
    )
}

export default Hotel