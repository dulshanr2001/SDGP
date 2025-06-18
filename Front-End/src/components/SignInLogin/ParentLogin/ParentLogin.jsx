// components/SignIn/ParentLogin.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './ParentLogin.css';

const ParentLogin = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    studentId: '',
    password: '',
    relation: 'parent' // Default relation
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    // Add authentication logic here
    console.log('Parent login:', formData);
    // Navigate to student profile or payment page after successful login
    // navigate('/student-profile');
  };

  return (
    <div className="signin-container parent-signin-container">
      <img 
        src="/bmlogo.png" 
        alt="Home Icon" 
        className="home-icon" 
        onClick={() => navigate('/')}
      />

      <div className="signin-content-box">
        <h1>Parent Login</h1>
        <form onSubmit={handleSubmit} className="signin-form">
          <div className="form-group">
            <label htmlFor="studentId">Student ID</label>
            <input
              type="text"
              id="studentId"
              value={formData.studentId}
              onChange={(e) => setFormData({...formData, studentId: e.target.value})}
              placeholder="Enter your child's student ID"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              placeholder="Enter your child's password"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="relation">Your Relation to Student</label>
            <select
              id="relation"
              className="select-input"
              value={formData.relation}
              onChange={(e) => setFormData({...formData, relation: e.target.value})}
              required
            >
              <option value="parent">Parent</option>
              <option value="guardian">Legal Guardian</option>
              <option value="other">Other Family Member</option>
            </select>
          </div>
          <button type="submit" className="signin-button">Access Student Account</button>
        </form>
        <div className="additional-options">
          <p>Are you a student? <span onClick={() => navigate('/student-login')}>Student Login</span></p>
          <p>Are you a landlord? <span onClick={() => navigate('/landlord-login')}>Landlord Login</span></p>
        </div>
      </div>
    </div>
  );
};

export default ParentLogin;