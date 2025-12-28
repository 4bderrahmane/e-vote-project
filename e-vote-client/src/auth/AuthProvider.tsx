import React, { useEffect, useMemo, useReducer, useRef } from "react";
import { keycloak } from "./keycloak";
import { attachDevTokenLogger, logTokenInfo } from "./devTokenDEBUG";
import { buildUserFromToken } from "./utils";
import type { Action, AuthContextValue, AuthState } from "./types";
import { AuthContext } from "./AuthContext";

function reducer(state: AuthState, a: Action): AuthState {
    switch (a.type) {
        case "CHECKING":
            return { status: "checking" };
        case "ANON":
            return { status: "anonymous" };
        case "AUTH":
            return { status: "authenticated", token: a.token, user: a.user };
        case "ERROR":
            return { status: "error", error: a.error };
        default:
            return state;
    }
}

export function AuthProvider({ children }: Readonly<{ children: React.ReactNode }>) {
    const [state, dispatch] = useReducer(reducer, { status: "checking" });
    const initOnce = useRef(false);

    useEffect(() => {
        if (initOnce.current) return;
        initOnce.current = true;

        dispatch({ type: "CHECKING" });

        if (import.meta.env.DEV) {
            attachDevTokenLogger(keycloak);
        }

        keycloak.onTokenExpired = () => {
            keycloak.updateToken(30).catch(() => dispatch({ type: "ANON" }));
        };

        keycloak.onAuthLogout = () => dispatch({ type: "ANON" });

        keycloak
            .init({
                onLoad: "check-sso",
                pkceMethod: "S256",
                checkLoginIframe: false,
                enableLogging: import.meta.env.DEV, // dev only
            })
            .then((authenticated) => {
                if (!authenticated) return dispatch({ type: "ANON" });

                const token = keycloak.token;
                const user = buildUserFromToken(keycloak.tokenParsed);

                if (!token || !user) {
                    return dispatch({ type: "ERROR", error: "Authenticated but token/user missing" });
                }

                if (import.meta.env.DEV) logTokenInfo(token, "Access Token");
                dispatch({ type: "AUTH", token, user });
            })
            .catch((e) => dispatch({ type: "ERROR", error: String(e) }));

        // Refresh loop (keep it if you want “always fresh” sessions)
        const interval = setInterval(() => {
            if (!keycloak.authenticated) return;

            keycloak
                .updateToken(30)
                .then((refreshed) => {
                    if (!refreshed) return;
                    const token = keycloak.token;
                    const user = buildUserFromToken(keycloak.tokenParsed);
                    if (token && user) dispatch({ type: "AUTH", token, user });
                })
                .catch(() => dispatch({ type: "ANON" }));
        }, 10_000);

        return () => {
            clearInterval(interval);

            // optional cleanup
            keycloak.onTokenExpired = undefined;
            keycloak.onAuthLogout = undefined;
        };
    }, []);

    const value = useMemo<AuthContextValue>(() => {
        return {
            ...state,
            login: async (redirectUri) =>
                keycloak.login({ redirectUri: redirectUri ?? globalThis.location.href }),
            register: async (redirectUri) =>
                keycloak.register({ redirectUri: redirectUri ?? globalThis.location.href }),
            logout: async (redirectUri) =>
                keycloak.logout({ redirectUri: redirectUri ?? globalThis.location.origin + "/" }),
            getValidToken: async (minValiditySeconds = 30) => {
                if (!keycloak.authenticated) throw new Error("Not authenticated");
                await keycloak.updateToken(minValiditySeconds);
                if (!keycloak.token) throw new Error("Token missing");
                return keycloak.token;
            },
        };
    }, [state]);

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
