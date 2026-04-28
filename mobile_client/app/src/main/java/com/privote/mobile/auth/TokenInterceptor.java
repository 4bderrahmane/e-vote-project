package com.privote.mobile.auth;

import android.content.Context;

import java.io.IOException;

import okhttp3.Interceptor;
import okhttp3.Request;
import okhttp3.Response;

public class TokenInterceptor implements Interceptor
{

    private final AuthManager authManager;

    public TokenInterceptor(Context ctx)
    {
        authManager = AuthManager.getInstance(ctx);
    }

    @Override
    public Response intercept(Chain chain) throws IOException
    {
        String token = authManager.getAccessToken();
        Request original = chain.request();

        if (token == null)
        {
            return chain.proceed(original);
        }

        Request authenticated = original.newBuilder()
                .header("Authorization", "Bearer " + token)
                .build();

        return chain.proceed(authenticated);
    }
}
