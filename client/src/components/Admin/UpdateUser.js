import React, { useEffect, useState } from 'react'
import Sidebar from './Sidebar'
import './NewHotel.css';
import { toast } from 'react-toastify';
import axios from 'axios';
import { HOST } from '../../host';
import { useNavigate, useParams } from 'react-router-dom';
import Loader from '../Layout/Loader/Loader';
import useFetch from '../../hooks/useFetch';

function UpdateUser() {
    const {id} = useParams();
    const {data, loading, error} = useFetch(HOST+`/api/v1/user/${id}`);
    const {user} = data;
    useEffect(()=>{
        if(user){
            const {__v, _id, ...filteredUser} = user;
            setUserInfo({...filteredUser});
            setAvatarPreview(filteredUser.avatar.url);
        }
    },[user])
    const [avatar, setAvatar] = useState("");
    const [avatarPreview, setAvatarPreview] = useState("");
    const navigate = useNavigate();
    const [userInfo, setUserInfo] = useState({
        username: "",
        email: "",
        isAdmin: "",
        avatar: "",
    })

    const [isLoading, setIsLoading] = useState(false);

    const createUserImageChange = (e)=>{
        const file = e.target.files[0];

        if(file){
            setAvatar("");
            setAvatarPreview("");
            const reader = new FileReader();

            reader.onload = ()=>{
                if(reader.readyState === 2){
                    setAvatar(file);
                    setAvatarPreview(reader.result);
                }
            }
            reader.readAsDataURL(file);
        }
    } 

    const handleInputChange = (e)=>{
        setUserInfo((prevInfo)=>{
            return {
                ...prevInfo,
                [e.target.name]: e.target.value,
            }
        })
    }

    const handleSelectChange = (e)=>{
        setUserInfo((prevInfo)=>{
            return {
                ...prevInfo,
                [e.target.name]: e.target.value,
            }
        })
    }

    const updateUser = async (e)=>{
        e.preventDefault();
        if(avatar){
            userInfo.avatar = avatar;
        }
        setIsLoading(true)
        try{
            const {data} = await axios.put(HOST+`/api/v1/user/${id}`, {userInfo}, {
                'withCredentials': true,
                'headers': {
                    'Content-Type': 'multipart/form-data',
                }
            })
            if(data.success){
                toast.success("User updated successfully!");
                navigate("/admin/users");
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
            <h2 className="title">Update Hotel</h2>
            <form className="hotelForm" onSubmit={updateUser} encType='multipart/form-data'>
                <div className="side1">
                    <div className="form-group">
                        <label htmlFor="username">Username</label>
                        <input type="text" name='username' placeholder='Username' onChange={handleInputChange} value={userInfo.username}  required/>
                    </div>
                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input type="text" name='email' placeholder='Email' onChange={handleInputChange} value={userInfo.email}  required/>
                    </div>
                    
                    <div className="form-submit align-flex-start">
                        <input type="submit" value="Update User" />
                    </div>
                </div>
                <div className="side2">
                    <div className="form-group">
                        <label htmlFor="isAdmin">Role</label>
                        <select value={userInfo.isAdmin}  name="isAdmin" onChange={handleSelectChange} required>
                            <option value="" disabled>Role</option>
                            <option value={true}>Admin</option>
                            <option value={false}>User</option>
                        </select>
                    </div>
                    <div className="form-group">
                        <label htmlFor="hotelImage">Image</label>
                        <div className="wrapper">
                            <input
                                type="file"
                                name='hotelImage'
                                accept='image/*'
                                onChange={createUserImageChange}
                                required={!avatarPreview ? true : false}
                            />
                            <div className="avatar">
                                <img src={avatarPreview} alt="" />
                            </div>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    </div>
  )
}

export default UpdateUser