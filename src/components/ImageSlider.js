import React, { useState, useEffect } from 'react';
import './ImageSlider.css';

import img1 from '../images/img1.jpg'; 
import img2 from '../images/img2.jpg';
import img3 from '../images/img3.jpg';
import img4 from '../images/img4.jpg';
import img5 from '../images/img5.jpg';

const SLIDES = [img1, img2, img3, img4, img5];

const ImageSlider = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % SLIDES.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + SLIDES.length) % SLIDES.length);
  };

  useEffect(() => {
    const timer = setInterval(nextSlide, 5000);
    return () => clearInterval(timer);
  }, [currentIndex]);

  return (
    <div className='asd'>
    <div className="slider-full-container">
      <div className="slider-viewport">
        
        <div 
          className="slider-track"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {SLIDES.map((image, index) => (
            <div 
              key={index} 
              className="slide-item" 
              style={{ backgroundImage: `url(${image})` }} 
            />
          ))}
        </div>

        <button className="arrow arrow-left" onClick={prevSlide}>❮</button>
        <button className="arrow arrow-right" onClick={nextSlide}>❯</button>

        <div className="dots-container">
          {SLIDES.map((_, index) => (
            <div
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`dot ${currentIndex === index ? 'active' : ''}`}
            />
          ))}
        </div>
      </div>
    </div>
    </div>
  );
};

export default ImageSlider;