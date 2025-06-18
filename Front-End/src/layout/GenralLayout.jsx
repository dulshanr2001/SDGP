import { Outlet } from "react-router-dom";
import Navigationbar from "../components/Navigationbar/Navigationbar";

export function GeneralLayout() {
    return (
        <div>
            <Navigationbar/>
            <div>
                <Outlet/>
            </div>
        </div>
    )
}