package com.privote.mobile.viewmodel;

import android.app.Application;

import androidx.annotation.NonNull;
import androidx.lifecycle.AndroidViewModel;
import androidx.lifecycle.LiveData;

import com.privote.mobile.network.dto.ElectionCreateRequestDto;
import com.privote.mobile.network.dto.PartyCreateRequestDto;
import com.privote.mobile.repository.AdminCreateRepository;

public class AdminCreateViewModel extends AndroidViewModel
{
    private final AdminCreateRepository repository;

    public AdminCreateViewModel(@NonNull Application application)
    {
        super(application);
        repository = new AdminCreateRepository(application);
    }

    public LiveData<AdminCreateRepository.CreateResult> createElection(ElectionCreateRequestDto request)
    {
        return repository.createElection(request);
    }

    public LiveData<AdminCreateRepository.CreateResult> createParty(PartyCreateRequestDto request)
    {
        return repository.createParty(request);
    }
}
