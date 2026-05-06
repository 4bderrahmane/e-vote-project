package com.privote.mobile.repository;

import android.content.Context;

import androidx.lifecycle.LiveData;
import androidx.lifecycle.MutableLiveData;

import com.privote.mobile.network.ApiClient;
import com.privote.mobile.network.dto.VoterRegistrationDto;
import com.privote.mobile.network.dto.VoterRegistrationRequestDto;

import java.util.UUID;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

public class VoterRegistrationRepository
{
    @AllArgsConstructor(access = AccessLevel.PRIVATE)
    public static class RegistrationResult
    {
        public final VoterRegistrationDto registration;
        public final String errorMessage;
        public final boolean notFound;

        public static RegistrationResult success(VoterRegistrationDto registration)
        {
            return new RegistrationResult(registration, null, false);
        }

        public static RegistrationResult notFound()
        {
            return new RegistrationResult(null, null, true);
        }

        public static RegistrationResult error(String errorMessage)
        {
            return new RegistrationResult(null, errorMessage, false);
        }

        public boolean isSuccess()
        {
            return errorMessage == null;
        }
    }

    private final ApiClient apiClient;

    public VoterRegistrationRepository(Context ctx)
    {
        apiClient = new ApiClient(ctx);
    }

    public LiveData<RegistrationResult> getMyRegistration(UUID electionUuid)
    {
        MutableLiveData<RegistrationResult> liveData = new MutableLiveData<>();
        apiClient.api().getMyRegistration(electionUuid).enqueue(new Callback<VoterRegistrationDto>()
        {
            @Override
            public void onResponse(Call<VoterRegistrationDto> call, Response<VoterRegistrationDto> response)
            {
                if (response.isSuccessful())
                {
                    liveData.postValue(RegistrationResult.success(response.body()));
                    return;
                }

                if (response.code() == 404)
                {
                    liveData.postValue(RegistrationResult.notFound());
                    return;
                }

                liveData.postValue(RegistrationResult.error("Registration lookup failed: HTTP " + response.code()));
            }

            @Override
            public void onFailure(Call<VoterRegistrationDto> call, Throwable t)
            {
                liveData.postValue(RegistrationResult.error("Registration lookup failed: " + t.getMessage()));
            }
        });
        return liveData;
    }

    public LiveData<RegistrationResult> register(UUID electionUuid, String identityCommitmentDecimal)
    {
        MutableLiveData<RegistrationResult> liveData = new MutableLiveData<>();
        VoterRegistrationRequestDto body = new VoterRegistrationRequestDto(identityCommitmentDecimal);
        apiClient.api().registerToVote(electionUuid, body).enqueue(new Callback<VoterRegistrationDto>()
        {
            @Override
            public void onResponse(Call<VoterRegistrationDto> call, Response<VoterRegistrationDto> response)
            {
                if (response.isSuccessful() && response.body() != null)
                {
                    liveData.postValue(RegistrationResult.success(response.body()));
                    return;
                }

                liveData.postValue(RegistrationResult.error("Registration failed: HTTP " + response.code()));
            }

            @Override
            public void onFailure(Call<VoterRegistrationDto> call, Throwable t)
            {
                liveData.postValue(RegistrationResult.error("Registration failed: " + t.getMessage()));
            }
        });
        return liveData;
    }
}
