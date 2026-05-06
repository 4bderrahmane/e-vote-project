package com.privote.mobile.repository;

import android.content.Context;

import androidx.annotation.NonNull;
import androidx.lifecycle.LiveData;
import androidx.lifecycle.MutableLiveData;

import com.privote.mobile.network.ApiClient;
import com.privote.mobile.network.dto.ElectionDto;
import com.privote.mobile.network.dto.ElectionResultDto;

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

public class ResultsRepository
{
    @AllArgsConstructor(access = AccessLevel.PRIVATE)
    public static class ResultsListResult
    {
        public final List<ElectionResultDto> results;
        public final String errorMessage;

        public static ResultsListResult success(List<ElectionResultDto> results)
        {
            return new ResultsListResult(results, null);
        }

        public static ResultsListResult error(String errorMessage)
        {
            return new ResultsListResult(null, errorMessage);
        }

        public boolean isSuccess()
        {
            return errorMessage == null;
        }
    }

    private final ApiClient apiClient;

    public ResultsRepository(Context ctx)
    {
        apiClient = new ApiClient(ctx);
    }

    public LiveData<ResultsListResult> getResults()
    {
        MutableLiveData<ResultsListResult> result = new MutableLiveData<>();
        apiClient.api().getElections().enqueue(new Callback<List<ElectionDto>>()
        {
            @Override
            public void onResponse(@NonNull Call<List<ElectionDto>> call, @NonNull Response<List<ElectionDto>> response)
            {
                if (!response.isSuccessful())
                {
                    result.postValue(ResultsListResult.error("Results request failed: HTTP " + response.code()));
                    return;
                }

                List<ElectionDto> elections = response.body();
                if (elections == null || elections.isEmpty())
                {
                    result.postValue(ResultsListResult.success(List.of()));
                    return;
                }

                loadResultsForElections(elections, result);
            }

            @Override
            public void onFailure(Call<List<ElectionDto>> call, Throwable t)
            {
                result.postValue(ResultsListResult.error("Results request failed: " + t.getMessage()));
            }
        });
        return result;
    }

    private void loadResultsForElections(List<ElectionDto> elections, MutableLiveData<ResultsListResult> liveData)
    {
        Queue<ElectionResultDto> loaded = new ConcurrentLinkedQueue<>();
        AtomicInteger remaining = new AtomicInteger(elections.size());
        Queue<String> errors = new ConcurrentLinkedQueue<>();

        for (ElectionDto election : elections)
        {
            apiClient.api().getResults(election.getPublicId()).enqueue(new Callback<ElectionResultDto>()
            {
                @Override
                public void onResponse(Call<ElectionResultDto> call, Response<ElectionResultDto> response)
                {
                    if (response.isSuccessful() && response.body() != null)
                    {
                        loaded.add(response.body());
                    } else if (response.code() != 404)
                    {
                        appendError(errors, "HTTP " + response.code() + " for " + safeTitle(election));
                    }
                    finishOne(remaining, loaded, errors, liveData);
                }

                @Override
                public void onFailure(Call<ElectionResultDto> call, Throwable t)
                {
                    appendError(errors, safeTitle(election) + ": " + t.getMessage());
                    finishOne(remaining, loaded, errors, liveData);
                }
            });
        }
    }

    private static void finishOne(AtomicInteger remaining,
                                  Queue<ElectionResultDto> loaded,
                                  Queue<String> errors,
                                  MutableLiveData<ResultsListResult> liveData)
    {
        if (remaining.decrementAndGet() != 0)
        {
            return;
        }

        if (!loaded.isEmpty())
        {
            liveData.postValue(ResultsListResult.success(new ArrayList<>(loaded)));
            return;
        }

        String message = errors.isEmpty() ? null : String.join("\n", errors);
        liveData.postValue(message == null ? ResultsListResult.success(List.of()) : ResultsListResult.error(message));
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
