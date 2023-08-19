import React, { useContext } from 'react'
import { Navigate, Outlet } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

function ProtectedRoute() {
  const {user, loading, authLoading} = useContext(AuthContext);
  return (
    <>
    {
        ((loading  === false) || (authLoading === false)) && (
            <>
                {
                    user ? <Outlet /> : <Navigate to="/login" />
                }
            </>
        )
    }
    </>
  )
}

export default ProtectedRoute