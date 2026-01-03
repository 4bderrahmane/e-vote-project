import type {ReactNode} from "react";
import {Navigate} from "react-router-dom";
import {keycloak} from "../auth/keycloak";

interface ProtectedRouteProps {
    children: ReactNode;
}

const ProtectedRoute = ({children}: ProtectedRouteProps) => {
    if (!keycloak.authenticated) {
        return <Navigate to="/" replace/>;
    }
    return <>{children}</>;
};

export default ProtectedRoute;