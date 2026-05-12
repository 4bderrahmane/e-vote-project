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
        viewModel.getElections().observe(getViewLifecycleOwner(), result ->
        {
            binding.swipeRefresh.setRefreshing(false);
            if (result == null)
            {
                showMessage("Loading elections...");
                return;
            }

            if (!result.isSuccess())
            {
                showMessage(result.errorMessage);
                return;
            }

            if (result.elections == null || result.elections.isEmpty())
            {
                showMessage("No elections available");
            } else
            {
                binding.tvEmpty.setVisibility(View.GONE);
                binding.recyclerView.setVisibility(View.VISIBLE);
                adapter.setElections(result.elections);
            }
        });
    }

    private void showMessage(String message)
    {
        binding.tvEmpty.setText(message);
        binding.tvEmpty.setVisibility(View.VISIBLE);
        binding.recyclerView.setVisibility(View.GONE);
        adapter.setElections(null);
    }

    private void onElectionClick(ElectionDto election)
    {
        if (election.getPublicId() == null)
        {
            Toast.makeText(requireContext(), "Election ID is missing", Toast.LENGTH_SHORT).show();
            return;
        }

        requireActivity().getSupportFragmentManager()
                .beginTransaction()
                .replace(((ViewGroup) requireView().getParent()).getId(), ElectionDetailFragment.newInstance(election.getPublicId()))
                .addToBackStack(null)
                .commit();
    }

    @Override
    public void onDestroyView()
    {
        super.onDestroyView();
        binding = null;
    }
}
