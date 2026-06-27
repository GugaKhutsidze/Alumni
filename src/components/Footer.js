import React from 'react';
import './Footer.css';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    
    <footer className="footer-main" >
      <div className="footer-container">
        
        <div className="footer-section">
          <h4>სხვა</h4>
          <ul className="footer-list">
            <li><a href="https://www.facebook.com/TbilisiStateUniversity" className="footer-link">Facebook</a></li>
            <li><a href="https://www.youtube.com/user/TSUchannel" className="footer-link">Youtube</a></li>
            <li><a href="https://www.linkedin.com/company/tbilisistateuniversity" className="footer-link">Linkedin</a></li>
          </ul> 
        </div>
        
        <div className="footer-section">
          <h4>სოციალური ქსელი</h4>
          <ul className="footer-list">
            <li><a href="https://www.facebook.com/TbilisiStateUniversity" className="footer-link">Facebook</a></li>
            <li><a href="https://www.youtube.com/user/TSUchannel" className="footer-link">Youtube</a></li>
            <li><a href="https://www.linkedin.com/company/tbilisistateuniversity" className="footer-link">Linkedin</a></li>
          </ul>
        </div>

        <div className="footer-section">
          <h4>საკონტაქტო</h4>
          <ul className="footer-list">
            <li><a href="mailto:someone@example.com" className="footer-link">ელფოსტა</a></li>
            <li><a href="tel:+995322250484" className="footer-link">ტელეფონი</a></li>
            <li><a href="https://goo.gl/maps/..." className="footer-link" target="_blank" rel="noreferrer">ქ. თბილისი, ი. ჭავჭავაძის გამზ. N1</a></li>
          </ul>
        </div>  

      </div>
      
      <div className="footer-bottom">
        <p>© {currentYear} თბილისის სახელმწიფო უნივერსიტეტი</p>
      </div>
    </footer>
  );
};

export default Footer;