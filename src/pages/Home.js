import React from "react";
import ImageSlider from "../components/ImageSlider";
import Footer from "../components/Footer";
export default function Home() {
  return (
    <div>
      <ImageSlider/>
      <div style ={{
        display: 'flex',
        marginTop: '50px',
      }}/>
      <Footer/>
    </div>
  );
}