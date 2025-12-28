import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../useAuth";

export default function PublicOnly() {
    const { status } = useAuth();
    if (status === "checking") return null;
    return status === "authenticated" ? <Navigate to="/dashboard" replace /> : <Outlet />;
}
