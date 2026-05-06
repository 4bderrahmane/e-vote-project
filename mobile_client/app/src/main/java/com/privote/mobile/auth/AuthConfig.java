package com.privote.mobile.auth;

public final class AuthConfig
{
    // USB debugging mode: `adb reverse tcp:8080 tcp:8080` forwards phone localhost to the host.
    // LAN WiFi mode: use http://192.168.11.198:8080
    public static final String KEYCLOAK_BASE_URL = "http://127.0.0.1:8080";
    public static final String REALM = "voting-realm";
    public static final String CLIENT_ID = "voting-mobile";
    // USB debugging mode: `adb reverse tcp:9090 tcp:9090` forwards phone localhost to the host.
    // LAN WiFi mode: use http://192.168.11.198:9090/
    public static final String API_BASE_URL = "http://127.0.0.1:9090/";
    // USB debugging mode: `adb reverse tcp:4010 tcp:4010` forwards phone localhost to the host.
    // LAN WiFi mode: use http://192.168.11.198:4010/
    public static final String PROOF_SERVICE_BASE_URL = "http://127.0.0.1:4010/";
    public static final String ISSUER_URI = KEYCLOAK_BASE_URL + "/realms/" + REALM;
    public static final String TOKEN_ENDPOINT = ISSUER_URI + "/protocol/openid-connect/token";
    public static final String REDIRECT_URI = "com.privote.mobile://callback";

    private AuthConfig() {}
}
