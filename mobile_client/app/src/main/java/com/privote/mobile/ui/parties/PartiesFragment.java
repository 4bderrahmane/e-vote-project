package com.privote.mobile.ui.parties;

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

import com.privote.mobile.databinding.FragmentPartiesBinding;
import com.privote.mobile.viewmodel.PartyViewModel;

public class PartiesFragment extends Fragment
{
    private FragmentPartiesBinding binding;

    private PartyAdapter adapter;

    @Nullable
    @Override
    public View onCreateView(@NonNull LayoutInflater inflater,
                             @Nullable ViewGroup container,
                             @Nullable Bundle savedInstanceState)
    {
        binding = FragmentPartiesBinding.inflate(inflater, container, false);
        return binding.getRoot();
    }

    @Override
    public void onViewCreated(@NonNull View view, @Nullable Bundle savedInstanceState)
    {
        PartyViewModel viewModel;
        super.onViewCreated(view, savedInstanceState);
        adapter = new PartyAdapter();
        binding.recyclerView.setLayoutManager(new LinearLayoutManager(requireContext()));
        binding.recyclerView.setAdapter(adapter);

        viewModel = new ViewModelProvider(this).get(PartyViewModel.class);
        binding.swipeRefresh.setOnRefreshListener(viewModel::refresh);

        showMessage("Loading parties...");
        viewModel.getParties().observe(getViewLifecycleOwner(), result ->
        {
            binding.swipeRefresh.setRefreshing(false);
            if (result == null)
            {
                showMessage("Loading parties...");
                return;
            }

            if (!result.isSuccess())
            {
                showMessage(result.errorMessage);
                Toast.makeText(requireContext(), result.errorMessage, Toast.LENGTH_SHORT).show();
                return;
            }

            if (result.parties == null || result.parties.isEmpty())
            {
                showMessage("No parties available");
                return;
            }

            binding.tvEmpty.setVisibility(View.GONE);
            binding.recyclerView.setVisibility(View.VISIBLE);
            adapter.setParties(result.parties);
        });
    }

    private void showMessage(String message)
    {
        adapter.setParties(null);
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
