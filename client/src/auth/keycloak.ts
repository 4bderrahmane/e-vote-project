import Keycloak from "keycloak-js";

export const keycloak = new Keycloak({
    url: import.meta.env.VITE_KEYCLOAK_URL ?? "http://localhost:8080",
    realm: import.meta.env.VITE_KEYCLOAK_REALM ?? "privote",
    clientId: import.meta.env.VITE_KEYCLOAK_CLIENT ?? "privote-frontend",
});

export async function getToken(minValiditySeconds = 30): Promise<string | undefined> {
    if (!keycloak.authenticated) return undefined;
    await keycloak.updateToken(minValiditySeconds);
    return keycloak.token;
}
