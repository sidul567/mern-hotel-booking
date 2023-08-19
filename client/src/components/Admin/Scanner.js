import React, { useState } from 'react'
import Sidebar from './Sidebar'
import QrReader from 'react-qr-scanner';
import './Scanner.css';
import {toast} from 'react-toastify';
import axios from 'axios';
import { HOST } from '../../host';

function Scanner() {
    const handleError = (err)=>{
        console.log(err);
    }
    const handleScan = async (result)=>{
        if(result){
            try{
                const {data} = await axios.get(HOST+`/api/v1/order/verify/${result.text}`, {
                    'withCredentials': true,
                })
                if(data.success){
                    toast.success("Scanned Successfully!");
                }
            }catch(err){
                toast.error(err.response.data.message);
            }
        }
    }

    return (
    <div className="container">
        <Sidebar />
        <div className="containerList">
            <h2 className="title">Scanner</h2>
            <div className="scanner">
                <QrReader 
                    delay={10000}
                    style={{"width": "100%"}}
                    onError={handleError}
                    onScan={handleScan}
                    constraints={{
                        audio: false,
                        video: { facingMode: "environment" }
                      }}
                />
                <div className="corner top-left"></div>
                <div className="corner top-right"></div>
                <div className="corner bottom-left"></div>
                <div className="corner bottom-right"></div>
            </div>
        </div>
    </div>
  )
}

export default Scanner