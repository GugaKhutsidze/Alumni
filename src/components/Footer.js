import React from 'react';
import './Footer.css';
import { useTranslation } from 'react-i18next';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const { t,i18n } = useTranslation();

  return (
    
    <footer className="footer-main" >
      <div className="footer-container">
        
        <div className="footer-section">
          <h4>{t("Other")}</h4>
          <ul className="footer-list">
            <li><a href="https://www.facebook.com/TbilisiStateUniversity" className="footer-link">Facebook</a></li>
            <li><a href="https://www.youtube.com/user/TSUchannel" className="footer-link">Youtube</a></li>
            <li><a href="https://www.linkedin.com/company/tbilisistateuniversity" className="footer-link">Linkedin</a></li>
          </ul> 
        </div>
        
        <div className="footer-section">
          <h4>{t("Social Networks")}</h4>
          <ul className="footer-list">
            <li><a href="https://www.facebook.com/TbilisiStateUniversity" className="footer-link">Facebook</a></li>
            <li><a href="https://www.youtube.com/user/TSUchannel" className="footer-link">Youtube</a></li>
            <li><a href="https://www.linkedin.com/company/tbilisistateuniversity" className="footer-link">Linkedin</a></li>
          </ul>
        </div>

        <div className="footer-section">
          <h4>{t("Contact")}</h4>
          <ul className="footer-list">
            <li><a href="mailto:someone@example.com" className="footer-link">{t("Email")}</a></li>
            <li><a href="tel:+995322250484" className="footer-link">{t("Phone")}</a></li>
            <li><a href="https://goo.gl/maps/..." className="footer-link" target="_blank" rel="noreferrer">{t("Address")}</a></li>
          </ul>
        </div>  

      </div>
      
      <div className="footer-bottom">
        <p>© {currentYear} {t("Ivana Javakhishvili Tbilisi State University")}</p>
      </div>
    </footer>
  );
};

export default Footer;