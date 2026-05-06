package com.privote.mobile.repository;

import android.content.Context;

import androidx.lifecycle.LiveData;
import androidx.lifecycle.MutableLiveData;

import com.privote.mobile.network.ApiClient;
import com.privote.mobile.network.dto.PartyDto;

import java.util.List;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

public class PartyRepository
{
    public static class PartyListResult
    {
        public final List<PartyDto> parties;
        public final String errorMessage;

        private PartyListResult(List<PartyDto> parties, String errorMessage)
        {
            this.parties = parties;
            this.errorMessage = errorMessage;
        }

        public static PartyListResult success(List<PartyDto> parties)
        {
            return new PartyListResult(parties, null);
        }

        public static PartyListResult error(String errorMessage)
        {
            return new PartyListResult(null, errorMessage);
        }

        public boolean isSuccess()
        {
            return errorMessage == null;
        }
    }

    private final ApiClient apiClient;

    public PartyRepository(Context ctx)
    {
        apiClient = new ApiClient(ctx);
    }

    public LiveData<PartyListResult> getParties()
    {
        MutableLiveData<PartyListResult> result = new MutableLiveData<>();
        apiClient.api().getParties().enqueue(new Callback<List<PartyDto>>()
        {
            @Override
            public void onResponse(Call<List<PartyDto>> call, Response<List<PartyDto>> response)
            {
                if (response.isSuccessful())
                {
                    result.postValue(PartyListResult.success(response.body()));
                    return;
                }
                result.postValue(PartyListResult.error("Parties request failed: HTTP " + response.code()));
            }

            @Override
            public void onFailure(Call<List<PartyDto>> call, Throwable t)
            {
                result.postValue(PartyListResult.error("Parties request failed: " + t.getMessage()));
            }
        });
        return result;
    }
}
