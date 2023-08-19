import React, { useContext, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import login from '../../images/login.svg';
import './Login.css';
import { AuthContext } from '../../context/AuthContext';
import axios from 'axios';
import { HOST } from '../../host';
import Loader from '../Layout/Loader/Loader';

function Login() {
    const [loginInfo, setLoginInfo] = useState({
        username: "",
        password: "",
    });
    const navigate  = useNavigate();
    const location = useLocation();
    const redirect = location.search.split("=")[1] || "";
    const {authLoading, error, dispatch} = useContext(AuthContext);

    const handleLoginInput = (e)=>{
        setLoginInfo((prevState)=>{
            return {
                ...prevState,
                [e.target.name]: e.target.value
            }
        })
    }

    const loginSubmit = async (e)=>{
        e.preventDefault();

        try{
            dispatch({type: "LOGIN_REQUEST"});
            const { data } = await axios.post(HOST+"/api/v1/login", loginInfo, {
                'withCredentials': true,
                'headers': {
                    'Content-Type': 'application/json',
                }
            })
            dispatch({type: "LOGIN_SUCCESS", payload: data.user});
            if(redirect){
                const {state} = location;
                const {selectedRooms, selectedRoomsId, hotelId, dates} = state;
                navigate("/"+redirect, {
                    state: {selectedRooms, selectedRoomsId, hotelId, dates}
                })
            }else{
                navigate("/");
            }
        }catch(err){
            dispatch({type: "LOGIN_FAIL", payload: err?.response?.data?.message || err.message});
        }
    }

  return (
    <div className='loginContainer'>
        {authLoading && <Loader />}
        <div className="loginWrapper">
            <div className="loginInfo">
                <h3>Login</h3>
                <form onSubmit={loginSubmit}>
                    <div className="form-group">
                        <label htmlFor="username">Username</label>
                        <input type="text" name="username" placeholder='John_Doe' onChange={handleLoginInput}/>
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input type="password" name="password" placeholder='Enter 6 characters' onChange={handleLoginInput}/>
                    </div>
                    <div className="form-submit">
                        <input type="submit" value="Login" />
                    </div>
                    {error && <div className="error">{error}</div>}
                    <p>Don't have an account? <Link to="/register">Sign Up</Link></p>
                </form>
            </div>
            <div className="loginImg">
                <img src={login} alt="Login" />
            </div>
        </div>
    </div>  
  )
}

export default Login