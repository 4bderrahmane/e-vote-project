import { Outlet } from "react-router-dom";
import Navbar from "../components/NavBar.tsx";

export default function DashboardLayout() {
    return (
        <div className="dashboard-container">
            <div className="main-content">
                <Navbar />
                <Outlet />
            </div>
        </div>
    );
}