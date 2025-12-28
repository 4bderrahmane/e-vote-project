// import {createContext, useContext, useState, useEffect, type ReactNode} from "react";
// import Keycloak from "keycloak-js";
// import type {AuthContextType} from "../types/api.types.ts";
//
// const AuthContext = createContext<AuthContextType | undefined>(undefined);
//
// // Initialize Keycloak outside component to prevent re-initialization
// const keycloak = new Keycloak({
//     url: "http://localhost:8080/",
//     realm: "your-realm",
//     clientId: "your-react-client",
// });
//
// export const AuthProvider = ({children}: { children: ReactNode }) => {
//     const [isAuthenticated, setIsAuthenticated] = useState(false);
//     const [userProfile, setUserProfile] = useState<Keycloak.KeycloakProfile | undefined>();
//
//     useEffect(() => {
//         // init options: onLoad: 'check-sso' allows silent login if cookie exists
//         keycloak.init({onLoad: "check-sso"}).then((authenticated) => {
//             setIsAuthenticated(authenticated);
//             if (authenticated) {
//                 // OPTION 1: Fetch basic data from Keycloak directly
//                 keycloak.loadUserProfile().then((profile) => {
//                     setUserProfile(profile);
//                 });
//             }
//         });
//     }, []);
//
//     const login = () => {
//         // Crucial: Redirect to Dashboard after login
//         keycloak.login({redirectUri: window.location.origin + "/dashboard"});
//     };
//
//     const logout = () => {
//         keycloak.logout({redirectUri: window.location.origin});
//     };
//
//     return (
//         <AuthContext.Provider
//             value={{isAuthenticated, token: keycloak.token, userProfile, login, logout}}
//         >
//             {children}
//         </AuthContext.Provider>
//     );
// };
//
// export const useAuth = () => {
//     const context = useContext(AuthContext);
//     if (!context) throw new Error("useAuth must be used within an AuthProvider");
//     return context;
// };
// src/auth/AuthProvider.tsx
import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import type Keycloak from "keycloak-js";
import { keycloak } from "../../../auth/keycloak.ts"

type AuthContextType = {
    keycloak: Keycloak;
    initialized: boolean;
    authenticated: boolean;
    profile?: any;
    login: () => void;
    logout: () => void;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [initialized, setInitialized] = useState(false);
    const [authenticated, setAuthenticated] = useState(false);
    const [profile, setProfile] = useState<any>(undefined);

    useEffect(() => {
        let cancelled = false;

        (async () => {
            const ok = await keycloak.init({
                onLoad: "check-sso",          // or "login-required" if you want auto-login
                pkceMethod: "S256",
                checkLoginIframe: false,
            });

            if (cancelled) return;

            setInitialized(true);
            setAuthenticated(ok);

            // Option A: basic user info directly from token
            // console.log(keycloak.tokenParsed);

            // Option B: load profile from Keycloak (requires "profile" scope typically)
            if (ok) {
                const p = await keycloak.loadUserProfile();
                if (!cancelled) setProfile(p);
            }

            // Keep token fresh (for API calls)
            setInterval(() => {
                keycloak.updateToken(30).catch(() => {
                    // refresh failed => token expired
                    setAuthenticated(false);
                });
            }, 10_000);
        })();

        return () => {
            cancelled = true;
        };
    }, []);

    const value = useMemo<AuthContextType>(() => ({
        keycloak,
        initialized,
        authenticated,
        profile,
        login: () => keycloak.login(),
        logout: () => keycloak.logout({ redirectUri: window.location.origin }),
    }), [initialized, authenticated, profile]);

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
    return ctx;
}
