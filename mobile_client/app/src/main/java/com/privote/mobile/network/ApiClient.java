package com.privote.mobile.network;

import android.content.Context;

import com.privote.mobile.auth.AuthConfig;
import com.privote.mobile.auth.TokenInterceptor;

import okhttp3.OkHttpClient;
import okhttp3.logging.HttpLoggingInterceptor;
import retrofit2.Retrofit;
import retrofit2.converter.gson.GsonConverterFactory;

public class ApiClient
{

    private static volatile ApiClient instance;

    private final ApiService apiService;

    private ApiClient(Context ctx)
    {
        HttpLoggingInterceptor logging = new HttpLoggingInterceptor();
        logging.setLevel(HttpLoggingInterceptor.Level.BODY);

        OkHttpClient httpClient = new OkHttpClient.Builder()
                .addInterceptor(new TokenInterceptor(ctx))
                .addInterceptor(logging)
                .build();

        Retrofit retrofit = new Retrofit.Builder()
                .baseUrl(AuthConfig.API_BASE_URL)
                .client(httpClient)
                .addConverterFactory(GsonConverterFactory.create())
                .build();

        apiService = retrofit.create(ApiService.class);
    }

    public static ApiClient getInstance(Context ctx)
    {
        if (instance == null)
        {
            synchronized (ApiClient.class)
            {
                if (instance == null)
                {
                    instance = new ApiClient(ctx.getApplicationContext());
                }
            }
        }
        return instance;
    }

    public ApiService api()
    {
        return apiService;
    }
}
