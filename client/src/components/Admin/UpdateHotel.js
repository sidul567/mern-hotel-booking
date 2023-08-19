import React, { useEffect, useState } from 'react'
import Sidebar from './Sidebar'
import './NewHotel.css';
import { toast } from 'react-toastify';
import axios from 'axios';
import { HOST } from '../../host';
import { useNavigate, useParams } from 'react-router-dom';
import Loader from '../Layout/Loader/Loader';
import useFetch from '../../hooks/useFetch';

function UpdateHotel() {
    const {id} = useParams();
    const {data, loading, error} = useFetch(HOST+`/api/v1/hotel/${id}`);
    const {hotel} = data;
    useEffect(()=>{
        if(hotel){
            const {__v, _id, ...filteredHotel} = hotel;
            setHotelInfo({...filteredHotel});
            setImagesPreview(hotel.photos.map((photo)=>photo.url));
        }
    },[hotel])
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
        photos: [],
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

    const updateHotel = async (e)=>{
        e.preventDefault();
        if(images.length !== 0){
            hotelInfo.photos.push([...images]);
        }
        setIsLoading(true)
        try{
            const {data} = await axios.put(HOST+`/api/v1/hotel/${id}`, {hotelInfo}, {
                'withCredentials': true,
                'headers': {
                    'Content-Type': 'multipart/form-data',
                }
            })
            if(data.success){
                toast.success("Hotel updated successfully!");
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
        <Sidebar/>
        <div className="newHotelContainer containerList">
            {
                (isLoading || loading) && <Loader />
            }
            <h2 className="title">Update Hotel</h2>
            <form className="hotelForm" onSubmit={updateHotel} encType='multipart/form-data'>
                <div className="side1">
                    <div className="form-group">
                        <label htmlFor="name">Hotel Name</label>
                        <input type="text" name='name' placeholder='Hotel Name' onChange={handleInputChange} value={hotelInfo.name}  required/>
                    </div>
                    <div className="form-group">
                        <label htmlFor="type">Hotel Type</label>
                        <select value={hotelInfo.type} name="type" onChange={handleSelectChange} required>
                            <option value="" disabled>Choose type</option>
                            <option value="hotel">Hotel</option>
                            <option value="apartment">Apartment</option>
                            <option value="resort">Resort</option>
                            <option value="villa">Villa</option>
                            <option value="cabin">Cabin</option>
                        </select>
                    </div>
                    <div className="form-group">
                        <label htmlFor="city">City</label>
                        <input type="text" name='city' placeholder='City' onChange={handleInputChange} value={hotelInfo.city}  required/>
                    </div>
                    <div className="form-group">
                        <label htmlFor="address">Address</label>
                        <input type="text" name='address' placeholder='Address' onChange={handleInputChange} value={hotelInfo.address}  required/>
                    </div>
                    <div className="form-group">
                        <label htmlFor="hotelImage">Images</label>
                        <input
                            type="file"
                            name='hotelImage'
                            accept='image/*'
                            onChange={createHotelImagesChange}
                            multiple
                            required={imagesPreview.length === 0 ? true : false}
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
                        <input type="submit" value="Update Hotel" />
                    </div>
                </div>
                <div className="side2">
                    <div className="form-group">
                        <label htmlFor="distance">Distance</label>
                        <input type="text" name='distance' placeholder='Distance' onChange={handleInputChange} value={hotelInfo.distance}  required/>
                    </div>
                    <div className="form-group">
                        <label htmlFor="title">Title</label>
                        <input type="text" name='title' placeholder='Title' onChange={handleInputChange} value={hotelInfo.title}  required/>
                    </div>
                    <div className="form-group">
                        <label htmlFor="desc">Description</label>
                        <input type="text" name='desc' placeholder='Description' onChange={handleInputChange} value={hotelInfo.desc}  required/>
                    </div>
                    <div className="form-group">
                        <label htmlFor="cheapestPrice">Cheapest Price</label>
                        <input type="text" name='cheapestPrice' placeholder='Cheapest Price' onChange={handleInputChange} value={hotelInfo.cheapestPrice}  required/>
                    </div>
                    <div className="form-group">
                        <label htmlFor="featured">Featured</label>
                        <select value={hotelInfo.featured}  name="featured" onChange={handleSelectChange} required>
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

export default UpdateHotel