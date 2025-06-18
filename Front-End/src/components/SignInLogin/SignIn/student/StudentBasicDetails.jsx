import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function StudentBasicDetails({ handleSubmitData }) {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    firstName: "",
    surname: "",
    dob: { day: "", month: "", year: "" },
  });

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
  };


  const handleSubmit = (e) => {
    e.preventDefault();
    handleSubmitData(formData);
  };
  
  return (
    <div className="signin-content-box">
      <h1>Student Sign up</h1>
      <form className="signin-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="firstName">First Name</label>
          <input
            type="text"
            id="firstName"
            placeholder="First name"
            value={formData.firstName}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="surname">Last Name</label>
          <input
            type="text"
            id="surname"
            placeholder="Last name"
            value={formData.surname}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group dob-group">
          <label>Date of birth</label>
          <div className="dob-fields">
            <input
              type="number"
              placeholder="DD"
              maxLength="2"
              onChange={(e) => setFormData({ ...formData, dob: { ...formData.dob, day: e.target.value } })}
              required
              min={1}
              max={31}
            />
            <input
              type="number"
              placeholder="MM"
              maxLength="2"
              onChange={(e) => setFormData({ ...formData, dob: { ...formData.dob, month: e.target.value } })}
              required
              min={1}
              max={12}
            />
            <input
              type="number"
              placeholder="YYYY"
              maxLength="4"
              minLength={4}
              onChange={(e) => setFormData({ ...formData, dob: { ...formData.dob, year: e.target.value } })}
              required
              min={1900}
            />
          </div>
        </div>
        <button type="submit" className="signin-button">
          Continue
        </button>
      </form>
      <div className="additional-options">
        <p>
          Already have an account? <span onClick={() => navigate("/student-login")}>Log in</span>
        </p>
      </div>
    </div>
  );
}