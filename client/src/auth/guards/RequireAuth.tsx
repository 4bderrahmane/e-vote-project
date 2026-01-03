import {useEffect, useRef} from "react";
import {Outlet, useLocation} from "react-router-dom";
import {useAuth} from "../useAuth";
import LoadingSpinner from "../../shared/components/LoadingSpinner";

export default function RequireAuth() {
    const {status, login} = useAuth();
    const location = useLocation();
    const started = useRef(false);

    useEffect(() => {
        if (status !== "anonymous") return;
        if (started.current) return;
        started.current = true;

        const redirectUri = globalThis.location.origin + location.pathname + location.search + location.hash;

        login(redirectUri);
    }, [status, login, location]);

    if (status !== "authenticated") return <LoadingSpinner/>;
    return <Outlet/>;
}