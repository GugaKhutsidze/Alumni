import React, { useState, useEffect } from "react";
import "./ImageSlider.css";
import axios from "axios";

import img1 from "../images/img1.jpg";
import img2 from "../images/img2.jpg";
import img3 from "../images/img3.jpg";
import img4 from "../images/img4.jpg";
import img5 from "../images/img5.jpg";


const LOCAL_IMAGES = [
  img1,
  img2,
  img3,
  img4,
  img5,
];


const API =
  "https://alumni-tsu-api-2026-gde9e8bsd3hnb7ar.westeurope-01.azurewebsites.net/api/news";



const ImageSlider = () => {

  const [currentIndex, setCurrentIndex] = useState(0);
  const [slides, setSlides] = useState([]);



  useEffect(() => {

    const fetchNews = async () => {

      try {

        const res = await axios.get(API);


        const data = res.data.map((item,index)=>({

          id:item.newsId,

          url:
            LOCAL_IMAGES[index % LOCAL_IMAGES.length],

          title:item.title,

          body:item.body,

          date:item.newsDate

        }));


        setSlides(data);


      } catch(error){

        console.log(error);


        setSlides(
          LOCAL_IMAGES.map((image,index)=>({
            id:index,
            url:image,
            title:"",
            body:""
          }))
        );

      }

    };


    fetchNews();

  },[]);




  useEffect(()=>{

    if(!slides.length)
      return;


    const timer=setInterval(()=>{

      setCurrentIndex(prev =>
        (prev + 1) % slides.length
      );

    },5000);



    return ()=>clearInterval(timer);


  },[slides]);





  const nextSlide=()=>{

    setCurrentIndex(prev =>
      (prev + 1) % slides.length
    );

  };



  const prevSlide=()=>{

    setCurrentIndex(prev =>
      (prev - 1 + slides.length) % slides.length
    );

  };




  if(!slides.length)
    return null;




  return (

    <div className="asd">


      <div className="slider-full-container">


        <div className="slider-viewport">


          <div
            className="slider-track"

            style={{
              transform:
              `translateX(-${currentIndex * 100}%)`
            }}

          >


            {slides.map((slide)=>(


              <div

                key={slide.id}

                className="slide-item"

                style={{
                  backgroundImage:
                  `url(${slide.url})`
                }}

              >


                <div className="slide-content">


                  <span className="slide-date">

                    {new Date(
                      slide.date
                    ).toLocaleDateString()}

                  </span>



                  <h1>
                    {slide.title}
                  </h1>



                  <p>

                    {slide.body?.length > 160
                    ?
                    slide.body.substring(0,160)+"..."
                    :
                    slide.body
                    }

                  </p>



                  <button>
                    Read More
                  </button>


                </div>


              </div>


            ))}



          </div>





          <button
            className="arrow arrow-left"
            onClick={prevSlide}
          >
            ❮
          </button>



          <button
            className="arrow arrow-right"
            onClick={nextSlide}
          >
            ❯
          </button>





          <div className="dots-container">


            {slides.map((_,index)=>(


              <div

                key={index}

                onClick={()=>
                  setCurrentIndex(index)
                }

                className={
                  currentIndex===index
                  ?
                  "dot active"
                  :
                  "dot"
                }

              />


            ))}


          </div>


        </div>


      </div>


    </div>

  );

};


export default ImageSlider;