import React from 'react'
import not_found from '../../images/not_found.jpg';
import "./NotFound.css";
import { Link } from 'react-router-dom';
 
function NotFound() {
  return (
    <div class="notFoundContainer">
        <div class="illustration">
        <img src={not_found} alt="Not Found Illustration" />
        </div>
        <div class="content">
        <h1>Oops! Page Not Found</h1>
        <p>The page you are looking for does not exist.</p>
        <Link to="/">Go Back to Home</Link>
        </div>
    </div>
  )
}

export default NotFound