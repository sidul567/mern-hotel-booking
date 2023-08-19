import { faArrowLeft, faArrowRight, faTimes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useState } from 'react'
import './ImageGallery.css';

function ImageGallery({images}) {
    const [selectedImageIndex, setSelectedImageIndex] = useState(null);
    const [lightboxOpen, setLightboxOpen] = useState(false);
  
    const openLightbox = (index) => {
      setSelectedImageIndex(index);
      setLightboxOpen(true);
    };
  
    const closeLightbox = () => {
      setLightboxOpen(false);
      setTimeout(() => {
        setSelectedImageIndex(null);
      }, 300);
    };
  
    const showNextImage = () => {
      setSelectedImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    };
  
    const showPrevImage = () => {
      setSelectedImageIndex((prevIndex) => (prevIndex + images.length - 1) % images.length);
    };
  return (
    <>
      <div className="gallery">
      {images.map((image, index) => (
        <img
          key={index}
          src={image.url}
          alt={`${index + 1}`}
          onClick={() => openLightbox(index)}
        />
      ))}
      </div>
    {selectedImageIndex !== null && (
      <div className={`lightbox ${lightboxOpen ? 'fadeIn' : 'fadeOut'}`}>
        <span className="close-btn" onClick={closeLightbox}>
          <FontAwesomeIcon icon={faTimes} />
        </span>
        <img src={images[selectedImageIndex].url} alt={`${selectedImageIndex + 1}`} />
        {
          images.length > 1 && (
            <>
              <button className="prev-btn" onClick={showPrevImage}>
                <FontAwesomeIcon icon={faArrowLeft} />
              </button>
              <button className="next-btn" onClick={showNextImage}>
                <FontAwesomeIcon icon={faArrowRight} />
              </button>
            </>
          )
        }
      </div>
    )}
    </>
  )
}

export default ImageGallery