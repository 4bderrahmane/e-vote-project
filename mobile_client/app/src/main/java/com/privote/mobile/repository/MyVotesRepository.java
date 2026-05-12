package com.privote.mobile.repository;

import android.content.Context;

import androidx.lifecycle.LiveData;
import androidx.lifecycle.MutableLiveData;

import com.privote.mobile.network.ApiClient;
import com.privote.mobile.network.dto.ElectionDto;
import com.privote.mobile.network.dto.VoterRegistrationDto;

import java.util.ArrayList;
import java.util.List;
import java.util.Queue;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.concurrent.ConcurrentLinkedQueue;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

public class MyVotesRepository
{
    @AllArgsConstructor
    public static class MyVoteItem
    {
        public final ElectionDto election;
        public final VoterRegistrationDto registration;
    }

    @AllArgsConstructor(access = AccessLevel.PRIVATE)
    public static class MyVotesResult
    {
        public final List<MyVoteItem> votes;
        public final String errorMessage;

        public static MyVotesResult success(List<MyVoteItem> votes)
        {
            return new MyVotesResult(votes, null);
        }

        public static MyVotesResult error(String errorMessage)
        {
            return new MyVotesResult(null, errorMessage);
        }

        public boolean isSuccess()
        {
            return errorMessage == null;
        }
    }

    private final ApiClient apiClient;

    public MyVotesRepository(Context ctx)
    {
        apiClient = new ApiClient(ctx);
    }

    public LiveData<MyVotesResult> getMyVotes()
    {
        MutableLiveData<MyVotesResult> result = new MutableLiveData<>();
        apiClient.api().getElections().enqueue(new Callback<List<ElectionDto>>()
        {
            @Override
            public void onResponse(Call<List<ElectionDto>> call, Response<List<ElectionDto>> response)
            {
                if (!response.isSuccessful())
                {
                    result.postValue(MyVotesResult.error("Unable to load your votes right now"));
                    return;
                }

                List<ElectionDto> elections = response.body();
                if (elections == null || elections.isEmpty())
                {
                    result.postValue(MyVotesResult.success(List.of()));
                    return;
                }

                loadRegistrations(elections, result);
            }

            @Override
            public void onFailure(Call<List<ElectionDto>> call, Throwable t)
            {
                result.postValue(MyVotesResult.error("Unable to connect. Pull down to refresh."));
            }
        });
        return result;
    }

    private void loadRegistrations(List<ElectionDto> elections, MutableLiveData<MyVotesResult> liveData)
    {
        Queue<MyVoteItem> loaded = new ConcurrentLinkedQueue<>();
        AtomicInteger remaining = new AtomicInteger(elections.size());
        Queue<String> errors = new ConcurrentLinkedQueue<>();

        for (ElectionDto election : elections)
        {
            apiClient.api().getMyRegistration(election.getPublicId()).enqueue(new Callback<VoterRegistrationDto>()
            {
                @Override
                public void onResponse(Call<VoterRegistrationDto> call, Response<VoterRegistrationDto> response)
                {
                    if (response.isSuccessful() && response.body() != null)
                    {
                        loaded.add(new MyVoteItem(election, response.body()));
                    }
                    finishOne(remaining, loaded, errors, liveData);
                }

                @Override
                public void onFailure(Call<VoterRegistrationDto> call, Throwable t)
                {
                    appendError(errors, safeTitle(election));
                    finishOne(remaining, loaded, errors, liveData);
                }
            });
        }
    }

    private static void finishOne(AtomicInteger remaining,
                                  Queue<MyVoteItem> loaded,
                                  Queue<String> errors,
                                  MutableLiveData<MyVotesResult> liveData)
    {
        if (remaining.decrementAndGet() != 0)
        {
            return;
        }

        if (!loaded.isEmpty())
        {
            liveData.postValue(MyVotesResult.success(new ArrayList<>(loaded)));
            return;
        }

        String message = errors.isEmpty() ? null : String.join("\n", errors);
        liveData.postValue(message == null ? MyVotesResult.success(List.of()) : MyVotesResult.error(message));
    }

    private static void appendError(Queue<String> errors, String error)
    {
        errors.add(error);
    }

    private static String safeTitle(ElectionDto election)
    {
        String title = election.getTitle();
        return title == null || title.trim().isEmpty() ? "Election" : title;
    }
}
