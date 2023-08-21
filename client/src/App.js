import './App.css';
import {Route, BrowserRouter as Router, Routes} from 'react-router-dom'
import Navbar from './components/Layout/Navbar/Navbar';
import Home from './components/Home/Home';
import Footer from './components/Layout/Footer/Footer';
import Hotel from './components/Hotel/Hotel';
import HotelDetails from './components/Hotel/HotelDetails';
import Login from './components/User/Login';
import Registration from './components/User/Registration';
import Toaster from './components/Toast/Toaster';
import 'react-toastify/dist/ReactToastify.css';
import ConfirmHotelReservation from './components/Hotel/ConfirmHotelReservation';
import HotelReservation from './components/User/HotelReservation';
import { HOST } from './host';
import { useContext, useEffect } from 'react';
import { AuthContext } from './context/AuthContext';
import axios from 'axios';
import ProtectedRoute from './components/Route/ProtectedRoute';
import Dashboard from './components/Admin/Dashboard';
import HotelList from './components/Admin/HotelList';
import RoomList from './components/Admin/RoomList';
import NewHotel from './components/Admin/NewHotel';
import UpdateHotel from './components/Admin/UpdateHotel';
import ProtectedAdminRoute from './components/Route/ProtectedAdminRoute';
import NewRoom from './components/Admin/NewRoom';
import UpdateRoom from './components/Admin/UpdateRoom';
import OrderList from './components/Admin/OrderList';
import UserList from './components/Admin/UserList';
import UpdateUser from './components/Admin/UpdateUser';
import Loader from './components/Layout/Loader/Loader';
import { toast } from 'react-toastify';
import NotFound from './components/NotFound/NotFound';
import Scanner from './components/Admin/Scanner';
import UpdateOrder from './components/Admin/UpdateOrder';

function App() {

  const {loading, loadUserError, dispatch} = useContext(AuthContext);
  if(loadUserError && loadUserError.code === "ERR_NETWORK"){
    toast.error(loadUserError.message);
  }

  useEffect(()=>{
    const loadUser = async ()=>{
      dispatch({type: "LOAD_USER_REQUEST"});
      try{
        const {data} = await axios.get((HOST+"/api/v1/loadUser"), {
          'withCredentials': true,
        });
        dispatch({type: "LOAD_USER_SUCCESS", payload: data.user})
      }catch(err){
        dispatch({type: "LOAD_USER_FAIL", payload: err});
      }
    }
    loadUser();
  }, [dispatch])
  
  return (
    <>
      {
        loading ? <Loader /> : (
          <Router>
          <Toaster />
          <Navbar />
          <Routes>
            <Route exact path='/' element={<Home />} />
            <Route exact path='/hotels' element={<Hotel />} />
            <Route exact path='/hotel/:id' element={<HotelDetails />} />
            <Route exact path='/login' element={<Login />} />
            <Route exact path='/register' element={<Registration />} />
            <Route exact path='/confirmReservation' element={<ConfirmHotelReservation />} />
            <Route exact path='/' element={<ProtectedRoute />}>
              <Route exact path='/hotelReservation' element={<HotelReservation />} />
            </Route>
            <Route exact path='/' element={<ProtectedAdminRoute />}>
              <Route exact path="admin/dashboard" element={<Dashboard />} />
              <Route exact path="admin/hotels" element={<HotelList />} />
              <Route exact path="admin/rooms" element={<RoomList />} />
              <Route exact path="admin/hotel/new" element={<NewHotel />} />
              <Route exact path="admin/hotel/:id" element={<UpdateHotel />} />
              <Route exact path="admin/room/new" element={<NewRoom />} />
              <Route exact path="admin/room/:id" element={<UpdateRoom />} />
              <Route exact path="admin/orders" element={<OrderList />} />
              <Route exact path="admin/order/:id" element={<UpdateOrder />} />
              <Route exact path="admin/users" element={<UserList />} />
              <Route exact path="admin/user/:id" element={<UpdateUser />} />
              <Route exact path="admin/scanner" element={<Scanner />} />
            </Route>
            <Route path='*' element={<NotFound />} />
          </Routes>
          <Footer />
        </Router>
        )
      }
    </>
  );
} 

export default App;
 