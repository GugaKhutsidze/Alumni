import React from "react";
import "./Container.css";
import img1 from "../images/ასდ.jpg";
import { useTranslation } from "react-i18next";

export default function AboutUs() {
  const { t, i18n } = useTranslation();
  return (
    <section className="about-us">
      <div className="about-container">

        <div className="about-content">
          <span className="about-tag">{t("Platform of graduates of Ivane Javakhishvili Tbilisi State University")}</span>

          <h1>{t("About us")} </h1>

          <p>
            {t("Alumni platform of Tbilisi State University unites university graduates, students and academic community in a single space.")}
          </p>

          <p>
            {t("the platform helps to share experiences, organize events and maintain constant connection with the university")}
          </p>

      

          <button>{t("Learn More")}</button>
        </div>

        <div className="about-image">
          <img
            src={img1}
          />
        </div>

      </div>
    </section>
  );
}