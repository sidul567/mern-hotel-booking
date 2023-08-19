import React, { useState } from 'react'
import Sidebar from './Sidebar'
import './NewHotel.css';
import { toast } from 'react-toastify';
import axios from 'axios';
import { HOST } from '../../host';
import { useNavigate } from 'react-router-dom';
import Loader from '../Layout/Loader/Loader';

function NewHotel() {
    const [images, setImages] = useState([]);
    const [imagesPreview, setImagesPreview] = useState([]);
    const navigate = useNavigate();
    const [hotelInfo, setHotelInfo] = useState({
        name: "",
        city: "",
        address: "",
        distance: "",
        title: "",
        desc: "",
        cheapestPrice: "",
        type: "",
        featured: "",
    })
    const [isLoading, setIsLoading] = useState(false);

    const createHotelImagesChange = (e)=>{
        const files = Array.from(e.target.files);
        setImages([]);
        setImagesPreview([]);

        files.forEach((file)=>{
            const reader = new FileReader();

            reader.onload = ()=>{
                if(reader.readyState === 2){
                    setImages((prevImages)=>[...prevImages, file]);
                    setImagesPreview((prevImages)=>[...prevImages, reader.result]);
                }
            }

            reader.readAsDataURL(file);
        })
    }

    const handleInputChange = (e)=>{
        setHotelInfo((prevInfo)=>{
            return {
                ...prevInfo,
                [e.target.name]: e.target.value,
            }
        })
    }

    const handleSelectChange = (e)=>{
        setHotelInfo((prevInfo)=>{
            return {
                ...prevInfo,
                [e.target.name]: e.target.value,
            }
        })
    }

    const createHotel = async (e)=>{
        e.preventDefault();
        hotelInfo.photos = images;
        setIsLoading(true)
        try{
            const {data} = await axios.post(HOST+"/api/v1/hotel/new", {hotelInfo}, {
                'withCredentials': true,
                'headers': {
                    'Content-Type': 'multipart/form-data',
                }
            })
            if(data.success){
                toast.success("Hotel created successfully!");
                navigate("/admin/hotels");
            }
            setIsLoading(false);
        }catch(err){
            toast.error(err.response.data.message);
            setIsLoading(false);
        }
    }
    
  return (
    <div className='newHotel container'>
        <Sidebar open="hotels" active="newHotel" />
        <div className="newHotelContainer containerList">
            {
                isLoading && <Loader />
            }
            <h2 className="title">New Hotel</h2>
            <form className="hotelForm" onSubmit={createHotel} encType='multipart/form-data'>
                <div className="side1">
                    <div className="form-group">
                        <input type="text" name='name' placeholder='Hotel Name' onChange={handleInputChange} value={hotelInfo.name}  required/>
                    </div>
                    <div className="form-group">
                        <select defaultValue="" name="type" onChange={handleSelectChange} required>
                            <option value="" disabled>Choose type</option>
                            <option value="hotel">Hotel</option>
                            <option value="apartment">Apartment</option>
                            <option value="resort">Resort</option>
                            <option value="villa">Villa</option>
                            <option value="cabin">Cabin</option>
                        </select>
                    </div>
                    <div className="form-group">
                        <input type="text" name='city' placeholder='City' onChange={handleInputChange} value={hotelInfo.city}  required/>
                    </div>
                    <div className="form-group">
                        <input type="text" name='address' placeholder='Address' onChange={handleInputChange} value={hotelInfo.address}  required/>
                    </div>
                    <div className="form-group">
                        <input
                            type="file"
                            name='avatar'
                            accept='image/*'
                            onChange={createHotelImagesChange}
                            multiple
                            required
                        />
                    </div>
                    {
                        imagesPreview.length !== 0 && (<div className="createHotelImages">
                        {
                            imagesPreview.map((image, index)=>(
                                <img src={image} key={index} alt="Hotel" />
                            ))
                        }
                        </div>)
                    }
                    <div className="form-submit align-flex-start">
                        <input type="submit" value="Create Hotel" />
                    </div>
                </div>
                <div className="side2">
                    <div className="form-group">
                            <input type="text" name='distance' placeholder='Distance' onChange={handleInputChange} value={hotelInfo.distance}  required/>
                        </div>
                    <div className="form-group">
                        <input type="text" name='title' placeholder='Title' onChange={handleInputChange} value={hotelInfo.title}  required/>
                    </div>
                    <div className="form-group">
                        <input type="text" name='desc' placeholder='Description' onChange={handleInputChange} value={hotelInfo.desc}  required/>
                    </div>
                    <div className="form-group">
                        <input type="text" name='cheapestPrice' placeholder='Cheapest Price' onChange={handleInputChange} value={hotelInfo.cheapestPrice}  required/>
                    </div>
                    <div className="form-group">
                        <select defaultValue="" name="featured" onChange={handleSelectChange} required>
                            <option value="" disabled>Featured</option>
                            <option value={true}>Yes</option>
                            <option value={false}>No</option>
                        </select>
                    </div>
                </div>
            </form>
        </div>
    </div>
  )
}

export default NewHotel