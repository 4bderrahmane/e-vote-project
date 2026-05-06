package com.privote.mobile.ui;

import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.fragment.app.Fragment;

import com.privote.mobile.databinding.FragmentPlaceholderBinding;

public class PlaceholderFragment extends Fragment
{
    private static final String ARG_TITLE = "title";
    private static final String ARG_DESCRIPTION = "description";

    private FragmentPlaceholderBinding binding;

    public static PlaceholderFragment newInstance(String title, String description)
    {
        PlaceholderFragment fragment = new PlaceholderFragment();
        Bundle args = new Bundle();
        args.putString(ARG_TITLE, title);
        args.putString(ARG_DESCRIPTION, description);
        fragment.setArguments(args);
        return fragment;
    }

    @Nullable
    @Override
    public View onCreateView(@NonNull LayoutInflater inflater,
                             @Nullable ViewGroup container,
                             @Nullable Bundle savedInstanceState)
    {
        binding = FragmentPlaceholderBinding.inflate(inflater, container, false);
        return binding.getRoot();
    }

    @Override
    public void onViewCreated(@NonNull View view, @Nullable Bundle savedInstanceState)
    {
        super.onViewCreated(view, savedInstanceState);
        Bundle args = requireArguments();
        binding.tvTitle.setText(args.getString(ARG_TITLE));
        binding.tvDescription.setText(args.getString(ARG_DESCRIPTION));
    }

    @Override
    public void onDestroyView()
    {
        super.onDestroyView();
        binding = null;
    }
}
