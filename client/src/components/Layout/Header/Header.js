import React, { useContext, useState } from 'react'
import { faBed, faCalendarDays, faMinus, faPerson, faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Link, useNavigate } from 'react-router-dom';
import { format } from "date-fns";
import { DateRange } from 'react-date-range';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';
import './Header.css';
import { SearchContext } from '../../../context/SearchContext';
import { AuthContext } from '../../../context/AuthContext';

function Header() {
    const navigate = useNavigate();
    const [openDate, setOpenDate] = useState(false);
    const [openPeople, setOpenPeople] = useState(false);
    const [destination, setDestination] = useState("");
    const [options, setOptions] = useState({
        adult: 1,
        child: 0,
        room: 1,
    })
    const [date, setDate] = useState([
        {
            startDate: new Date(new Date().setHours(0, 0, 0, 0)),
            endDate: new Date(new Date().setHours(0, 0, 0, 0)),
            key: "selection",
        }
    ])

    const handleOption = (name, operation)=>{
        setOptions((prevState)=>{
            return {
                ...prevState,
                [name]: operation==="inc" ? prevState[name] + 1 : prevState[name] - 1,
            }
        })
    }

    const {dispatch} = useContext(SearchContext);
    const {user} = useContext(AuthContext);

    const handleSearch = ()=>{
        dispatch({type: "NEW_SEARCH", payload: {destination, options, date}})
        navigate("/hotels", {state: {destination, options, date}})
    }

    return (
        <div className='headersContainer'>
            <h3>A lifetime of discounts? It's Genius.</h3>
            <p>Get rewarded for your travels - unlock instant savings of 10% or more with a free Lamabooking account</p>
            {
                !user && <Link to="/login">Sign in / Register</Link>
            }
            <div className="searchBoxContainer">
                <div className="search">
                    <FontAwesomeIcon icon={faBed} />
                    <input type="text" name="location" placeholder='Where do you going?' value={destination} onChange={(e)=>setDestination(e.target.value)} />
                </div>
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
                <div className="people">
                    <FontAwesomeIcon icon={faPerson} />
                    <span onClick={()=>setOpenPeople(!openPeople)}>{options.adult} Adult . {options.child} Children . {options.room} Room</span>
                    {
                        openPeople && (
                            <div className="peopleCountContainer">
                                <div>
                                    <p>Adult</p>
                                    <div className="btn-list">
                                        <button onClick={()=>handleOption("adult", "dec")}><FontAwesomeIcon icon={faMinus} /></button>
                                        <p>{options.adult}</p>
                                        <button onClick={()=>handleOption("adult", "inc")}><FontAwesomeIcon icon={faPlus} /></button>
                                    </div>
                                </div>
                                <div>
                                    <p>Children</p>
                                    <div className="btn-list">
                                        <button onClick={()=>handleOption("child", "dec")}><FontAwesomeIcon icon={faMinus} /></button>
                                        <p>{options.child}</p>
                                        <button onClick={()=>handleOption("child", "inc")}><FontAwesomeIcon icon={faPlus} /></button>
                                    </div>
                                </div>
                                <div>
                                    <p>Room</p>
                                    <div className="btn-list">
                                        <button onClick={()=>handleOption("room", "dec")}><FontAwesomeIcon icon={faMinus} /></button>
                                        <p>{options.room}</p>
                                        <button onClick={()=>handleOption("room", "inc")}><FontAwesomeIcon icon={faPlus} /></button>
                                    </div>
                                </div>
                            </div>
                        )
                    }
                </div>
                <div className="search-btn">
                    <button onClick={handleSearch}>Search</button>
                </div>
            </div>
        </div>
    )
}

export default Header