package com.privote.mobile.viewmodel;

import android.app.Application;

import androidx.annotation.NonNull;
import androidx.lifecycle.AndroidViewModel;
import androidx.lifecycle.LiveData;
import androidx.lifecycle.MutableLiveData;

import com.privote.mobile.repository.MyVotesRepository;

public class MyVotesViewModel extends AndroidViewModel
{
    private final MyVotesRepository repository;
    private MutableLiveData<MyVotesRepository.MyVotesResult> myVotesLiveData;

    public MyVotesViewModel(@NonNull Application application)
    {
        super(application);
        repository = new MyVotesRepository(application);
    }

    public LiveData<MyVotesRepository.MyVotesResult> getMyVotes()
    {
        if (myVotesLiveData == null)
        {
            myVotesLiveData = new MutableLiveData<>();
            refresh();
        }
        return myVotesLiveData;
    }

    public void refresh()
    {
        repository.getMyVotes().observeForever(result -> myVotesLiveData.setValue(result));
    }
}
