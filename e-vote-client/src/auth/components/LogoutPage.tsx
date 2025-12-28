import { useEffect } from "react";
import { keycloak } from "../keycloak.ts";
import LoadingSpinner from "@components/LoadingSpinner.tsx";

export default function LogoutPage() {
    useEffect(() => {
        keycloak.logout({ redirectUri: globalThis.location.origin + "/" });
    }, []);

    return <LoadingSpinner />;
}
