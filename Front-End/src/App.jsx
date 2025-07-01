import { Navigate, Outlet, Route, Routes, useLocation, useNavigate } from "react-router-dom";
import "./App.css";
import AboutUs from "./components/LandingPage/AboutUs/AboutUs.jsx";
import Footer from "./components/LandingPage/Footer/Footer.jsx";
import HowItWorksSection from "./components/LandingPage/HowItWorks/HowItWorks.jsx";
import LandingPage from "./components/LandingPage/LandingPage.jsx";
import PopularHomes from "./components/LandingPage/PopularHomes/PopularHomes.jsx";
import WhatWeDO from "./components/LandingPage/WeDo/WhatWeDo.jsx";

// Import the GetStarted component
import GetStarted from "./components/SignInLogin/GetStarted/GetStarted.jsx";

// Import login/signin components
import LandlordLogin from "./components/SignInLogin/Login/LandlordLogin.jsx";
import StudentLogin from "./components/SignInLogin/Login/StudentLogin.jsx";
import LandlordSignup from "./components/SignInLogin/SignIn/LandlordSignUp";
import StudentSignIn from "./components/SignInLogin/SignIn/student/StudentSignIn.jsx";

import About from "./components/About/About";
import ChatPage from "./components/Chatapp/ChatPage.jsx";
import ChatBot from "./components/ChatBot/ChatBot.jsx";
import Home from "./components/Home/Home";
import Map from "./components/Map/Map";
import Payments from "./components/Payments/Payments";
import StudentProfile from "./components/Profile/StudentProfile";
import PropertyDetails from "./components/Property/PropertyDetails";
import SearchResults from "./components/Property/SearchResults";
import Support from "./components/Support/Support.jsx";
import TC from "./components/T&C/TC";
import { GeneralLayout } from "./layout/GenralLayout.jsx";

// Import Loader component
import { useEffect } from "react";
import { ToastContainer } from "react-toastify";
import LandlordDashboard from "./components/LandlordDashboard/LandlordDashboard.jsx";
import Loader from "./components/Loader/Loader.jsx";
import LandlordProfile from "./components/Profile/LandloardProfile.jsx";
import useAuthStore from "./store/auth-store.js";

// Protected route component for authenticated users
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuthStore();
  const navigate = useNavigate();

  if (!isAuthenticated) {
    return <Navigate to="/get-started" replace />;
  }

  return children;
};

// Protected route for student users
const StudentRoute = ({ children }) => {
  const { isAuthenticated, user } = useAuthStore();

  if (!isAuthenticated) {
    return <Navigate to="/get-started" replace />;
  }

  if (user?.userType !== "STUDENT") {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

// Protected route for landlord users
const LandlordRoute = ({ children }) => {
  const { isAuthenticated, user } = useAuthStore();

  if (!isAuthenticated) {
    return <Navigate to="/get-started" replace />;
  }

  if (user?.userType !== "LANDLORD") {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

function LandingPageFlow({ userType, isAuthenticated }) {
  const navigate = useNavigate();

  

  // Redirect authenticated users to their appropriate dashboard
  useEffect(() => {
    if (isAuthenticated) {
      if (userType === "STUDENT") {
        navigate("/home");
      } else if (userType === "LANDLORD") {
        navigate("/landlord-dashboard");
      }
    }
  }, [isAuthenticated, userType, navigate]);

  return (
    <div className="app">
      <LandingPage onGetStarted={() => navigate("/get-started")} />
      <PopularHomes />
      <WhatWeDO />
      <HowItWorksSection />
      <AboutUs />
      <Footer />
    </div>
  );
}

function App() {
  const location = useLocation();
  const isLandingPage = location.pathname === "/";
  const authStore = useAuthStore();
  const userType = authStore.user ? authStore.user.userType : null;
  const isAuthenticated = authStore.isAuthenticated;

  return (
    <>
      {isLandingPage ? (
        <LandingPageFlow userType={userType} isAuthenticated={isAuthenticated}/>
      ) : (
        <>
          <Routes>
            {/* Public routes - authentication related */}
            <Route path="/get-started" element={<GetStarted />} />
            <Route path="/student-signin" element={<StudentSignIn />} />
            <Route path="/student-login" element={<StudentLogin />} />
            <Route path="/landlord-signin" element={<LandlordSignup />} />
            <Route path="/landlord-login" element={<LandlordLogin />} />
            <Route path="/unauthorized" element={<div>You are not authorized to view this page</div>} />
            <Route path="" element={<GeneralLayout />}>
               <Route path="Support" element={<Support />} />
             </Route>

            {/* Protected routes inside layout */}
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <GeneralLayout />
                </ProtectedRoute>
              }
            >
              {/* Student specific routes */}
              <Route
                path=""
                element={
                  <StudentRoute>
                    <Outlet />
                  </StudentRoute>
                }
              >
                <Route path="home" element={<Home />} />
                <Route path="Map" element={<Map />} />
                <Route path="search" element={<SearchResults />} />
                <Route path="property/:id/payments" element={<Payments />} />
              </Route>

              <Route
                path=""
                element={
                  <LandlordRoute>
                    <Outlet />
                  </LandlordRoute>
                }
              >
                {/* Landlord specific routes */}
                <Route path="landlord-dashboard" element={<LandlordDashboard />} />

              </Route>

              {/* Common routes - for all authenticated users */}
              <Route path="property/:id" element={<PropertyDetails />} />
              <Route path="profile" element={(userType && userType == "STUDENT") ? (<StudentProfile />) : (<LandlordProfile />)} />
              <Route path="about" element={<About />} />
              <Route path="TC" element={<TC />} />
              <Route path="chats" element={<ChatPage />} />
              <Route path="chats/:chatId" element={<ChatPage />} />
            </Route>
          </Routes>
        </>
      )}
      {userType != "LANDLORD" && <ChatBot />}
      {/* Add Loader component */}
      <Loader />
      <ToastContainer />
    </>
  );
}

export default App;