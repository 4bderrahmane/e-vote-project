import Keycloak from "keycloak-js";

export const keycloak = new Keycloak({
    url: import.meta.env.VITE_KEYCLOAK_URL ?? "http://localhost:8080",
    realm: import.meta.env.VITE_KEYCLOAK_REALM ?? "voting-realm",
    clientId: import.meta.env.VITE_KEYCLOAK_CLIENT ?? "voting-frontend",
});
