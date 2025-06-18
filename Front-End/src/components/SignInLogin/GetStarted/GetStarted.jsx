import { useNavigate } from 'react-router-dom';
import './GetStarted.css';

const GetStarted = () => {
  const navigate = useNavigate();

  return (
    <div className="get-started-container">
      <img src="/bmlogo.png" alt="Home Icon" className="home-icon" onClick={() => navigate('/')} />

      <div className="content-box">
        <h1>Let's<br />Get Started</h1>
        <p>Firstly, Choose a type of login account</p>
        <h2>Are you...</h2>
        <div className="buttons-container">
          <button 
            className="option-button"
            onClick={() => navigate('/student-signin')}
          >
            A student looking for a place?
          </button>
          <button 
            className="option-button"
            onClick={() => navigate('/landlord-signin')}
          >
            A landlord looking to rent a place?
          </button>
        </div>
        
        <div className="login-section">
          <p className="login-text">Already have an account?</p>
          <div className="login-buttons">
            <button 
              className="login-option-button"
              onClick={() => navigate('/student-login')}
            >
              Login as Student
            </button>
            <button 
              className="login-option-button"
              onClick={() => navigate('/landlord-login')}
            >
              Login as Landlord
            </button>
          </div>
          <div className="parent-login-container">
            <button 
              className="login-option-button parent-login-button"
              onClick={() => navigate('/parent-login')}
            >
              Login as Parent
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GetStarted;