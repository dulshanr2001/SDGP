import React from 'react';
import { 
  GraduationCap, 
  Shield, 
  Award, 
  Users, 
  Calendar, 
  MessageSquare, 
  FileText, 
  CreditCard 
} from 'lucide-react';
import './WhatWeDo.css';

const WhatWeDoSection = () => {
  const features = [
    {
      icon: <GraduationCap  className="feature-icon" />,
      title: "Built for Students",
      description: "We've designed a platform specifically to simplify your search for safe, student-friendly accommodations."
    },
    {
      icon: <Shield className="feature-icon" />,
      title: "Verified Listings You Can Trust",
      description: "All listings undergo rigorous verification, guaranteeing trustworthy properties and homeowners."
    },
    {
      icon: <Award className="feature-icon" />,
      title: "University-Verified Listings",
      description: "Find secure and university-approved accommodations with our exclusive verification filter."
    },
    {
      icon: <Calendar className="feature-icon" />,
      title: "Schedule Tours On Your Time",
      description: "Schedule virtual or in-person property tours at your convenience with our flexible appointment system."
    },
    {
      icon: <MessageSquare className="feature-icon" />,
      title: "Direct Communication",
      description: "Real-time communication with homeowners through our in-app chat feature for quick responses."
    },
    {
      icon: <FileText className="feature-icon" />,
      title: "Detailed Listings & Reviews",
      description: "Browse comprehensive listings with photos, descriptions, and genuine student reviews."
    },
    {
      icon: <CreditCard className="feature-icon" />,
      title: "Secure Payments & Legal Docs",
      description: "Process payments and access legal documents securely through our platform."
    }
  ];

  return (
    <div id="what-we-do" className="what-we-do-section">
      <div className="section-header">
      <span className="section-tag">Our features</span>
        <h2>What We Do</h2>
        <p>
          Discover how BoardMate makes finding your perfect student accommodation easier, 
          safer, and more reliable than ever before.
        </p>
      </div>

      <div className="features-grid">
        {features.map((feature, index) => (
          <div key={index} className="feature-card">
            <div className="icon-container">
              {feature.icon}
            </div>
            <div className="feature-content">
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
    
  );
};

export default WhatWeDoSection;