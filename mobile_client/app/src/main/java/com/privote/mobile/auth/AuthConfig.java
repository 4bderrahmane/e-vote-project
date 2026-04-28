package com.privote.mobile.auth;

public final class AuthConfig
{
    public static final String KEYCLOAK_BASE_URL = "http://localhost:8080";
    public static final String REALM = "voting-realm";
    public static final String CLIENT_ID = "privote-mobile";
    public static final String API_BASE_URL = "http://10.0.2.2:8081/"; // emulator → host; change for real device
    public static final String ISSUER_URI = KEYCLOAK_BASE_URL + "/realms/" + REALM;
    public static final String REDIRECT_URI = "com.privote.mobile://callback";

    private AuthConfig()
    {
    }
}