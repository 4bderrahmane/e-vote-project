package com.privote.mobile.viewmodel;

import android.app.Application;

import androidx.annotation.NonNull;
import androidx.lifecycle.AndroidViewModel;
import androidx.lifecycle.LiveData;
import androidx.lifecycle.MutableLiveData;

import com.privote.mobile.network.dto.CitizenSelfUpdateRequestDto;
import com.privote.mobile.repository.ProfileRepository;

public class ProfileViewModel extends AndroidViewModel
{
    private final ProfileRepository repository;
    private MutableLiveData<ProfileRepository.ProfileResult> profileLiveData;

    public ProfileViewModel(@NonNull Application application)
    {
        super(application);
        repository = new ProfileRepository(application);
    }

    public LiveData<ProfileRepository.ProfileResult> getProfile()
    {
        if (profileLiveData == null)
        {
            profileLiveData = new MutableLiveData<>();
            loadProfile();
        }
        return profileLiveData;
    }

    public void refresh()
    {
        loadProfile();
    }

    public void updateProfile(CitizenSelfUpdateRequestDto request)
    {
        repository.updateProfile(request).observeForever(result ->
                profileLiveData.setValue(result));
    }

    private void loadProfile()
    {
        repository.getProfile().observeForever(result ->
                profileLiveData.setValue(result));
    }
}
