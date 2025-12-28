import {useEffect, useRef} from "react";
import LoadingSpinner from "@components/LoadingSpinner.tsx";
import {keycloak} from "@/auth/keycloak.ts";

export default function LoginRedirect() {
    const started = useRef(false);

    useEffect(() => {
        if (started.current) return;
        started.current = true;

        keycloak.login({
            redirectUri: globalThis.location.origin + "/dashboard",
        });
    }, []);

    return <LoadingSpinner/>;
}
