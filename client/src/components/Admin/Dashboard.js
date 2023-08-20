import React from 'react'
import Sidebar from './Sidebar'
import './Dashboard.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowCircleLeft, faArrowCircleRight, faBed, faUserCircle } from '@fortawesome/free-solid-svg-icons';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';
import { Doughnut, Line } from 'react-chartjs-2';
import { Link } from 'react-router-dom';
import useFetch from '../../hooks/useFetch';
import { HOST } from '../../host';
import Loader from '../Layout/Loader/Loader';

function Dashboard() {
  const {data: {hotels}, loading} = useFetch(HOST+`/api/v1/hotels`);
  const {data: {rooms}} = useFetch(HOST+`/api/v1/rooms`);
  const {data: {orders}} = useFetch(HOST+`/api/v1/admin/orders`);
  const {data: {users}} = useFetch(HOST+`/api/v1/users`);

  let totalAmount = 0;
  orders && orders.forEach((order)=>totalAmount += order.totalPrice);

  let availableHotels = 0;
  hotels && hotels.forEach((hotel)=>hotel.rooms.length > 0 && availableHotels++);

  ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    ArcElement
  );
  
  const lineState = {
    labels: ["Initial Amount", "Amount Earned"],
    datasets: [{
      label: "Total Amount",
      data: [0, totalAmount],
      backgroundColor: "#220092"
    }]
  }
  
  const doughnutState = {
    labels: ["Available hotel", "Unavailable Hotel"],
    datasets: [{
      data: [availableHotels, hotels && hotels.length - availableHotels],
    backgroundColor: [
      'rgba(153, 102, 255, 0.2)',
      'rgba(255, 159, 64, 0.2)',
    ],
    borderColor: [
      'rgba(153, 102, 255, 1)',
      'rgba(255, 159, 64, 1)',
    ],
    borderWidth: 1,
    }]
  }  

  return (
    <div className='dashboard'>
        <Sidebar active="dashboard" />
        {loading && <Loader />}
        <div className="dashboardContainer">
          <h2 className='title'>Dashboard</h2>
          <div className="dashboardItemContainer">
            <Link to="/admin/hotels" className='dashboardItem'>
              <div><FontAwesomeIcon icon={faArrowCircleLeft} /></div>
              <p>Total Hotels</p>
              <p className='number'>{hotels && hotels.length}</p>
            </Link>
            <Link to="/admin/rooms" className='dashboardItem'>
              <div><FontAwesomeIcon icon={faBed} /></div>
              <p>Total Rooms</p>
              <p className='number'>{rooms && rooms.length}</p>
            </Link>
            <Link to="/admin/orders" className='dashboardItem'>
              <div><FontAwesomeIcon icon={faArrowCircleRight} /></div>
              <p>Total Orders</p>
              <p className='number'>{orders && orders.length}</p>
            </Link>
            <Link to="/admin/users" className='dashboardItem'>
              <div><FontAwesomeIcon icon={faUserCircle} /></div>
              <p>Total Users</p>
              <p className='number'>{users && users.length}</p>
            </Link>
          </div>
          <div className="lineChart">
            <Line data={lineState} />
          </div>
          <div className="doughnut">
            <Doughnut data={doughnutState} />
          </div>
        </div>
    </div>
  )
}

export default Dashboard