package com.privote.mobile.ui.results;

import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Toast;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.fragment.app.Fragment;
import androidx.lifecycle.ViewModelProvider;
import androidx.recyclerview.widget.LinearLayoutManager;

import com.privote.mobile.databinding.FragmentResultsBinding;
import com.privote.mobile.viewmodel.ResultsViewModel;

public class ResultsFragment extends Fragment
{
    private FragmentResultsBinding binding;
    private ResultsViewModel viewModel;
    private ResultsAdapter adapter;

    @Nullable
    @Override
    public View onCreateView(@NonNull LayoutInflater inflater,
                             @Nullable ViewGroup container,
                             @Nullable Bundle savedInstanceState)
    {
        binding = FragmentResultsBinding.inflate(inflater, container, false);
        return binding.getRoot();
    }

    @Override
    public void onViewCreated(@NonNull View view, @Nullable Bundle savedInstanceState)
    {
        super.onViewCreated(view, savedInstanceState);
        adapter = new ResultsAdapter();
        binding.recyclerView.setLayoutManager(new LinearLayoutManager(requireContext()));
        binding.recyclerView.setAdapter(adapter);

        viewModel = new ViewModelProvider(this).get(ResultsViewModel.class);
        binding.swipeRefresh.setOnRefreshListener(() -> viewModel.refresh());

        showMessage("Loading results...");
        viewModel.getResults().observe(getViewLifecycleOwner(), result ->
        {
            binding.swipeRefresh.setRefreshing(false);
            if (result == null)
            {
                showMessage("Loading results...");
                return;
            }

            if (!result.isSuccess())
            {
                showMessage(result.errorMessage);
                Toast.makeText(requireContext(), result.errorMessage, Toast.LENGTH_SHORT).show();
                return;
            }

            if (result.results == null || result.results.isEmpty())
            {
                showMessage("No results available");
                return;
            }

            binding.tvEmpty.setVisibility(View.GONE);
            binding.recyclerView.setVisibility(View.VISIBLE);
            adapter.setResults(result.results);
        });
    }

    private void showMessage(String message)
    {
        adapter.setResults(null);
        binding.tvEmpty.setText(message);
        binding.tvEmpty.setVisibility(View.VISIBLE);
        binding.recyclerView.setVisibility(View.GONE);
    }

    @Override
    public void onDestroyView()
    {
        super.onDestroyView();
        binding = null;
    }
}
