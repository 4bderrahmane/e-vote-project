import Keycloak from "keycloak-js";

// JWT payload is Base64URL, not Base64 → atob() needs normalization
function base64UrlToString(input: string) {
    const b64 = input
        .replaceAll("-", "+")
        .replaceAll("_", "/")
        .padEnd(Math.ceil(input.length / 4) * 4, "=");
    return atob(b64);
}

export function logTokenInfo(token?: string, label = "Access Token") {
    if (!token) return;

    console.log(`${label}:`, token);
    console.log("Use as Authorization header:", `Bearer ${token}`);

    try {
        const parts = token.split(".");
        if (parts.length !== 3) return;
        const payload = JSON.parse(base64UrlToString(parts[1]));
        const expIso = payload?.exp ? new Date(payload.exp * 1000).toISOString() : "n/a";

        console.log("Token details:", {
            sub: payload?.sub,
            aud: payload?.aud,
            azp: payload?.azp,
            exp: expIso,
            realm_roles: payload?.realm_access?.roles,
            resource_access: payload?.resource_access,
        });
    } catch (e) {
        console.warn("Failed to decode token payload", e);
    }
}

export function attachDevTokenLogger(keycloak: Keycloak) {
    keycloak.onAuthSuccess = () => logTokenInfo(keycloak.token, "Access Token");
    keycloak.onAuthRefreshSuccess = () => logTokenInfo(keycloak.token, "Access Token (refreshed)");
}
