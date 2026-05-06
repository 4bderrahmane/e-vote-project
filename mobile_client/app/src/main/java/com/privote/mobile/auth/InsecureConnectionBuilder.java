package com.privote.mobile.auth;

import android.net.Uri;

import androidx.annotation.NonNull;

import net.openid.appauth.connectivity.ConnectionBuilder;

import java.io.IOException;
import java.net.HttpURLConnection;
import java.net.URL;

// allows plain-HTTP OIDC traffic against a LAN-hosted dev Keycloak.
// and it should be replaced with DefaultConnectionBuilder once Keycloak is reachable over HTTPS.

public final class InsecureConnectionBuilder implements ConnectionBuilder
{
    public static final InsecureConnectionBuilder INSTANCE = new InsecureConnectionBuilder();

    private static final int CONNECT_TIMEOUT_MS = 15_000;
    private static final int READ_TIMEOUT_MS = 10_000;

    private InsecureConnectionBuilder()
    {
    }

    @NonNull
    @Override
    public HttpURLConnection openConnection(@NonNull Uri uri) throws IOException
    {
        HttpURLConnection conn = (HttpURLConnection) new URL(uri.toString()).openConnection();
        conn.setConnectTimeout(CONNECT_TIMEOUT_MS);
        conn.setReadTimeout(READ_TIMEOUT_MS);
        conn.setInstanceFollowRedirects(false);
        return conn;
    }
}
