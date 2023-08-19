import React, { useContext } from 'react'
import { Link } from 'react-router-dom'
import './Navbar.css'
import { faArrowRightFromBracket, faBed, faCar, faChartLine, faHotel, faPlane } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { AuthContext } from '../../../context/AuthContext';
import { HOST } from '../../../host';
import { toast } from 'react-toastify';
import axios from 'axios';

function Header() {

  const {user, loading, dispatch} = useContext(AuthContext);
  
  const handleLogout = async ()=>{
    try{
      const {data} = await axios.get(HOST+"/api/v1/logout", {
        'withCredentials': true,
      })
      if(data.success){
        dispatch({type: "LOGOUT"});
      }
    }catch(err){
      toast.error(err.response.data.message)
    }
  }

  return (
    <>
      <header>
        <div className="logo">
          <Link to="/"><img src="https://play-lh.googleusercontent.com/-LLFboO3-LMZDXn9_2DyCtssJPXqxlbBciKoJ25o5S5wulGJo1QXme4HlFbevrYxUg" alt="" /></Link>
        </div>
          <>
            {!user ? (
                <div className="login_register_btn">
                  <Link to="/login">Login</Link>
                  <Link to="/register">Register</Link>
                </div>
              ) : (
                <div className='userOptions'>
                  <img src={user.avatar.url} className='username' />
                  <p><Link to="/hotelReservation"><FontAwesomeIcon icon={faHotel} /></Link></p>
                  {user.isAdmin && <p><Link to="/admin/dashboard"><FontAwesomeIcon icon={faChartLine} /></Link></p>}
                  <p onClick={handleLogout} className='logout'><FontAwesomeIcon icon={faArrowRightFromBracket} /></p>
                </div>
              )
            }
          </>
      </header>
      <div className="navListContainer">
        <div className="headerList">
          <div className="headerListItem">
            <FontAwesomeIcon icon={faBed} />
            <span>Stays</span>
          </div>
          <div className="headerListItem">
            <FontAwesomeIcon icon={faPlane} />
            <span>Flights</span>
          </div>
          <div className="headerListItem">
            <FontAwesomeIcon icon={faCar} />
            <span>Car Rentals</span>
          </div>
          <div className="headerListItem">
            <FontAwesomeIcon icon={faBed} />
            <span>Attractions</span>
          </div>
          <div className="headerListItem">
            <FontAwesomeIcon icon={faCar} />
            <span>Airport taxis</span>
          </div>
        </div>
      </div>
    </>
  )
}

export default Header