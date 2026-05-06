package com.privote.mobile.auth;

import android.app.Activity;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.net.Uri;
import android.os.Build;
import android.util.Base64;

import androidx.security.crypto.EncryptedSharedPreferences;
import androidx.security.crypto.MasterKeys;

import net.openid.appauth.AppAuthConfiguration;
import net.openid.appauth.AuthorizationException;
import net.openid.appauth.AuthorizationRequest;
import net.openid.appauth.AuthorizationResponse;
import net.openid.appauth.AuthorizationService;
import net.openid.appauth.AuthorizationServiceConfiguration;
import net.openid.appauth.EndSessionRequest;
import net.openid.appauth.EndSessionResponse;
import net.openid.appauth.ResponseTypeValues;
import net.openid.appauth.TokenResponse;

import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.URLEncoder;
import java.security.GeneralSecurityException;
import java.nio.charset.StandardCharsets;
import java.util.Objects;

import org.json.JSONException;
import org.json.JSONArray;
import org.json.JSONObject;

public class AuthManager
{
    public enum AppRole
    {
        CITIZEN,
        ADMIN
    }

    public interface AuthCallback
    {
        void onSuccess();
        void onError(String message);
    }

    private static final String PREF_FILE = "auth_prefs";
    private static final String KEY_ACCESS_TOKEN = "access_token";
    private static final String KEY_REFRESH_TOKEN = "refresh_token";
    private static final String KEY_ID_TOKEN = "id_token";
    private static final String KEY_ACCESS_TOKEN_EXPIRES_AT = "access_token_expires_at";
    private static final String KEY_ACTIVE_ROLE = "active_role";
    private static final long TOKEN_EXPIRY_SKEW_MS = 30_000;
    private static AuthManager instance;
    private final AuthorizationService authService;
    private final SharedPreferences securePrefs;

    private AuthManager(Context ctx)
    {
        AppAuthConfiguration appAuthConfig = new AppAuthConfiguration.Builder()
                .setConnectionBuilder(InsecureConnectionBuilder.INSTANCE)
                .setSkipIssuerHttpsCheck(true)
                .build();
        authService = new AuthorizationService(ctx.getApplicationContext(), appAuthConfig);
        securePrefs = buildSecurePrefs(ctx.getApplicationContext());
    }

    public static synchronized AuthManager getInstance(Context ctx)
    {
        if (instance == null)
            instance = new AuthManager(ctx);
        return instance;
    }

    public void startLoginFlow(Activity activity, int requestCode, AuthCallback callback)
    {
        try
        {
            AuthorizationServiceConfiguration.fetchFromIssuer(
                    Uri.parse(AuthConfig.ISSUER_URI),
                    (config, ex) ->
                    {
                        if (config == null)
                        {
                            String msg = ex != null ? ex.getMessage() : "Failed to load OpenID configuration";
                            callback.onError(msg);
                            return;
                        }

                        AuthorizationRequest request = new AuthorizationRequest.Builder(
                                config,
                                AuthConfig.CLIENT_ID,
                                ResponseTypeValues.CODE,
                                Uri.parse(AuthConfig.REDIRECT_URI)
                        ).setScope("openid profile email").build();

                        Intent authIntent = authService.getAuthorizationRequestIntent(request);
                        activity.runOnUiThread(() ->
                        {
                            try
                            {
                                activity.startActivityForResult(authIntent, requestCode);
                            } catch (Exception startException)
                            {
                                callback.onError("Unable to launch browser for login: " + startException.getMessage());
                            }
                        });
                    },
                    InsecureConnectionBuilder.INSTANCE
            );
        } catch (Exception e)
        {
            callback.onError("Failed to start login: " + e.getMessage());
        }
    }

    public void handleAuthorizationResponse(Intent data, AuthCallback callback)
    {
        AuthorizationResponse response = AuthorizationResponse.fromIntent(data);
        AuthorizationException exception = AuthorizationException.fromIntent(data);

        if (response == null)
        {
            String msg = exception != null ? exception.getMessage() : "Authorization cancelled";
            callback.onError(msg);
            return;
        }

        authService.performTokenRequest(
                response.createTokenExchangeRequest(),
                (tokenResponse, tokenException) ->
                {
                    if (tokenResponse != null)
                    {
                        persistTokens(tokenResponse);
                        callback.onSuccess();
                    } else
                    {
                        String msg = tokenException != null ? tokenException.getMessage() : "Token exchange failed";
                        callback.onError(msg);
                    }
                }
        );
    }

    public void startLogoutFlow(Activity activity, int requestCode, AuthCallback callback)
    {
        String idToken = securePrefs.getString(KEY_ID_TOKEN, null);
        if (idToken == null)
        {
            logout();
            callback.onSuccess();
            return;
        }

        try
        {
            AuthorizationServiceConfiguration.fetchFromIssuer(
                    Uri.parse(AuthConfig.ISSUER_URI),
                    (config, ex) ->
                    {
                        if (config == null)
                        {
                            String msg = ex != null ? ex.getMessage() : "Failed to load OpenID configuration";
                            callback.onError(msg);
                            return;
                        }

                        if (config.endSessionEndpoint == null)
                        {
                            callback.onError("Keycloak did not provide an end-session endpoint");
                            return;
                        }

                        EndSessionRequest request = new EndSessionRequest.Builder(config)
                                .setIdTokenHint(idToken)
                                .setPostLogoutRedirectUri(Uri.parse(AuthConfig.REDIRECT_URI))
                                .build();

                        Intent logoutIntent = authService.getEndSessionRequestIntent(request);
                        activity.runOnUiThread(() ->
                        {
                            try
                            {
                                activity.startActivityForResult(logoutIntent, requestCode);
                            } catch (Exception startException)
                            {
                                callback.onError("Unable to launch browser for logout: " + startException.getMessage());
                            }
                        });
                    },
                    InsecureConnectionBuilder.INSTANCE
            );
        } catch (Exception e)
        {
            callback.onError("Failed to start logout: " + e.getMessage());
        }
    }

    public void handleLogoutResponse(Intent data, AuthCallback callback)
    {
        if (data == null)
        {
            callback.onError("Logout cancelled");
            return;
        }

        AuthorizationException exception = AuthorizationException.fromIntent(data);
        if (exception != null)
        {
            callback.onError(exception.getMessage());
            return;
        }

        EndSessionResponse response = EndSessionResponse.fromIntent(data);
        if (response == null)
        {
            callback.onError("Logout did not complete");
            return;
        }

        logout();
        callback.onSuccess();
    }

    public String getAccessToken()
    {
        return securePrefs.getString(KEY_ACCESS_TOKEN, null);
    }

    public synchronized String getValidAccessToken() throws IOException
    {
        String accessToken = getAccessToken();
        if (accessToken == null)
        {
            return null;
        }

        if (!isAccessTokenExpired(accessToken))
        {
            return accessToken;
        }

        String refreshToken = securePrefs.getString(KEY_REFRESH_TOKEN, null);
        if (refreshToken == null)
        {
            logout();
            return null;
        }

        return refreshAccessToken(refreshToken);
    }

    public boolean isLoggedIn()
    {
        return getAccessToken() != null;
    }

    public boolean isAdminUser()
    {
        String accessToken = getAccessToken();
        if (accessToken == null)
        {
            return false;
        }

        JSONObject claims = parseJwtClaims(accessToken);
        if (claims == null)
        {
            return false;
        }

        return hasAdminRole(claims.optJSONObject("realm_access"))
                || hasAdminRoleInResourceAccess(claims.optJSONObject("resource_access"));
    }

    public AppRole getActiveRole()
    {
        if (!isAdminUser())
        {
            return AppRole.CITIZEN;
        }

        String stored = securePrefs.getString(KEY_ACTIVE_ROLE, null);
        return "ADMIN".equals(stored) ? AppRole.ADMIN : AppRole.CITIZEN;
    }

    public void setActiveRole(AppRole role)
    {
        if (role == AppRole.ADMIN && !isAdminUser())
        {
            return;
        }

        securePrefs.edit().putString(KEY_ACTIVE_ROLE, role.name()).apply();
    }

    public String getUserId()
    {
        JSONObject claims = parseJwtClaims(getAccessToken());
        return claims == null ? null : claims.optString("sub", null);
    }

    public void logout()
    {
        securePrefs.edit()
                .remove(KEY_ACCESS_TOKEN)
                .remove(KEY_REFRESH_TOKEN)
                .remove(KEY_ID_TOKEN)
                .remove(KEY_ACCESS_TOKEN_EXPIRES_AT)
                .remove(KEY_ACTIVE_ROLE)
                .apply();
    }

    private void persistTokens(TokenResponse response)
    {
        SharedPreferences.Editor editor = securePrefs.edit()
                .putString(KEY_ACCESS_TOKEN, response.accessToken)
                .putLong(KEY_ACCESS_TOKEN_EXPIRES_AT, accessTokenExpiresAt(response.accessToken, response.accessTokenExpirationTime));

        if (response.refreshToken != null)
        {
            editor.putString(KEY_REFRESH_TOKEN, response.refreshToken);
        }

        if (response.idToken != null)
        {
            editor.putString(KEY_ID_TOKEN, response.idToken);
        }

        editor.apply();
    }

    private boolean isAccessTokenExpired(String accessToken)
    {
        long expiresAt = securePrefs.getLong(KEY_ACCESS_TOKEN_EXPIRES_AT, 0);
        if (expiresAt == 0)
        {
            expiresAt = parseJwtExpirationMillis(accessToken);
            if (expiresAt > 0)
            {
                securePrefs.edit().putLong(KEY_ACCESS_TOKEN_EXPIRES_AT, expiresAt).apply();
            }
        }

        return expiresAt > 0 && System.currentTimeMillis() + TOKEN_EXPIRY_SKEW_MS >= expiresAt;
    }

    private String refreshAccessToken(String refreshToken) throws IOException
    {
        HttpURLConnection conn = InsecureConnectionBuilder.INSTANCE.openConnection(Uri.parse(AuthConfig.TOKEN_ENDPOINT));
        conn.setRequestMethod("POST");
        conn.setDoOutput(true);
        conn.setRequestProperty("Content-Type", "application/x-www-form-urlencoded");

        String body = "grant_type=refresh_token"
                + "&client_id=" + urlEncode(AuthConfig.CLIENT_ID)
                + "&refresh_token=" + urlEncode(refreshToken);

        try (OutputStream output = conn.getOutputStream())
        {
            output.write(body.getBytes(StandardCharsets.UTF_8));
        }

        int status = conn.getResponseCode();
        String responseBody = readResponseBody(status >= 200 && status < 300 ? conn.getInputStream() : conn.getErrorStream());
        if (status < 200 || status >= 300)
        {
            logout();
            throw new IOException("Token refresh failed: HTTP " + status + " " + responseBody);
        }

        try
        {
            JSONObject json = new JSONObject(responseBody);
            String accessToken = json.getString(KEY_ACCESS_TOKEN);
            String newRefreshToken = json.optString(KEY_REFRESH_TOKEN, refreshToken);

            long expiresInSeconds = json.optLong("expires_in", 0);
            long expiresAt = expiresInSeconds > 0
                    ? System.currentTimeMillis() + expiresInSeconds * 1000
                    : parseJwtExpirationMillis(accessToken);

            securePrefs.edit()
                    .putString(KEY_ACCESS_TOKEN, accessToken)
                    .putString(KEY_REFRESH_TOKEN, newRefreshToken)
                    .putLong(KEY_ACCESS_TOKEN_EXPIRES_AT, expiresAt)
                    .apply();
            return accessToken;
        } catch (JSONException e)
        {
            throw new IOException("Token refresh returned invalid JSON", e);
        }
    }

    private static long accessTokenExpiresAt(String accessToken, Long appAuthExpirationTime)
    {
        return Objects.requireNonNullElseGet(appAuthExpirationTime, () -> parseJwtExpirationMillis(accessToken));

    }

    private static long parseJwtExpirationMillis(String jwt)
    {
        if (jwt == null)
            return 0;

        String[] parts = jwt.split("\\.");
        if (parts.length < 2)
            return 0;

        try
        {
            JSONObject claims = parseJwtClaims(jwt);
            if (claims == null)
            {
                return 0;
            }

            long expSeconds = claims.optLong("exp", 0);
            return expSeconds > 0 ? expSeconds * 1000 : 0;
        } catch (IllegalArgumentException e)
        {
            return 0;
        }
    }

    private static JSONObject parseJwtClaims(String jwt)
    {
        if (jwt == null)
            return null;

        String[] parts = jwt.split("\\.");
        if (parts.length < 2)
            return null;

        try
        {
            byte[] decoded = Base64.decode(parts[1], Base64.URL_SAFE | Base64.NO_WRAP | Base64.NO_PADDING);
            return new JSONObject(new String(decoded, StandardCharsets.UTF_8));
        } catch (IllegalArgumentException | JSONException e)
        {
            return null;
        }
    }

    private static boolean hasAdminRoleInResourceAccess(JSONObject resourceAccess)
    {
        if (resourceAccess == null)
            return false;

        JSONArray clientNames = resourceAccess.names();
        if (clientNames == null)
            return false;

        for (int i = 0; i < clientNames.length(); i++)
        {
            JSONObject clientAccess = resourceAccess.optJSONObject(clientNames.optString(i));
            if (hasAdminRole(clientAccess))
                return true;
        }
        return false;
    }

    private static boolean hasAdminRole(JSONObject access)
    {
        if (access == null)
            return false;

        JSONArray roles = access.optJSONArray("roles");
        if (roles == null)
            return false;

        for (int i = 0; i < roles.length(); i++)
        {
            String role = roles.optString(i, "").trim().toLowerCase();
            if ("admin".equals(role)
                    || "administrator".equals(role)
                    || "realm-admin".equals(role)
                    || "app-admin".equals(role)
                    || "election-admin".equals(role))
            {
                return true;
            }
        }
        return false;
    }

    private static String readResponseBody(InputStream input) throws IOException
    {
        if (input == null)
            return "";

        byte[] bytes = null;
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU)
        {
            bytes = input.readAllBytes();
        }
        return new String(bytes, StandardCharsets.UTF_8);
    }

    private static String urlEncode(String value)
    {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU)
        {
            return URLEncoder.encode(value, StandardCharsets.UTF_8);
        }

        try
        {
            return URLEncoder.encode(value, StandardCharsets.UTF_8.name());
        } catch (IOException e)
        {
            throw new IllegalStateException("UTF-8 not supported", e);
        }
    }

    private static SharedPreferences buildSecurePrefs(Context ctx)
    {
        try
        {
            String masterKeyAlias = MasterKeys.getOrCreate(MasterKeys.AES256_GCM_SPEC);
            return EncryptedSharedPreferences.create(
                    PREF_FILE,
                    masterKeyAlias,
                    ctx,
                    EncryptedSharedPreferences.PrefKeyEncryptionScheme.AES256_SIV,
                    EncryptedSharedPreferences.PrefValueEncryptionScheme.AES256_GCM
            );
        } catch (GeneralSecurityException | IOException e)
        {
            throw new IllegalStateException("Failed to initialise secure storage", e);
        }
    }
}
