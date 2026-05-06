package com.privote.mobile.repository;

import android.content.Context;

import androidx.lifecycle.LiveData;
import androidx.lifecycle.MutableLiveData;

import com.privote.mobile.network.ApiClient;
import com.privote.mobile.network.dto.CandidateDto;

import java.util.List;
import java.util.UUID;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

public class CandidateRepository
{
    @AllArgsConstructor(access = AccessLevel.PRIVATE)
    public static class CandidatesResult
    {
        public final List<CandidateDto> candidates;
        public final String errorMessage;

        public static CandidatesResult success(List<CandidateDto> candidates)
        {
            return new CandidatesResult(candidates, null);
        }

        public static CandidatesResult error(String errorMessage)
        {
            return new CandidatesResult(null, errorMessage);
        }

        public boolean isSuccess()
        {
            return errorMessage == null;
        }
    }

    private final ApiClient apiClient;

    public CandidateRepository(Context ctx)
    {
        apiClient = ApiClient.getInstance(ctx);
    }

    public LiveData<CandidatesResult> getActiveCandidates(UUID electionUuid)
    {
        MutableLiveData<CandidatesResult> result = new MutableLiveData<>();
        apiClient.api().getActiveCandidates(electionUuid).enqueue(new Callback<List<CandidateDto>>()
        {
            @Override
            public void onResponse(Call<List<CandidateDto>> call, Response<List<CandidateDto>> response)
            {
                if (response.isSuccessful())
                {
                    result.postValue(CandidatesResult.success(response.body()));
                    return;
                }

                result.postValue(CandidatesResult.error("Candidates request failed: HTTP " + response.code()));
            }

            @Override
            public void onFailure(Call<List<CandidateDto>> call, Throwable t)
            {
                result.postValue(CandidatesResult.error("Candidates request failed: " + t.getMessage()));
            }
        });
        return result;
    }
}
