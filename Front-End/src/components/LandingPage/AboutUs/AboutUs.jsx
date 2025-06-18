import React, { useState } from 'react';
import { Mail, Phone, MapPin, Clock } from 'lucide-react';
import './AboutUs.css';

const AboutUs = () => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`Message Sent!\nName: ${formData.name}\nEmail: ${formData.email}\nMessage: ${formData.message}`);
    setFormData({ name: '', email: '', message: '' });
  };

  return (
    <div id="about-us" className="about-container">
      <div className="split-layout">
        {/* Left Section */}
        <div className="left-section">
          <div className="content-left">
            <h1 className="main-title">About<br />BoardMate</h1>
            <div className="info-box">
              <div className="info-section">
                <h2>Our Mission</h2>
                <p>BoardMate was created to address the challenges that university students face in finding 
                  suitable accommodation. We understand that finding safe, comfortable, and affordable 
                  housing can be stressful, especially for students from distant areas. Our platform 
                  simplifies this process by providing a comprehensive solution that connects students 
                  with verified accommodation providers.</p>
              </div>
              <div className="info-section">
                <h2>Our Team</h2>
                <p>BoardMate is developed by a dedicated team of students from the Informatics Institute 
                  of Technology, affiliated with the University of Westminster. Our diverse team brings 
                  together expertise in software development, user experience design, and student 
                  accommodation needs. We are committed to continuously improving our platform to better 
                  serve the student community.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Section */}
        <div className="right-section">
          <div className="content-right">
            <h2 className="contact-title">Easy to contact us</h2>
            <div className="contact-container">
              <div className="contact-info">
                <div className="contact-item"><Mail className="contact-icon" /><div className="contact-details"><h3>Email</h3><p>boardm8te@gmail.com</p></div></div>
                <div className="contact-item"><Phone className="contact-icon" /><div className="contact-details"><h3>Phone</h3><p>+94 70 299 2699</p></div></div>
                <div className="contact-item"><MapPin className="contact-icon" /><div className="contact-details"><h3>Address</h3><p>57, Ramakrishna Road, Colombo 06</p></div></div>
                <div className="contact-item"><Clock className="contact-icon" /><div className="contact-details"><h3>Business Hours</h3><p>24/7 Availability</p></div></div>
              </div>
            </div>

            {/* Contact Form */}
            <form className="contact-form" onSubmit={handleSubmit}>
              <h3>Send us a message</h3>
              <input type="text" name="name" placeholder="Your Name" value={formData.name} onChange={handleChange} required />
              <input type="email" name="email" placeholder="Your Email" value={formData.email} onChange={handleChange} required />
              <textarea name="message" placeholder="Your Message" value={formData.message} onChange={handleChange} required></textarea>
              <button type="submit">Send Message</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
