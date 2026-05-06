package com.privote.mobile.repository;

import android.content.Context;

import androidx.lifecycle.LiveData;
import androidx.lifecycle.MutableLiveData;

import com.privote.mobile.network.ApiClient;
import com.privote.mobile.network.dto.CitizenDto;
import com.privote.mobile.network.dto.CitizenSelfUpdateRequestDto;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

public class ProfileRepository
{
    @AllArgsConstructor(access = AccessLevel.PRIVATE)
    public static class ProfileResult
    {
        public final CitizenDto profile;
        public final String errorMessage;

        public static ProfileResult success(CitizenDto profile)
        {
            return new ProfileResult(profile, null);
        }

        public static ProfileResult error(String errorMessage)
        {
            return new ProfileResult(null, errorMessage);
        }

        public boolean isSuccess()
        {
            return errorMessage == null;
        }
    }

    private final ApiClient apiClient;

    public ProfileRepository(Context ctx)
    {
        apiClient = new ApiClient(ctx);
    }

    public LiveData<ProfileResult> getProfile()
    {
        MutableLiveData<ProfileResult> result = new MutableLiveData<>();
        apiClient.api().getMe().enqueue(new Callback<CitizenDto>()
        {
            @Override
            public void onResponse(Call<CitizenDto> call, Response<CitizenDto> response)
            {
                if (response.isSuccessful())
                {
                    result.postValue(ProfileResult.success(response.body()));
                    return;
                }

                result.postValue(ProfileResult.error("Profile request failed: HTTP " + response.code()));
            }

            @Override
            public void onFailure(Call<CitizenDto> call, Throwable t)
            {
                result.postValue(ProfileResult.error("Profile request failed: " + t.getMessage()));
            }
        });
        return result;
    }

    public LiveData<ProfileResult> updateProfile(CitizenSelfUpdateRequestDto request)
    {
        MutableLiveData<ProfileResult> result = new MutableLiveData<>();
        apiClient.api().updateMe(request).enqueue(new Callback<CitizenDto>()
        {
            @Override
            public void onResponse(Call<CitizenDto> call, Response<CitizenDto> response)
            {
                if (response.isSuccessful())
                {
                    result.postValue(ProfileResult.success(response.body()));
                    return;
                }

                result.postValue(ProfileResult.error("Profile update failed: HTTP " + response.code()));
            }

            @Override
            public void onFailure(Call<CitizenDto> call, Throwable t)
            {
                result.postValue(ProfileResult.error("Profile update failed: " + t.getMessage()));
            }
        });
        return result;
    }
}
