import React from 'react'
import './Subscription.css';

function Subscription() {
  return (
    <div className='subscriptionContainer'>
        <h3>Save time, Save money!</h3>
        <p>Sign up and we'll send the best deals to you</p>
        <div className="subscription-input">
            <input type="email" name="email" id="" placeholder='Enter Email' />
            <button>Subscribe</button>
        </div>
    </div>
  )
}

export default Subscription