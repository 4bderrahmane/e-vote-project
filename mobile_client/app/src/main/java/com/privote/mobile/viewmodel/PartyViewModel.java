package com.privote.mobile.viewmodel;

import android.app.Application;

import androidx.annotation.NonNull;
import androidx.lifecycle.AndroidViewModel;
import androidx.lifecycle.LiveData;
import androidx.lifecycle.MutableLiveData;

import com.privote.mobile.repository.PartyRepository;

public class PartyViewModel extends AndroidViewModel
{
    private final PartyRepository repository;
    private MutableLiveData<PartyRepository.PartyListResult> partiesLiveData;

    public PartyViewModel(@NonNull Application application)
    {
        super(application);
        repository = new PartyRepository(application);
    }

    public LiveData<PartyRepository.PartyListResult> getParties()
    {
        if (partiesLiveData == null)
        {
            partiesLiveData = new MutableLiveData<>();
            refresh();
        }
        return partiesLiveData;
    }

    public void refresh()
    {
        repository.getParties().observeForever(result -> partiesLiveData.setValue(result));
    }
}
