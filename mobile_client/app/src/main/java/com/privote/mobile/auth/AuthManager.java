package com.privote.mobile.auth;

import android.app.Activity;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.net.Uri;

import androidx.security.crypto.EncryptedSharedPreferences;
import androidx.security.crypto.MasterKeys;

import net.openid.appauth.AuthorizationException;
import net.openid.appauth.AuthorizationRequest;
import net.openid.appauth.AuthorizationResponse;
import net.openid.appauth.AuthorizationService;
import net.openid.appauth.AuthorizationServiceConfiguration;
import net.openid.appauth.ResponseTypeValues;
import net.openid.appauth.TokenResponse;

import java.io.IOException;
import java.security.GeneralSecurityException;

public class AuthManager
{

    public interface AuthCallback
    {
        void onSuccess();

        void onError(String message);
    }

    private static final String PREF_FILE = "auth_prefs";
    private static final String KEY_ACCESS_TOKEN = "access_token";
    private static final String KEY_REFRESH_TOKEN = "refresh_token";
    private static final String KEY_ID_TOKEN = "id_token";

    private static volatile AuthManager instance;

    private final AuthorizationService authService;
    private final SharedPreferences securePrefs;

    private AuthManager(Context ctx)
    {
        authService = new AuthorizationService(ctx.getApplicationContext());
        securePrefs = buildSecurePrefs(ctx.getApplicationContext());
    }

    public static AuthManager getInstance(Context ctx)
    {
        if (instance == null)
        {
            synchronized (AuthManager.class)
            {
                if (instance == null)
                {
                    instance = new AuthManager(ctx);
                }
            }
        }
        return instance;
    }

    // -------------------------------------------------------------------------
    // Login
    // -------------------------------------------------------------------------

    public void startLoginFlow(Activity activity, int requestCode)
    {
        AuthorizationServiceConfiguration.fetchFromIssuer(
                Uri.parse(AuthConfig.ISSUER_URI),
                (config, ex) ->
                {
                    if (config == null) return;
                    AuthorizationRequest request = new AuthorizationRequest.Builder(
                            config,
                            AuthConfig.CLIENT_ID,
                            ResponseTypeValues.CODE,
                            Uri.parse(AuthConfig.REDIRECT_URI)
                    ).setScope("openid profile email").build();

                    Intent authIntent = authService.getAuthorizationRequestIntent(request);
                    activity.startActivityForResult(authIntent, requestCode);
                }
        );
    }

    /**
     * Call this from Activity#onActivityResult when requestCode matches.
     */
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

    // -------------------------------------------------------------------------
    // Token access
    // -------------------------------------------------------------------------

    public String getAccessToken()
    {
        return securePrefs.getString(KEY_ACCESS_TOKEN, null);
    }

    public boolean isLoggedIn()
    {
        return getAccessToken() != null;
    }

    public void logout()
    {
        securePrefs.edit()
                .remove(KEY_ACCESS_TOKEN)
                .remove(KEY_REFRESH_TOKEN)
                .remove(KEY_ID_TOKEN)
                .apply();
    }

    // -------------------------------------------------------------------------
    // Internals
    // -------------------------------------------------------------------------

    private void persistTokens(TokenResponse response)
    {
        securePrefs.edit()
                .putString(KEY_ACCESS_TOKEN, response.accessToken)
                .putString(KEY_REFRESH_TOKEN, response.refreshToken)
                .putString(KEY_ID_TOKEN, response.idToken)
                .apply();
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
            throw new RuntimeException("Failed to initialise secure storage", e);
        }
    }
}
