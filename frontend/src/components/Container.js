import React from "react";
import imag3 from '../images/imag3.jpg';
import './Container.css';

export default function Container() {
  return (
    <section className="about-section">
      <div className="about-container">
        <div className="about-content">
          <h1>ჩვენ შესახებ</h1>
          <p>
            პლატფორმა შექმნილია ივანე ჯავახიშვილის სახელობის თბილისის სახელმწიფო 
            უნივერსიტეტსა და მის კურსდამთავრებულებს შორის მჭიდრო, უწყვეტი კავშირის 
            დასამყარებლად. ჩვენი მიზანია შევქმნათ ერთიანი სივრცე, სადაც 
            უნივერსიტეტის კურსდამთავრებული შეძლებს პროფესიულ განვითარებას, გამოცდილების 
            გაზიარებასა და კარიერულ წინსვლას.
          </p>
        </div>
        <div className="about-image-wrapper">
          <img src={imag3} alt="TSU Alumni" className="about-img"/>
        </div>
      </div>
    </section>
  );
}