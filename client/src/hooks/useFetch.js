import { useEffect, useState } from 'react';
import axios from 'axios';

const useFetch = (url)=>{
    const [data, setData] = useState({});
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(()=>{
        const fetchData = async()=>{
            setLoading(true);
            try{
                const {data: responseData} = await axios.get(url, {
                    'withCredentials': true,
                })
                setData(responseData); 
            }catch(err){
                setError(err.message)
            }
            setLoading(false);
        }
        fetchData();
    }, [url])

    const reFetchData = async()=>{
        setLoading(true);
        try{
            const {data: responseData} = await axios.get(url, {
                'withCredentials': true,
            })
            setData(responseData);
        }catch(err){
            setError(err.message)
        }
        setLoading(false);
    }

    return {data, error, loading, reFetchData};
}

export default useFetch;