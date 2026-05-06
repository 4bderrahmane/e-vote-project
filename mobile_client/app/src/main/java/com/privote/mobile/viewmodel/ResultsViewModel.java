package com.privote.mobile.viewmodel;

import android.app.Application;

import androidx.annotation.NonNull;
import androidx.lifecycle.AndroidViewModel;
import androidx.lifecycle.LiveData;
import androidx.lifecycle.MutableLiveData;

import com.privote.mobile.repository.ResultsRepository;

public class ResultsViewModel extends AndroidViewModel
{
    private final ResultsRepository repository;
    private MutableLiveData<ResultsRepository.ResultsListResult> resultsLiveData;

    public ResultsViewModel(@NonNull Application application)
    {
        super(application);
        repository = new ResultsRepository(application);
    }

    public LiveData<ResultsRepository.ResultsListResult> getResults()
    {
        if (resultsLiveData == null)
        {
            resultsLiveData = new MutableLiveData<>();
            refresh();
        }
        return resultsLiveData;
    }

    public void refresh()
    {
        repository.getResults().observeForever(result -> resultsLiveData.setValue(result));
    }
}
