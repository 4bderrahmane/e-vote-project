import {useEffect, useRef} from "react";
import LoadingSpinner from "@components/LoadingSpinner.tsx";
import {keycloak} from "../keycloak.ts";

export default function RegisterRedirect() {
    const started = useRef(false);

    useEffect(() => {
        if (started.current) return;
        started.current = true;

        keycloak.register({
            redirectUri: globalThis.location.origin + "/app",
        });
    }, []);

    return <LoadingSpinner/>;
}
