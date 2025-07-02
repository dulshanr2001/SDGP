import { Outlet } from "react-router-dom";
import Navigationbar from "../components/Navigationbar/Navigationbar";
import Footer from "../components/LandingPage/Footer/Footer";

export function GeneralLayout() {
    return (
        <div>
            <Navigationbar/>
            <div>
                <Outlet/>
            </div>
            <Footer/>
        </div>
    )
}