import React from 'react'
import { Dna } from  'react-loader-spinner'
import './Loader.css';

function Loader() {
  return (
    <div className="spinner">
        <Dna
        visible={true}
        height="80"
        width="80"
        ariaLabel="dna-loading"
        wrapperStyle={{}}
        wrapperClass="dna-wrapper"
        />
    </div>
  )
}

export default Loader