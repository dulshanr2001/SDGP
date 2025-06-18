import React from 'react';
import { 
  Search, 
  Calendar, 
  MessageSquare, 
  FileCheck, 
  CreditCard 
} from 'lucide-react';
import './HowItWorks.css';

const HowItWorksSection = () => {
  const steps = [
    {
      icon: <Search className="step-icon" />,
      number: "1",
      title: "Search & Explore",
      backgroundImage: "url('./search.png')", // Add your image path here
      description: [
        "Use filters to browse verified student accommodations.",
        "Access university-approved listings for added security.",
        "View high-quality photos, descriptions, and real student reviews."
      ]
    },
    {
      icon: <Calendar className="step-icon" />,
      number: "2",
      title: "Schedule a Tour",
      backgroundImage: "url('./slot.jpg')", // Add your image path here
      description: [
        "Book a virtual or in-person tour at your convenience.",
        "Get a real feel for the property before making a decision."
      ]
    },
    {
      icon: <MessageSquare className="step-icon" />,
      number: "3",
      title: "Connect with Homeowners",
      backgroundImage: "url('./chat.jpg')", // Add your image path here
      description: [
        "Chat directly with landlords through our secure in-app messaging.",
        "Get instant answers about pricing, amenities, and policies."
      ]
    },
    {
      icon: <FileCheck className="step-icon" />,
      number: "4",
      title: "Secure Your Spot",
      backgroundImage: "url('./key1.jpg')", // Add your image path here
      description: [
        "Submit applications and required documents digitally.",
        "Sign rental agreements with built-in legal document access."
      ]
    },
    {
      icon: <CreditCard className="step-icon" />,
      number: "5",
      title: "Make Secure Payments",
      backgroundImage: "url('./pay.jpg')", // Add your image path here
      description: [
        "Pay rent and deposits through our encrypted payment system.",
        "No hidden fees—just secure, transparent transactions."
      ]
    }
  ];

  return (
    <div id="how-it-works" className="how-it-works-section">
      <div className="section-header">
        <span className="section-tag">Simple Process</span>
        <h2>How It Works</h2>
        <p>
          Your journey to finding the perfect student accommodation is just five simple steps away.
          Here's how BoardMate makes the process easy and secure.
        </p>
      </div>

      <div className="steps-container">
        {steps.map((step, index) => (
          <div key={index} className="step-card">
            <div 
              className="step-image-container" 
              style={{ backgroundImage: step.backgroundImage }}
            >
              <div className="step-overlay"></div>
              <div className="step-icon-wrapper">
                {step.icon}
              </div>
            </div>
            <div className="step-content">
              <h3>Step {step.number}: {step.title}</h3>
              <p className="step-description">
                {step.description.map((item, i) => (
                  <span key={i} className="step-item">{item}</span>
                ))}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HowItWorksSection;