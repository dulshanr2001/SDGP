import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const UniversitySignIn = ({ handleSubmitData }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    university: '',
    studentId: ''
  });

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleSubmitData(formData);
  };

  return (
    <div className="signin-container">
      <img 
        src="/bmlogo.png" 
        alt="Home Icon" 
        className="home-icon" 
        onClick={() => navigate('/')}
      />

      <div className="signin-content-box">
        <h1>Sign in</h1>
        <form className="signin-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="university">Select your University/Institute</label>
            <select
              id="university"
              value={formData.university}
              onChange={handleChange}
              required
              className="select-input"
            >
              <option value="" disabled>Select one</option>
              <option value="uni1">Informatics Institute of Technology</option>
              <option value="uni2">uni2</option>
              <option value="uni3">uni3</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="studentId">University ID/Number</label>
            <input
              type="text"
              id="studentId"
              placeholder="Please enter your student ID number"
              value={formData.studentId}
              onChange={handleChange}
              required
            />
          </div>

          <button type="submit" className="signin-button">Continue</button>
        </form>

        <div className="additional-options">
        <p>Already have an account? <span onClick={() => navigate('/student-login')}>Log in</span></p>        </div>
      </div>
    </div>
  );
};

export default UniversitySignIn;