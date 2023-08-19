import React, { useContext, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import register from '../../images/register.svg';
import './Registration.css';
import { AuthContext } from '../../context/AuthContext';
import axios from 'axios';
import { HOST } from '../../host';
import Loader from '../Layout/Loader/Loader';
import avatar from '../../images/avatar.png';

function Registration() {
    const [registrationInfo, setRegistrationInfo] = useState({
        username: "",
        email: "",
        password: "",
        avatar: "",
    });
    const [avatarPreview, setAvatarPreview] = useState("");
    const navigate  = useNavigate();
    const {loading, error, dispatch} = useContext(AuthContext);

    const handleRegistrationInput = (e)=>{
        setRegistrationInfo((prevState)=>{
            return {
                ...prevState,
                [e.target.name]: e.target.value
            }
        })
    }

    const handleImageChange = (e)=>{
        const file = e.target.files[0];

        if(file){
            setAvatarPreview("");
            const reader = new FileReader();

            reader.onload = ()=>{
                if(reader.readyState === 2){
                    setRegistrationInfo({
                        ...registrationInfo,
                        [e.target.name]: file,
                    })
                    setAvatarPreview(reader.result);
                }
            }
            reader.readAsDataURL(file);
        }
    }

    const registrationSubmit = async (e)=>{
        e.preventDefault();

        try{
            dispatch({type: "REGISTRATION_REQUEST"});
            const { data } = await axios.post(HOST+"/api/v1/register", registrationInfo, {
                'withCredentials': true,
                'headers': {
                    'Content-Type': 'multipart/form-data',
                }
            })
            dispatch({type: "REGISTRATION_SUCCESS", payload: data.user});
            navigate("/");
        }catch(err){
            dispatch({type: "REGISTRATION_FAIL", payload: err.response.data.message});
        }
    }

  return (
    <div className='loginContainer registrationContainer'>
        {loading && <Loader />}
        <div className="loginWrapper">
            <div className="loginInfo">
                <h3>Registration</h3>
                <form onSubmit={registrationSubmit} encType='multipart/form-data'>
                    <div className="form-group">
                        <label htmlFor="username">Username</label>
                        <input type="text" name="username" placeholder='John_Doe' onChange={handleRegistrationInput} required/>
                    </div>
                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input type="email" name="email" placeholder='abc@gmail.com' onChange={handleRegistrationInput} required/>
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input type="password" name="password" placeholder='Enter 6 characters' onChange={handleRegistrationInput} required/>
                    </div>
                    <div className="form-group">
                        <label htmlFor="avatar">Avatar</label>
                        <div className="wrapper">
                            <input type="file" name="avatar" onChange={handleImageChange} required/>
                            <div className="avatar">
                                <img src={avatarPreview || avatar} alt="Avatar" />
                            </div>
                        </div>
                    </div>
                    <div className="form-submit">
                        <input type="submit" value="Sign Up" />
                    </div>
                    {error && <div className="error">{error}</div>}
                    <p>Already have an account? <Link to="/login">Log In</Link></p>
                </form>
            </div>
            <div className="loginImg">
                <img src={register} alt="Register" />
            </div>
        </div>
    </div>  
  )
}

export default Registration