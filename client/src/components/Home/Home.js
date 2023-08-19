import React, { useContext } from 'react'
import Header from '../Layout/Header/Header'
import FeaturedImage from './FeaturedImage'
import FeaturedByType from './FeaturedByType'
import FeaturedByLove from './FeaturedByLove'
import Subscription from './Subscription'

function Home() {
  return (
    <div className='homeContainer'>
        <Header />
        <FeaturedImage />
        <FeaturedByType />
        <FeaturedByLove />
        <Subscription />
    </div>
  )
}

export default Home