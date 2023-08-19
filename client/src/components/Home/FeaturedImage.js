import React from 'react'
import './FeaturedImage.css'
import useFetch from '../../hooks/useFetch';
import { HOST } from '../../host';
import Loader from '../Layout/Loader/Loader';

function FeaturedImage() {
    const {data, loading, error} = useFetch(HOST+"/api/v1/hotel/countByCity?cities=Dhaka,Khulna,Rajshahi");
    const {list} = data;
  return (
    <>
        {loading ? <Loader /> : (
            <div className='featureImageContainer'>
            <div className="featureImage">
                <img src="https://cf.bstatic.com/xdata/images/city/max500/957801.webp?k=a969e39bcd40cdcc21786ba92826063e3cb09bf307bcfeac2aa392b838e9b7a5&o=" alt="" />
                <div className="featureImageDesc">
                    <h3>Dublin</h3>
                    <p>{list && list[0]} properties</p>
                </div>
            </div>
            <div className="featureImage">
                <img src="https://cf.bstatic.com/xdata/images/city/max500/690334.webp?k=b99df435f06a15a1568ddd5f55d239507c0156985577681ab91274f917af6dbb&o=" alt="" />
                <div className="featureImageDesc">
                    <h3>Reno</h3>
                    <p>{list && list[1]} properties</p>
                </div>
            </div>
            <div className="featureImage">
                <img src="https://cf.bstatic.com/xdata/images/city/max500/689422.webp?k=2595c93e7e067b9ba95f90713f80ba6e5fa88a66e6e55600bd27a5128808fdf2&o=" alt="" />
                <div className="featureImageDesc">
                    <h3>Austin</h3>
                    <p>{list && list[2]} properties</p>
                </div>
            </div>
            </div>
        )}
    </>
  )
}

export default FeaturedImage