import { useNavigate } from "react-router-dom";
import "./Navigationbar.css";
import useAuthStore from "../../store/auth-store";
import { useLoaderStore } from "../../store/use-loader-store";
import { toast } from "react-toastify";

function Navigationbar() {
  const navigate = useNavigate();
  const authStore = useAuthStore();
  const loader = useLoaderStore();
  const user = authStore.user;

  const handleLogout = async () => {
    loader.setLoading(true);
    setTimeout(() => {
      try {
        authStore.logout();
        navigate("/");
      } catch (error) {
        toast.error("Failed to log out");
        console.error("Error logging out:", error);
      } finally {
        loader.setLoading(false);
      }
    }, 1000);
  };

  return (
    <nav className="navbar">
      <div className="w-[80rem] flex justify-between items-center">
        <div className="logo">
          <img src="/bmlogo.png" alt="BoardMate Logo" className="logo-image" />
        </div>
        <div className="nav-links">
          {user && user.userType == "LANDLORD" && (
            <>
              <a href="#" onClick={() => navigate("/landlord-dashboard")}>
                Dashboard
              </a>
            </>
          )}
          {user && user.userType == "STUDENT" && (
            <>
              <a href="#" onClick={() => navigate("/home")}>
                Home
              </a>
              <a href="#" onClick={() => navigate("/map")}>
                Map
              </a>

              <a href="#" onClick={() => navigate("/support")}>
                Support
              </a>

              <a href="#" onClick={() => navigate("/about")}>
                About
              </a>
            </>
          )}
          <a href="#" onClick={() => navigate("/chats")}>
            Chat
          </a>
          {user && (
            <>
              <a href="#" onClick={() => navigate("/profile")}>
                Profile
              </a>
              <a href="#" onClick={handleLogout}>
                Log Out
              </a>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navigationbar;