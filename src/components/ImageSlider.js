import React, { useState, useEffect } from 'react';
import './ImageSlider.css';
import axios from "axios";

import img1 from '../images/img1.jpg';
import img2 from '../images/img2.jpg';
import img3 from '../images/img3.jpg';
import img4 from '../images/img4.jpg';
import img5 from '../images/img5.jpg';

const LOCAL_IMAGES = [
  { id: 1, url: img1 },
  { id: 2, url: img2 },
  { id: 3, url: img3 },
  { id: 4, url: img4 },
  { id: 5, url: img5 },
];

const API = "http://localhost:5000/api/slides";
const ME_API = "http://localhost:5000/api/me";

const ImageSlider = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [slides, setSlides] = useState(LOCAL_IMAGES);
  const [file, setFile] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);

  const SLIDES = slides.length ? slides : LOCAL_IMAGES;

  // =========================
  // CHECK ADMIN (REAL)
  // =========================
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) return;

    axios.get(ME_API, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    .then((res) => {
      if (res.data.role === "admin") {
        setIsAdmin(true);
      }
    })
    .catch(() => setIsAdmin(false));
  }, []);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % SLIDES.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + SLIDES.length) % SLIDES.length);
  };

  // =========================
  // FETCH SLIDES
  // =========================
  useEffect(() => {
    const fetchSlides = async () => {
      try {
        const res = await axios.get(API);

        if (res.data && res.data.length > 0) {
          setSlides(res.data);
        } else {
          setSlides(LOCAL_IMAGES);
        }
      } catch (err) {
        setSlides(LOCAL_IMAGES);
      }
    };

    fetchSlides();
  }, []);

  // auto slide
  useEffect(() => {
    const timer = setInterval(nextSlide, 5000);
    return () => clearInterval(timer);
  }, [slides]);

  // =========================
  // UPLOAD (ADMIN ONLY)
  // =========================
  const uploadImage = async () => {
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      const token = localStorage.getItem("token");

      await axios.post(API, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`
        },
      });

      const res = await axios.get(API);

      setSlides(res.data.length ? res.data : LOCAL_IMAGES);
      setFile(null);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className='asd'>

      {/* ADMIN UPLOAD */}
      {isAdmin && (
        <div>
          <input
            type="file"
            onChange={(e) => setFile(e.target.files[0])}
          />
          <button onClick={uploadImage}>
            Upload
          </button>
        </div>
      )}

      <div className="slider-full-container">
        <div className="slider-viewport">

          <div
            className="slider-track"
            style={{
              transform: `translateX(-${currentIndex * 100}%)`
            }}
          >
            {SLIDES.map((image, index) => (
              <div
                key={index}
                className="slide-item"
                style={{
                  backgroundImage: `url(${image.url})`
                }}
              />
            ))}
          </div>

          <button className="arrow arrow-left" onClick={prevSlide}>
            ❮
          </button>

          <button className="arrow arrow-right" onClick={nextSlide}>
            ❯
          </button>

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