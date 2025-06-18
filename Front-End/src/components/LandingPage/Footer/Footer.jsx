// Footer.jsx
import React from 'react';
import { Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        {/* Company Info */}
        <div className="footer-section">
          <div className="footer-logo">
            <img src="/bmlogo.png" alt="BoardMate Logo" className="footer-logo-image" />
            <h3>BoardMate</h3>
          </div>
          <p className="footer-description">
            Your trusted platform for finding safe and comfortable student accommodation 
            across Sri Lanka.
          </p>
          <div className="social-links">
            <Facebook size={20} />
            <Twitter size={20} />
            <Instagram size={20} />
            <Linkedin size={20} />
          </div>
        </div>

        {/* Quick Links */}
        <div className="footer-section">
          <h4>Quick Links</h4>
          <ul>
            <li><a href="#">Home</a></li>
            <li><a href="#">About Us</a></li>
            <li><a href="#">Find Properties</a></li>
            <li><a href="#">List Your Property</a></li>
            <li><a href="#">Contact Us</a></li>
          </ul>
        </div>

        {/* Features */}
        <div className="footer-section">
          <h4>Features</h4>
          <ul>
            <li><a href="#">University Verified Listings</a></li>
            <li><a href="#">Virtual Tours</a></li>
            <li><a href="#">Secure Payments</a></li>
            <li><a href="#">24/7 Support</a></li>
            <li><a href="#">Legal Documentation</a></li>
          </ul>
        </div>

        {/* Contact Info */}
        <div className="footer-section">
          <h4>Contact Us</h4>
          <div className="contact-info">
            <div className="contact-item">
              <MapPin size={18} />
              <span>57, Ramakrishna Road, Colombo 06</span>
            </div>
            <div className="contact-item">
              <Phone size={18} />
              <span>+94 70 299 2699</span>
            </div>
            <div className="contact-item">
              <Mail size={18} />
              <span>boardm8te@gmail.com</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="footer-bottom">
        <p>&copy; 2024 BoardMate. All rights reserved.</p>
        <div className="footer-bottom-links">
          <a href="#">Privacy Policy</a>
          <a href="#">Terms of Service</a>
          <a href="#">Cookie Policy</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;