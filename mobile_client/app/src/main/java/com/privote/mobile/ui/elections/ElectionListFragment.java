package com.privote.mobile.ui.elections;

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

import com.privote.mobile.databinding.FragmentElectionListBinding;
import com.privote.mobile.network.dto.ElectionDto;
import com.privote.mobile.viewmodel.ElectionViewModel;

public class ElectionListFragment extends Fragment
{

    private FragmentElectionListBinding binding;
    private ElectionViewModel viewModel;
    private ElectionAdapter adapter;

    @Nullable
    @Override
    public View onCreateView(@NonNull LayoutInflater inflater,
                             @Nullable ViewGroup container,
                             @Nullable Bundle savedInstanceState)
    {
        binding = FragmentElectionListBinding.inflate(inflater, container, false);
        return binding.getRoot();
    }

    @Override
    public void onViewCreated(@NonNull View view, @Nullable Bundle savedInstanceState)
    {
        super.onViewCreated(view, savedInstanceState);

        adapter = new ElectionAdapter(this::onElectionClick);
        binding.recyclerView.setLayoutManager(new LinearLayoutManager(requireContext()));
        binding.recyclerView.setAdapter(adapter);

        binding.swipeRefresh.setOnRefreshListener(() -> viewModel.refresh());

        viewModel = new ViewModelProvider(this).get(ElectionViewModel.class);
        viewModel.getElections().observe(getViewLifecycleOwner(), elections ->
        {
            binding.swipeRefresh.setRefreshing(false);
            if (elections == null)
            {
                binding.tvEmpty.setVisibility(View.VISIBLE);
                binding.recyclerView.setVisibility(View.GONE);
                Toast.makeText(requireContext(), "Failed to load elections", Toast.LENGTH_SHORT).show();
            } else if (elections.isEmpty())
            {
                binding.tvEmpty.setVisibility(View.VISIBLE);
                binding.recyclerView.setVisibility(View.GONE);
            } else
            {
                binding.tvEmpty.setVisibility(View.GONE);
                binding.recyclerView.setVisibility(View.VISIBLE);
                adapter.setElections(elections);
            }
        });
    }

    private void onElectionClick(ElectionDto election)
    {
        // TODO: navigate to ElectionDetailFragment
        Toast.makeText(requireContext(), election.title, Toast.LENGTH_SHORT).show();
    }

    @Override
    public void onDestroyView()
    {
        super.onDestroyView();
        binding = null;
    }
}
