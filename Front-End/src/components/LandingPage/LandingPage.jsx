import React from 'react';
import { Search, MapPin, Building, DollarSign, Shield, Clock, Tag} from 'lucide-react';
import './style.css';

const LandingPage = (props) => {
  const scrollToSection = (sectionId) => {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="container">
      {/* Navigation */}
      <nav className="navbar">
        <div className="logo">
          <img src="/bmlogo.png" alt="BoardMate Logo" className="logo-image" />
        </div>
        <div className="nav-links">
          <a href="#" onClick={() => scrollToSection('what-we-do')}>What We Do</a>
          <a href="#" onClick={() => scrollToSection('how-it-works')}>How It Works</a>
          <a href="#" onClick={() => scrollToSection('about-us')}>About Us</a>
          <a href="#" onClick={() => scrollToSection('list-property')}>List Your Property</a>
          <button className="nav-button" onClick={() => scrollToSection('find-place')}>Find A Place</button>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="hero">
        <div className="hero-content">
          <h1>Finding Student Housing <br />Made Easy</h1>
          <p>Discover and book safe, university-verified housing for students near top campuses and cities across Sri Lanka</p>
          <button className="cta-button" onClick={props.onGetStarted}>Get Started</button>

          {/* Feature Icons Section */}
          <div className="feature-icons">
            <div className="feature-item">
              <Shield size={24} />
              <span>Verified Properties</span>
            </div>
            <div className="feature-item">
              <Clock size={24} />
              <span>24x7 Assistance</span>
            </div>
            <div className="feature-item">
              <Tag size={24} />
              <span>Secure Payments</span>
            </div>
          </div>

          {/* Search Section */}
          {/* <div id="find-place" className="search-container">
            <div className="search-box">
              <div className="search-input">
                <div className="search-input-group">
                  <label className="search-input-label">University</label>
                  <select defaultValue="">
                    <option value="" disabled>Select an University</option>
                    <option value="IIT">Informatics Institute of Technology</option>
                  </select>
                </div>
              </div>
              <div className="search-input">
                <div className="search-input-group">
                  <label className="search-input-label">Location</label>
                  <select defaultValue="">
                    <option value="" disabled>Enter city or area</option>
                    <option value="Bambalapitiya">Bambalapitiya</option>
                    <option value="Wallewatta">Wallewatta</option>
                    <option value="Galle">Galle</option>
                  </select>
                </div>
              </div>
              <div className="search-input">
                <div className="search-input-group">
                  <label className="search-input-label">Gender</label>
                  <select defaultValue="">
                    <option value="" disabled>Please specify</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                  </select>
                </div>
              </div>
              <div className="search-input">
                <div className="search-input-group">
                  <label className="search-input-label">Room Type</label>
                  <select defaultValue="">
                    <option value="" disabled>Select type</option>
                    <option value="single">Single Room</option>
                    <option value="shared">Shared Room</option>
                    <option value="apartment">Apartment</option>
                  </select>
                </div>
              </div>
              <div className="search-input">
                <div className="search-input-group">
                  <label className="search-input-label">Price Range</label>
                  <select defaultValue="">
                    <option value="" disabled>Set your budget</option>
                    <option value="0-10000">Rs. 0 - 10,000</option>
                    <option value="10000-20000">Rs. 10,000 - 20,000</option>
                    <option value="20000-30000">Rs. 20,000 - 30,000</option>
                    <option value="30000+">Rs. 30,000+</option>
                  </select>
                </div>
              </div>
              <button className="search-button">
                <Search size={18} />
                Search Now
              </button>
            </div>
          </div> */}
        </div>
        
        <div className="hero-image">
          <img src="./herofinal2.png" alt="Modern house" />
        </div>
      </div>
    </div>
  );
};

export default LandingPage;