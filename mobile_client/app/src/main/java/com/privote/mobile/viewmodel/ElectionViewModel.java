package com.privote.mobile.viewmodel;

import android.app.Application;

import androidx.annotation.NonNull;
import androidx.lifecycle.AndroidViewModel;
import androidx.lifecycle.LiveData;
import androidx.lifecycle.MutableLiveData;

import com.privote.mobile.network.dto.ElectionDto;
import com.privote.mobile.repository.ElectionRepository;

import java.util.List;

public class ElectionViewModel extends AndroidViewModel
{

    private final ElectionRepository repository;
    private MutableLiveData<List<ElectionDto>> electionsLiveData;

    public ElectionViewModel(@NonNull Application application)
    {
        super(application);
        repository = new ElectionRepository(application);
    }

    public LiveData<List<ElectionDto>> getElections()
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
        repository.getElections().observeForever(elections ->
                electionsLiveData.setValue(elections));
    }
}
