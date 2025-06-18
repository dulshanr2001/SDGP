import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import apiService from "../../../../services/api-service";
import EmailPasswordSignIn from "../common/EmailPasswordSignIn";
import "../SignIn2.css";
import StudentBasicDetails from "./StudentBasicDetails";
import UniversitySignIn from "./UniversitySignIn";

const StudentSignIn = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [regData, setRegData] = useState({
    firstName: "",
    surname: "",
    dob: { day: "", month: "", year: "" },
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleRegister = async() => {
    console.log(regData);
    const rq = {
      email: regData.email,
      password: regData.password,
      firstName: regData.firstName,
      lastName: regData.surname,
      mobile: "",
      dateOfBirthDay: regData.dob.day,
      dateOfBirthMonth: regData.dob.month,
      dateOfBirthYear: regData.dob.year,
      university: regData.university,
      studentId: regData.studentId,
    };
    
    const response = await apiService.post("/auth/register", rq);
    toast.success(response.data.message);
    // console.log(response);
    navigate('/student-login');
  };

  const handleBasicDetailsSubmit = (data) => {
    setRegData({
      ...regData,
      firstName: data.firstName,
      surname: data.surname,
      dob: data.dob,
    });
    setStep(2);
  };

  const handleUniversitySignIn = (data) => {
    setRegData({
      ...regData,
      university: data.university,
      studentId: data.studentId,
    });
    setStep(3);
  };

  const handleEmailPasswordSubmit = async(data) => {
    setRegData({
      ...regData,
      email: data.email,
      password: data.password,
      confirmPassword: data.confirmPassword,
    });
    await handleRegister();
  }

  const showForm = () => {
    console.log(step);
    switch (step) {
      case 1:
        return <StudentBasicDetails handleSubmitData={handleBasicDetailsSubmit} />;
      case 2:
        return <UniversitySignIn handleSubmitData={handleUniversitySignIn} />;
      case 3:
        return <EmailPasswordSignIn handleSubmitData={handleEmailPasswordSubmit} />;
      default:
        return <StudentBasicDetails handleSubmitData={handleBasicDetailsSubmit} />;
    }
  }

  return (
    <div className="signin-container">
      <img src="/bmlogo.png" alt="Home Icon" className="home-icon" onClick={() => navigate("/")} />

      {showForm()}
    </div>
  );
};

export default StudentSignIn;