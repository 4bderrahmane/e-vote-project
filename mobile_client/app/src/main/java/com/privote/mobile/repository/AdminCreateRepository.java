package com.privote.mobile.repository;

import android.content.Context;

import androidx.lifecycle.LiveData;
import androidx.lifecycle.MutableLiveData;

import com.privote.mobile.network.ApiClient;
import com.privote.mobile.network.dto.ElectionCreateRequestDto;
import com.privote.mobile.network.dto.ElectionDto;
import com.privote.mobile.network.dto.PartyCreateRequestDto;
import com.privote.mobile.network.dto.PartyDto;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;
import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

public class AdminCreateRepository
{
    @Getter
    @AllArgsConstructor(access = AccessLevel.PRIVATE)
    public static class CreateResult
    {
        private final String message;
        private final String errorMessage;

        public static CreateResult success(String message)
        {
            return new CreateResult(message, null);
        }

        public static CreateResult error(String errorMessage)
        {
            return new CreateResult(null, errorMessage);
        }

        public boolean isSuccess()
        {
            return errorMessage == null;
        }
    }

    private final ApiClient apiClient;

    public AdminCreateRepository(Context ctx)
    {
        apiClient = new ApiClient(ctx);
    }

    public LiveData<CreateResult> createElection(ElectionCreateRequestDto request)
    {
        MutableLiveData<CreateResult> result = new MutableLiveData<>();
        apiClient.api().createElection(request).enqueue(new Callback<ElectionDto>()
        {
            @Override
            public void onResponse(Call<ElectionDto> call, Response<ElectionDto> response)
            {
                if (response.isSuccessful() && response.body() != null)
                {
                    result.postValue(CreateResult.success("Created election: " + response.body().getTitle()));
                    return;
                }
                result.postValue(CreateResult.error("Create election failed: HTTP " + response.code()));
            }

            @Override
            public void onFailure(Call<ElectionDto> call, Throwable t)
            {
                result.postValue(CreateResult.error("Create election failed: " + t.getMessage()));
            }
        });
        return result;
    }

    public LiveData<CreateResult> createParty(PartyCreateRequestDto request)
    {
        MutableLiveData<CreateResult> result = new MutableLiveData<>();
        apiClient.api().createParty(request).enqueue(new Callback<PartyDto>()
        {
            @Override
            public void onResponse(Call<PartyDto> call, Response<PartyDto> response)
            {
                if (response.isSuccessful() && response.body() != null)
                {
                    result.postValue(CreateResult.success("Created party: " + response.body().getName()));
                    return;
                }
                result.postValue(CreateResult.error("Create party failed: HTTP " + response.code()));
            }

            @Override
            public void onFailure(Call<PartyDto> call, Throwable t)
            {
                result.postValue(CreateResult.error("Create party failed: " + t.getMessage()));
            }
        });
        return result;
    }
}
