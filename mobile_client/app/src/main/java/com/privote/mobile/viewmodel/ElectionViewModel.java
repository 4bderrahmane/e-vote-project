package com.privote.mobile.viewmodel;

import android.app.Application;

import androidx.annotation.NonNull;
import androidx.lifecycle.AndroidViewModel;
import androidx.lifecycle.LiveData;
import androidx.lifecycle.MutableLiveData;

import com.privote.mobile.repository.ElectionRepository;

public class ElectionViewModel extends AndroidViewModel
{

    private final ElectionRepository repository;
    private MutableLiveData<ElectionRepository.ElectionListResult> electionsLiveData;

    public ElectionViewModel(@NonNull Application application)
    {
        super(application);
        repository = new ElectionRepository(application);
    }

    public LiveData<ElectionRepository.ElectionListResult> getElections()
    {
        if (electionsLiveData == null)
        {
            electionsLiveData = new MutableLiveData<>();
            loadElections();
        }
        return electionsLiveData;
    }

    public void refresh()
    {
        loadElections();
    }

    private void loadElections()
    {
        repository.getElections().observeForever(result ->
                electionsLiveData.setValue(result));
    }
}
