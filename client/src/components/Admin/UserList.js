import React, { useState } from 'react'
import Sidebar from './Sidebar'
import useFetch from '../../hooks/useFetch';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import { HOST } from '../../host';
import { Link } from 'react-router-dom';
import { DataGrid } from '@mui/x-data-grid';
import Loader from '../Layout/Loader/Loader';
import { toast } from 'react-toastify';
import axios from 'axios';

function UserList() {
  const {data, loading, error, reFetchData} = useFetch(HOST+"/api/v1/users");
  const {users} = data;
  const [isLoading, setIsLoading]  = useState(false);
  if(error){
    toast.error(error);
  }

  const deleteUser = async (userId)=>{
    try{
      setIsLoading(true);
      const {data} = await axios.delete(HOST+`/api/v1/user/${userId}`, {
        'withCredentials': true,
      })
      if(data.success){
        setIsLoading(false);
        toast.success("User Deleted successfully!");
        reFetchData();
      }
    }catch(err){
      toast.error(err.response.data.message);
      setIsLoading(false);
    }
  }

  const columns = [
    {field: "id", headerName: "ID", width: 220},
    {field: "username", headerName: "Username", width: 120},
    {field: "email", headerName: "Email", width: 200},
    {field: "avatar", headerName: "Avatar", width: 100, renderCell: (params)=>{
      return (
        <img src={params.row.avatar.url} alt="Avatar" className='avatar' />
      )
    }},
    {field: "role", headerName: "Role", width: 100, renderCell:(params)=>{
        return (
            <>
                {
                    params.row.role ? <p className='green'>Admin</p> : <p>User</p>
                }
            </>
        )
    }},
    {field: "action", headerName: "Actions", minWidth: 150, flex: 1,renderCell:(params)=>{
        return (
          <div className="actions">
              <Link to={`/admin/user/${params.row.id}`}><FontAwesomeIcon icon={faEdit} /></Link>
              <button onClick={()=>deleteUser(params.row.id)}><FontAwesomeIcon icon={faTrash} /></button>
          </div>
        )}},
  ];
  const rows = [];
  users && users.forEach((user)=>{
    rows.push({
      id: user._id,
      username: user.username,
      email: user.email,
      role: user.isAdmin,
      avatar: user.avatar,
    })
  })

  return (
    <div className='hotels container'>
        <Sidebar active="user" />
        <div className="hotelsContainer containerList">
            {(loading || isLoading) && <Loader />}
            <h2 className="title">Hotel List</h2>
            <div className="hotelDataList">
            <DataGrid
                rows={rows}
                columns={columns}
                initialState={{
                pagination: {
                    paginationModel: {
                    pageSize: 10,
                    },
                },
                }}
                pageSizeOptions={[10]}
                disableRowSelectionOnClick
                disableColumnMenu 
                autoHeight
                className='orderList'
            />
            </div>
        </div>
    </div>
  )
}

export default UserList