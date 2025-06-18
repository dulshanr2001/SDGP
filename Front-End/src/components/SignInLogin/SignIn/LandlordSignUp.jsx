import React, { useState, useEffect } from 'react';
import './LandlordSignUp.css';
import apiService from '../../../services/api-service';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const LandlordSignup = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: '',
    mobile: '',
    email: '',
    idPhoto: null,
    idVerificationStatus: 'pending', // new field for ID verification status
    firstName: '',
    lastName: '',
    dateOfBirth: {
      day: '',
      month: '',
      year: ''
    },
    verificationCode: '', // new field for verification code
  });
  const navigate = useNavigate();
  const [errors, setErrors] = useState({});
  const [rulesAgreed, setRulesAgreed] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationSent, setVerificationSent] = useState(false);
  const [verificationMethod, setVerificationMethod] = useState('email'); // 'email' or 'phone'
  
  // Added rules from original component
  const rules = [
    {
      title: "1. List Accurate Details",
      description: "Provide honest and clear details about the room, including size, amenities, and any rules."
    },
    {
      title: "2. Upload Clear Photos",
      description: "Use high-quality, friendly photos that show the room and common areas accurately."
    },
    {
      title: "3. Set Fair and Transparent Prices",
      description: "List the rental price and any fees upfront to help students budget effectively."
    },
    {
      title: "4. Mention House Rules",
      description: "Clearly share any house rules, such as quiet hours, guest policies, or cleaning expectations."
    },
    {
      title: "5. Keep Availability Updated",
      description: "Regularly update the listing to reflect the current availability of the room."
    },
    {
      title: "6. Describe the Location Clearly",
      description: "Share information about nearby facilities like public transport, stores, or universities."
    },
    {
      title: "7. Be Responsive",
      description: "Respond promptly to inquiries from students to create a positive rental experience."
    },
    {
      title: "8. Avoid Misleading Information",
      description: "Ensure all details in your ad are truthful to avoid misunderstandings."
    },
    {
      title: "9. Contact Support for Any Issues",
      description: "If you have questions or need help with your listing, feel free to reach out to our support team."
    }
  ];

  // Add the missing renderError function
  const renderError = (error) => {
    return error ? <div className="error-message">{error}</div> : null;
  };

  const validateStep = () => {
    const errors = {};
    
    switch (step) {
      case 1:
        if (!rulesAgreed) {
          errors.rules = 'You must agree to the rules and regulations';
        }
        break;
      case 2:
        if (formData.password.length < 4) {
          errors.password = 'Password must contain at least 4 digits';
        }
        if (formData.password !== formData.confirmPassword) {
          errors.confirmPassword = 'Passwords do not match';
        }
        break;
      case 3:
        if (!formData.mobile) errors.mobile = 'Mobile number is required';
        if (!formData.email) {
          errors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
          errors.email = 'Invalid email format';
        }
        if (!formData.idPhoto) errors.idPhoto = 'ID/Passport photo is required';
        break;
      case 4:
        if (!formData.firstName) errors.firstName = 'First name is required';
        if (!formData.lastName) errors.lastName = 'Last name is required';
        if (!formData.dateOfBirth.day || !formData.dateOfBirth.month || !formData.dateOfBirth.year) {
          errors.dateOfBirth = 'Complete date of birth is required';
        }
        break;
      case 5:
        if (!formData.verificationCode || formData.verificationCode.length < 4) {
          errors.verificationCode = 'Valid verification code is required';
        }
        break;
      default:
        break;
    }
    return errors;
  };

  // Handle ID document upload and verification
  const handleIdUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setFormData({...formData, idPhoto: file});
    setIsVerifying(true);

    // Create form data for file upload
    const formDataObj = new FormData();
    formDataObj.append('idDocument', file);

    try {
      // // Call backend API to process the document
      // const response = await fetch('/api/verify/document', {
      //   method: 'POST',
      //   body: formDataObj
      // });

      // const result = await response.json();
      
      // if (result.success) {
      //   // Auto-fill form data from the extracted information
      //   setFormData(prevFormData => ({
      //     ...prevFormData,
      //     firstName: result.firstName || prevFormData.firstName,
      //     lastName: result.lastName || prevFormData.lastName,
      //     dateOfBirth: {
      //       day: result.dateOfBirth?.day || prevFormData.dateOfBirth.day,
      //       month: result.dateOfBirth?.month || prevFormData.dateOfBirth.month,
      //       year: result.dateOfBirth?.year || prevFormData.dateOfBirth.year
      //     },
      //     idVerificationStatus: result.verified ? 'verified' : 'rejected'
      //   }));
      // } else {
      //   setFormData(prevFormData => ({
      //     ...prevFormData,
      //     idVerificationStatus: 'rejected'
      //   }));
      //   setErrors(prev => ({...prev, idVerification: result.message || 'Document verification failed'}));
      // }
              setFormData(prevFormData => ({
          ...prevFormData,
          idVerificationStatus: 'verified'
        }));
    } catch (error) {
      console.error('Error verifying document:', error);
      setErrors(prev => ({...prev, idVerification: 'Error processing document. Please try again.'}));
      setFormData(prevFormData => ({
        ...prevFormData,
        idVerificationStatus: 'error'
      }));
    } finally {
      setIsVerifying(false);
    }
  };

  // Send verification code to email or phone
  const sendVerificationCode = async () => {
    setErrors({});
    const methodErrors = {};
    
    if (verificationMethod === 'email') {
      if (!formData.email) {
        methodErrors.email = 'Email is required for verification';
      } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
        methodErrors.email = 'Invalid email format';
      }
    } else {
      if (!formData.mobile) {
        methodErrors.mobile = 'Mobile number is required for verification';
      }
    }
    
    if (Object.keys(methodErrors).length > 0) {
      setErrors(methodErrors);
      return;
    }
    
    setIsVerifying(true);
    
    try {
      // const response = await fetch('/api/verify/send-code', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({
      //     method: verificationMethod,
      //     email: formData.email,
      //     phone: formData.mobile
      //   })
      // });
      
      // const result = await response.json();
      
      // if (result.success) {
      //   setVerificationSent(true);
      // } else {
      //   setErrors(prev => ({
      //     ...prev, 
      //     verificationSend: result.message || `Failed to send verification code to your ${verificationMethod}`
      //   }));
      // }
        setVerificationSent(true);

    } catch (error) {
      console.error('Error sending verification code:', error);
      setErrors(prev => ({
        ...prev, 
        verificationSend: `Error sending verification code to your ${verificationMethod}`
      }));
    } finally {
      setIsVerifying(false);
    }
  };

  // Verify the code entered by user
  const verifyCode = async () => {
    setErrors({});
    
    if (!formData.verificationCode) {
      setErrors({verificationCode: 'Please enter the verification code'});
      return;
    }
    
    setIsVerifying(true);
    
    try {
      // const response = await fetch('/api/verify/check-code', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({
      //     method: verificationMethod,
      //     contact: verificationMethod === 'email' ? formData.email : formData.mobile,
      //     code: formData.verificationCode
      //   })
      // });
      
      // const result = await response.json();
      
      // if (result.success) {
      //   // Continue to next step or submit if all steps are complete
      //   handleSubmit();
      // } else {
      //   setErrors({verificationCode: result.message || 'Invalid verification code'});
      // }
       // Continue to next step or submit if all steps are complete
       await handleSubmit();
    } catch (error) {
      console.error('Error verifying code:', error);
      setErrors({verificationCode: 'Error verifying code. Please try again.'});
    } finally {
      setIsVerifying(false);
    }
  };

  const handleSubmit = async() => {
    // For regular step navigation
    if (step !== 5) {
      const currentErrors = validateStep();
      setErrors(currentErrors);
      
      if (Object.keys(currentErrors).length === 0) {
        if (step === 3 && formData.idVerificationStatus === 'verified') {
          // If ID is verified, we can skip straight to verification step
          setStep(5);
        } else if (step < 5) {
          setStep(step + 1);
        }
      }
    } else {
      // For final submission
      console.log('Form submitted:', formData);
      // Submit form to backend
      await submitFormData();
    }
  };

  const submitFormData = async () => {
    const userData = {
      email: formData.email,
      password: formData.password,
      firstName: formData.firstName,
      lastName: formData.lastName,
      mobile: formData.mobile,
      dateOfBirthDay: formData.dateOfBirth.day,
      dateOfBirthMonth: formData.dateOfBirth.month,
      dateOfBirthYear: formData.dateOfBirth.year
    };
    console.log("Sending Data:", userData); // ✅ Logs data before sending
  
    try {
      const response = await apiService.post('/auth/register', userData);
      const result = response.data;
      console.log("Response from backend:", result); // ✅ Logs backend response
  
      if (response.status === 200) {
        toast.success('Registration successful!');
        // window.location.href = '/landlord/dashboard';
        navigate('/landlord-login');
      } else {
        setErrors({ submission: result.message || 'Failed to submit registration' });
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      setErrors({ submission: 'Error submitting form. Please try again.' });
    }
  };
  
  

  const renderIdVerificationStatus = () => {
    switch (formData.idVerificationStatus) {
      case 'verified':
        return <div className="verification-success">ID verified successfully!</div>;
      case 'rejected':
        return <div className="verification-error">ID verification failed. Please try another document.</div>;
      case 'error':
        return <div className="verification-error">Error processing document. Please try again.</div>;
      case 'pending':
      default:
        return isVerifying ? 
          <div className="verification-pending">Verifying your document...</div> :
          null;
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="form-section">
            <h2>Rules and Regulations</h2>
            <div className="rules-container">
              {rules.map((rule, index) => (
                <div key={index} className="rule-item">
                  <h3>{rule.title}</h3>
                  <p>{rule.description}</p>
                </div>
              ))}
            </div>
            <div className="checkbox-container">
              <input
                type="checkbox"
                checked={rulesAgreed}
                onChange={(e) => setRulesAgreed(e.target.checked)}
              />
              <span>Agree to Rules and Regulations</span>
            </div>
            {renderError(errors.rules)}
          </div>
        );

      case 2:
        return (
          <div className="form-section">
            <h2>Create Password</h2>
            <div className="input-group">
              <input
                type="password"
                placeholder="Must contain at least 4 digits"
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
              />
              {renderError(errors.password)}
            </div>
            <div className="input-group">
              <input
                type="password"
                placeholder="Confirm password"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
              />
              {renderError(errors.confirmPassword)}
            </div>
          </div>
        );

      case 3:
        return (
          <div className="form-section">
            <h2>Contact Information</h2>
            <div className="input-group">
              <input
                type="tel"
                placeholder="Please enter your mobile number"
                value={formData.mobile}
                onChange={(e) => setFormData({...formData, mobile: e.target.value})}
              />
              {renderError(errors.mobile)}
            </div>
            <div className="input-group">
              <input
                type="email"
                placeholder="Please enter your email address"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
              />
              {renderError(errors.email)}
            </div>
            <div className="input-group">
              <p>Please upload your ID or Passport photo for verification</p>
              <input
                type="file"
                accept="image/*,.pdf"
                onChange={handleIdUpload}
              />
              {renderIdVerificationStatus()}
              {renderError(errors.idPhoto)}
              {renderError(errors.idVerification)}
            </div>
          </div>
        );

      case 4:
        return (
          <div className="form-section">
            <h2>Personal Information</h2>
            <div className="input-group">
              <input
                type="text"
                placeholder="Please enter your first name"
                value={formData.firstName}
                onChange={(e) => setFormData({...formData, firstName: e.target.value})}
              />
              {renderError(errors.firstName)}
            </div>
            <div className="input-group">
              <input
                type="text"
                placeholder="Please enter your last name"
                value={formData.lastName}
                onChange={(e) => setFormData({...formData, lastName: e.target.value})}
              />
              {renderError(errors.lastName)}
            </div>
            <div className="input-group">
              <label>Date of Birth</label>
              <div className="date-inputs">
                <input
                  type="number"
                  placeholder="DD"
                  maxLength="2"
                  value={formData.dateOfBirth.day}
                  onChange={(e) => setFormData({
                    ...formData,
                    dateOfBirth: {...formData.dateOfBirth, day: e.target.value}
                  })}
                  required
                  min={1}
                  max={31}
                />
                <input
                  type="number"
                  placeholder="MM"
                  maxLength="2"
                  value={formData.dateOfBirth.month}
                  onChange={(e) => setFormData({
                    ...formData,
                    dateOfBirth: {...formData.dateOfBirth, month: e.target.value}
                  })}
                  required
                  min={1}
                  max={12}
                />
                <input
                  type="number"
                  placeholder="YYYY"
                  maxLength="4"
                  value={formData.dateOfBirth.year}
                  onChange={(e) => setFormData({
                    ...formData,
                    dateOfBirth: {...formData.dateOfBirth, year: e.target.value}
                  })}
                  required
                  min={1900}
                  max={2005}
                />
              </div>
              {renderError(errors.dateOfBirth)}
            </div>
          </div>
        );

      case 5:
        return (
          <div className="form-section">
            <h2>Verify Your Identity</h2>
            <div className="verification-selection">
              <div className="radio-group">
                <label>
                  <input
                    type="radio"
                    name="verificationMethod"
                    checked={verificationMethod === 'email'}
                    onChange={() => setVerificationMethod('email')}
                  />
                  <span>Email Verification</span>
                </label>
                <label>
                  <input
                    type="radio"
                    name="verificationMethod"
                    checked={verificationMethod === 'phone'}
                    onChange={() => setVerificationMethod('phone')}
                  />
                  <span>SMS Verification</span>
                </label>
              </div>
            </div>
            
            {!verificationSent ? (
              <div className="verification-send">
                <p>We'll send a verification code to your {verificationMethod === 'email' ? 'email address' : 'mobile number'}</p>
                <button 
                  onClick={sendVerificationCode} 
                  className="verification-button"
                  disabled={isVerifying}
                >
                  {isVerifying ? 'Sending...' : 'Send Verification Code'}
                </button>
                {renderError(errors.verificationSend)}
                {renderError(errors.email)}
                {renderError(errors.mobile)}
              </div>
            ) : (
              <div className="input-group verification-code-group">
                <label>Enter the verification code sent to your {verificationMethod === 'email' ? 'email' : 'phone'}</label>
                <input
                  type="text"
                  placeholder="Enter verification code"
                  value={formData.verificationCode}
                  onChange={(e) => setFormData({...formData, verificationCode: e.target.value})}
                />
                {renderError(errors.verificationCode)}
                <button 
                  onClick={() => setVerificationSent(false)} 
                  className="resend-button"
                >
                  Resend Code
                </button>
              </div>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="signup-container">
      <div className="signup-form">
        <div className="progress-tracker">
          {[1, 2, 3, 4, 5].map((stepNumber) => (
            <div key={stepNumber} className={`progress-step ${step >= stepNumber ? 'active' : ''}`}>
              {stepNumber}
            </div>
          ))}
        </div>
        <div className="form-content">
          {renderStep()}
        </div>
        <div className="button-group">
          {step > 1 && (
            <button
              onClick={() => setStep(step - 1)}
              className="back-button"
              disabled={isVerifying}
            >
              Back
            </button>
          )}
          {step < 5 ? (
            <button
              onClick={handleSubmit}
              className="next-button"
              disabled={isVerifying}
            >
              Continue
            </button>
          ) : (
            verificationSent && (
              <button
                onClick={verifyCode}
                className="next-button"
                disabled={isVerifying}
              >
                {isVerifying ? 'Verifying...' : 'Submit'}
              </button>
            )
          )}
        </div>
        {errors.submission && (
          <div className="submission-error">
            {errors.submission}
          </div>
        )}
      </div>
    </div>
  );
};

export default LandlordSignup;