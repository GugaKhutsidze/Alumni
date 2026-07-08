import React, { useState, useEffect } from "react";
import "./ImageSlider.css";
import axios from "axios";
import { useTranslation } from "react-i18next"; // დამატებულია

import img1 from "../images/img1.jpg";
import img2 from "../images/img2.jpg";
import img3 from "../images/img3.jpg";
import img4 from "../images/img4.jpg";
import img5 from "../images/img5.jpg";

const LOCAL_IMAGES = [img1, img2, img3, img4, img5];
const BASE_API = "https://alumni-tsu-api-2026-gde9e8bsd3hnb7ar.westeurope-01.azurewebsites.net/api/news";

const ImageSlider = () => {
  const { i18n } = useTranslation(); // ვიღებთ i18n-ს
  const [currentIndex, setCurrentIndex] = useState(0);
  const [slides, setSlides] = useState([]);
  
  // 1 = ქართული, 0 = ინგლისური
  const currentLanguageId = i18n.language === "ka" ? 1 : 0;

  const cleanText = (text, maxLength) => {
    if (!text) return "";
    const plainText = text.replace(/<[^>]+>/g, '');
    return plainText.length > maxLength ? plainText.substring(0, maxLength) + "..." : plainText;
  };

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const res = await axios.get(`${BASE_API}?languageid=${currentLanguageId}`, {
          headers: {
            'Cache-Control': 'no-cache',
            'Pragma': 'no-cache',
            'Expires': '0',
          }
        });
        
        if (res.data && Array.isArray(res.data)) {
          const data = res.data.slice(-5).map((item, index) => ({
            id: item.newsId || index,
            url: LOCAL_IMAGES[index % LOCAL_IMAGES.length],
            title: item.title || "უცნობი",
            body: item.body || "",
            date: item.newsDate,
          }));
          setSlides(data);
          setCurrentIndex(0); // ენის შეცვლისას დაბრუნება თავში
        }
      } catch (error) {
        console.error("API error:", error);
      }
    };

    fetchNews();
  }, [currentLanguageId]); // როცა ენა იცვლება, ეს ავტომატურად გაეშვება

  useEffect(() => {
    if (slides.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [slides]);

  if (slides.length === 0) return null;

  return (
    <div className="asd">
      <div className="slider-full-container">
        <div className="slider-viewport">
          <div
            className="slider-track"
            style={{
              transform: `translateX(-${currentIndex * 100}%)`,
              display: "flex",
              transition: "transform 0.5s ease-in-out",
            }}
          >
            {slides.map((slide) => (
              <div
                key={slide.id}
                className="slide-item"
                style={{
                  backgroundImage: `url(${slide.url})`,
                  flex: "0 0 100%",
                }}
              >
                <div className="slide-content">
                  <span className="slide-date">
                    {slide.date && new Date(slide.date).toLocaleDateString()}
                  </span>
                  <h1 className="text-limit">{cleanText(slide.title, 60)}</h1>
                  <p className="text-limit-body">{cleanText(slide.body, 160)}</p>
                  <button>Read More</button>
                </div>
              </div>
            ))}
          </div>

          <button className="arrow arrow-left" onClick={() => setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length)}>❮</button>
          <button className="arrow arrow-right" onClick={() => setCurrentIndex((prev) => (prev + 1) % slides.length)}>❯</button>

          <div className="dots-container">
            {slides.map((_, index) => (
              <div
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={currentIndex === index ? "dot active" : "dot"}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageSlider;