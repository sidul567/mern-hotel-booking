import React from 'react'
import './FeaturedByLove.css'
import useFetch from '../../hooks/useFetch';
import { HOST } from '../../host';
import Loader from '../Layout/Loader/Loader';

function FeaturedByLove() {
    const {data, loading, error} = useFetch(HOST+"/api/v1/hotels?featured=true&limit=4");
    const {hotels} = data;
  return (
    <div className='featuredByLove'>
        {loading && <Loader />}
        <h4>Homes Guests Love</h4>
        <div className='featuredByLoveContainer'>
            {
                hotels && hotels.map((hotel)=>(
                    <div className="featureImage" key={hotel._id}>
                        <img src={hotel.photos[0].url} alt="" />
                        <div className="featureImageDesc">
                            <h3>{hotel.name}</h3>
                            <p>{hotel.city}</p>
                            <h5>Starting from ${hotel.cheapestPrice}</h5>
                            {hotel.rating && (
                                <p><span>{hotel.rating}</span> Excellent</p>
                            )}
                        </div>
                    </div>
                ))
            }
        </div>
    </div>
  )
}

export default FeaturedByLove