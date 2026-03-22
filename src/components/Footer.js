import React from 'react';
import './Footer.css';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer-main">
      <div className="footer-container">
        <div className="footer-section">
          <h3>Address</h3>
          <p>  </p>
        </div>
        
        <div className="footer-section">
          <h4>სოციალური ქსელი </h4>
          <ul className="footer-list">
            <li><a href="https://www.facebook.com/TbilisiStateUniversity" className="footer-link">Facebook</a></li>
            <li><a href="https://www.instagram.com/tbilisistateuniversity/?igshid=gw3mt7hsaydn&fbclid=IwAR3VtiF7dPEX-UQZdpU9BXH803r_Fou8EhFe6RL1E4fsjVMHFDwfhW5LkTk"  className="footer-link">Instagram</a></li>
            <li><a href="https://www.youtube.com/user/TSUchannel/featured" className="footer-link">Youtube</a></li>
            <li><a href="https://www.linkedin.com/company/tbilisistateuniversity/?fbclid=IwAR2NPeJNwOaNOFcmyR_fIVhFAS_Z5JmwROWc4ZbVsqaKdQ907DNw7Nq9Ki8" className="footer-link">Linkedin</a></li>
          </ul>
        </div>

            
        <div className="footer-section">
          <h4>საკონტაქტო</h4>
          <ul className="footer-list">
            <li><a href="https://discord.gg/ZpSXNEtB" className="footer-link"> Discord </a></li>
            <li><a href="email:someone@example.com" className="footer-link">ელფოსტა</a></li>
            <li><a href="tel+(+995 32) 2 25 04 84 " className="footer-link"> ტელეფონი</a></li>
            <li><a href="https://www.google.com/maps/dir//%E1%83%98%E1%83%95%E1%83%90%E1%83%9C%E1%83%94+%E1%83%AF%E1%83%90%E1%83%95%E1%83%90%E1%83%AE%E1%83%98%E1%83%A8%E1%83%95%E1%83%98%E1%83%9A%E1%83%98%E1%83%A1+%E1%83%A1%E1%83%90%E1%83%AE%E1%83%94%E1%83%9A%E1%83%9D%E1%83%91%E1%83%98%E1%83%A1+%E1%83%97%E1%83%91%E1%83%98%E1%83%9A%E1%83%98%E1%83%A1%E1%83%98%E1%83%A1+%E1%83%A1%E1%83%90%E1%83%AE%E1%83%94%E1%83%9A%E1%83%9B%E1%83%AC%E1%83%98%E1%83%A4%E1%83%9D+%E1%83%A3%E1%83%9C%E1%83%98%E1%83%95%E1%83%94%E1%83%A0%E1%83%A1%E1%83%98%E1%83%A2%E1%83%94%E1%83%A2%E1%83%98,+1+%E1%83%98%E1%83%9A%E1%83%98%E1%83%90+%E1%83%AD%E1%83%90%E1%83%95%E1%83%AD%E1%83%90%E1%83%95%E1%83%90%E1%83%AB%E1%83%98%E1%83%A1+%E1%83%92%E1%83%90%E1%83%9B%E1%83%96%E1%83%98%E1%83%A0%E1%83%98,+%E1%83%97%E1%83%91%E1%83%98%E1%83%9A%E1%83%98%E1%83%A1%E1%83%98+0179/@41.7095062,44.776701,18.6z/data=!4m17!1m7!3m6!1s0x40440cd30294b88b:0x9cfe7a9b37f34a36!2z4YOY4YOV4YOQ4YOc4YOUIOGDr-GDkOGDleGDkOGDruGDmOGDqOGDleGDmOGDmuGDmOGDoSDhg6Hhg5Dhg67hg5Thg5rhg53hg5Hhg5jhg6Eg4YOX4YOR4YOY4YOa4YOY4YOh4YOY4YOhIOGDoeGDkOGDruGDlOGDmuGDm-GDrOGDmOGDpOGDnSDhg6Phg5zhg5jhg5Xhg5Thg6Dhg6Hhg5jhg6Lhg5Thg6Lhg5g!8m2!3d41.7099824!4d44.7779992!16zL20vMDI3ZmRf!4m8!1m0!1m5!1m1!1s0x40440cd30294b88b:0x9cfe7a9b37f34a36!2m2!1d44.7779992!2d41.7099824!3e2?entry=ttu&g_ep=EgoyMDI2MDMxOC4xIKXMDSoASAFQAw%3D%3D" className="footer-link"> ქ. თბილისი, ი. ჭავჭავაძის გამზ. N1, თსუ I კორპუსი.</a></li>
          </ul>
        </div>  
      </div>
      
      <div className="footer-bottom">
        <p>&copy; {currentYear} თბილისის სახელმწიფო უნივერსიტეტი</p>
      </div>
    </footer>
  );
};

export default Footer;