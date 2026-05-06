package com.privote.mobile.ui.myvotes;

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

import com.privote.mobile.databinding.FragmentMyVotesBinding;
import com.privote.mobile.viewmodel.MyVotesViewModel;

public class MyVotesFragment extends Fragment
{
    private FragmentMyVotesBinding binding;

    private MyVotesAdapter adapter;

    @Nullable
    @Override
    public View onCreateView(@NonNull LayoutInflater inflater,
                             @Nullable ViewGroup container,
                             @Nullable Bundle savedInstanceState)
    {
        binding = FragmentMyVotesBinding.inflate(inflater, container, false);
        return binding.getRoot();
    }

    @Override
    public void onViewCreated(@NonNull View view, @Nullable Bundle savedInstanceState)
    {
        MyVotesViewModel viewModel;
        super.onViewCreated(view, savedInstanceState);
        adapter = new MyVotesAdapter();
        binding.recyclerView.setLayoutManager(new LinearLayoutManager(requireContext()));
        binding.recyclerView.setAdapter(adapter);

        viewModel = new ViewModelProvider(this).get(MyVotesViewModel.class);
        binding.swipeRefresh.setOnRefreshListener(viewModel::refresh);

        showMessage("Loading votes...");
        viewModel.getMyVotes().observe(getViewLifecycleOwner(), result ->
        {
            binding.swipeRefresh.setRefreshing(false);
            if (result == null)
            {
                showMessage("Loading votes...");
                return;
            }

            if (!result.isSuccess())
            {
                showMessage(result.errorMessage);
                Toast.makeText(requireContext(), result.errorMessage, Toast.LENGTH_SHORT).show();
                return;
            }

            if (result.votes == null || result.votes.isEmpty())
            {
                showMessage("No vote records available");
                return;
            }

            binding.tvEmpty.setVisibility(View.GONE);
            binding.recyclerView.setVisibility(View.VISIBLE);
            adapter.setVotes(result.votes);
        });
    }

    private void showMessage(String message)
    {
        adapter.setVotes(null);
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
