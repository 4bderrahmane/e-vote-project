package com.privote.mobile.repository;

import android.content.Context;

import androidx.lifecycle.LiveData;
import androidx.lifecycle.MutableLiveData;

import com.privote.mobile.network.ApiClient;
import com.privote.mobile.network.dto.ElectionDto;

import java.util.List;
import java.util.UUID;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

public class ElectionRepository
{
    @AllArgsConstructor(access = AccessLevel.PRIVATE)
    public static class ElectionListResult
    {
        public final List<ElectionDto> elections;
        public final String errorMessage;

        public static ElectionListResult success(List<ElectionDto> elections)
        {
            return new ElectionListResult(elections, null);
        }

        public static ElectionListResult error(String errorMessage)
        {
            return new ElectionListResult(null, errorMessage);
        }

        public boolean isSuccess()
        {
            return errorMessage == null;
        }
    }

    private final ApiClient apiClient;

    public ElectionRepository(Context ctx)
    {
        apiClient = new ApiClient(ctx);
    }

    public LiveData<ElectionListResult> getElections()
    {
        MutableLiveData<ElectionListResult> result = new MutableLiveData<>();
        apiClient.api().getElections().enqueue(new Callback<List<ElectionDto>>()
        {
            @Override
            public void onResponse(Call<List<ElectionDto>> call, Response<List<ElectionDto>> response)
            {
                if (response.isSuccessful())
                {
                    result.postValue(ElectionListResult.success(response.body()));
                    return;
                }

                result.postValue(ElectionListResult.error("Elections request failed: HTTP " + response.code()));
            }

            @Override
            public void onFailure(Call<List<ElectionDto>> call, Throwable t)
            {
                result.postValue(ElectionListResult.error("Elections request failed: " + t.getMessage()));
            }
        });
        return result;
    }

    public LiveData<ElectionDetailResult> getElection(UUID uuid)
    {
        MutableLiveData<ElectionDetailResult> result = new MutableLiveData<>();
        apiClient.api().getElection(uuid).enqueue(new Callback<ElectionDto>()
        {
            @Override
            public void onResponse(Call<ElectionDto> call, Response<ElectionDto> response)
            {
                if (response.isSuccessful())
                {
                    result.postValue(ElectionDetailResult.success(response.body()));
                    return;
                }

                result.postValue(ElectionDetailResult.error("Election request failed: HTTP " + response.code()));
            }

            @Override
            public void onFailure(Call<ElectionDto> call, Throwable t)
            {
                result.postValue(ElectionDetailResult.error("Election request failed: " + t.getMessage()));
            }
        });
        return result;
    }

    public LiveData<ElectionDetailResult> startElection(UUID uuid)
    {
        MutableLiveData<ElectionDetailResult> result = new MutableLiveData<>();
        apiClient.api().startElection(uuid).enqueue(new Callback<ElectionDto>()
        {
            @Override
            public void onResponse(Call<ElectionDto> call, Response<ElectionDto> response)
            {
                if (response.isSuccessful())
                {
                    result.postValue(ElectionDetailResult.success(response.body()));
                    return;
                }

                result.postValue(ElectionDetailResult.error("Start election failed: HTTP " + response.code()));
            }

            @Override
            public void onFailure(Call<ElectionDto> call, Throwable t)
            {
                result.postValue(ElectionDetailResult.error("Start election failed: " + t.getMessage()));
            }
        });
        return result;
    }

    @AllArgsConstructor(access = AccessLevel.PRIVATE)
    public static class ElectionDetailResult
    {
        public final ElectionDto election;
        public final String errorMessage;

        public static ElectionDetailResult success(ElectionDto election)
        {
            return new ElectionDetailResult(election, null);
        }

        public static ElectionDetailResult error(String errorMessage)
        {
            return new ElectionDetailResult(null, errorMessage);
        }

        public boolean isSuccess()
        {
            return errorMessage == null;
        }
    }
}
