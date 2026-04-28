package com.privote.mobile.repository;

import android.content.Context;

import androidx.lifecycle.LiveData;
import androidx.lifecycle.MutableLiveData;

import com.privote.mobile.network.ApiClient;
import com.privote.mobile.network.dto.ElectionDto;

import java.util.List;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

public class ElectionRepository
{

    private final ApiClient apiClient;

    public ElectionRepository(Context ctx)
    {
        apiClient = ApiClient.getInstance(ctx);
    }

    public LiveData<List<ElectionDto>> getElections()
    {
        MutableLiveData<List<ElectionDto>> result = new MutableLiveData<>();
        apiClient.api().getElections().enqueue(new Callback<List<ElectionDto>>()
        {
            @Override
            public void onResponse(Call<List<ElectionDto>> call, Response<List<ElectionDto>> response)
            {
                result.postValue(response.isSuccessful() ? response.body() : null);
            }

            @Override
            public void onFailure(Call<List<ElectionDto>> call, Throwable t)
            {
                result.postValue(null);
            }
        });
        return result;
    }
}
