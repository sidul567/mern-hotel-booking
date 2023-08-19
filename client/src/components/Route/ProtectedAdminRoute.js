import React, { useContext } from 'react'
import { Navigate, Outlet } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

function ProtectedAdminRoute() {
  const {user, loading} = useContext(AuthContext);
  if(loading === false){
    if(!user){
        return <Navigate to="/login" />
    }else if(user && !user.isAdmin){
        return <Navigate to="/" />
    }
  }
  return (
    <>
        <Outlet />
    </>
  )
}

export default ProtectedAdminRoute