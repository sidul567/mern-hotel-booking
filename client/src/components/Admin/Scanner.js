import React, { useState } from 'react'
import Sidebar from './Sidebar'
import QrReader from 'react-qr-scanner';
import './Scanner.css';
import axios from 'axios';
import { HOST } from '../../host';
import Backdrop from '@mui/material/Backdrop';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Fade from '@mui/material/Fade';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { Cancel, CheckCircle } from '@mui/icons-material';

function Scanner() {
    const style = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 350,
        bgcolor: 'background.paper',
        border: '2px solid #000',
        boxShadow: 24,
        p: 4,
      };

      const [data, setData] = useState({
        success: "",
        message: "",
      });
      
    const handleError = (err)=>{
        console.log(err);
    }
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);
    const handleScan = async (result)=>{
        if(result && !loading){
            try{
                setLoading(true);
                const {data} = await axios.get(HOST+`/api/v1/order/verify/${result.text}`, {
                    'withCredentials': true,
                })
                setLoading(false);
                if(data.success){
                    setData({success: true, message: "Scanned Successfully!"});
                    setOpen(true);
                }
            }catch(err){
                setData({success: false, message: err.response.data.message});
                setOpen(true);
            }
        }
    }
    return (
    <div className="container">
        <Sidebar active="scanner" />
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
            <Modal
                aria-labelledby="transition-modal-title"
                aria-describedby="transition-modal-description"
                open={open}
                onClose={()=>setOpen(false)}
                closeAfterTransition
                slots={{ backdrop: Backdrop }}
                slotProps={{
                backdrop: {
                    timeout: 500,
                },
                }}
            >
                <Fade in={open}>
                <Box sx={style}>
                    {
                        data && data.success ? <CheckCircle fontSize='large' color='success' /> : <Cancel fontSize='large' color='error'  />
                    }
                    <Typography id="transition-modal-title" variant="h6" component="h2" marginBottom={1}>
                    {data.message || "Something went wrong!"}
                    </Typography>
                    <Button variant='outlined' size='medium' onClick={()=>window.location.reload()}>Scan</Button>
                </Box>
                </Fade>
            </Modal>
        </div>
    </div>
  )
}

export default Scanner