package com.privote.mobile.ui.profile;

import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Toast;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.fragment.app.Fragment;
import androidx.lifecycle.ViewModelProvider;

import com.privote.mobile.databinding.FragmentProfileBinding;
import com.privote.mobile.network.dto.CitizenDto;
import com.privote.mobile.network.dto.CitizenSelfUpdateRequestDto;
import com.privote.mobile.util.DateFormatUtils;
import com.privote.mobile.viewmodel.ProfileViewModel;

import java.util.regex.Pattern;

public class ProfileFragment extends Fragment
{
    private static final Pattern DATE_PATTERN = Pattern.compile("\\d{4}-\\d{2}-\\d{2}");

    private FragmentProfileBinding binding;
    private ProfileViewModel viewModel;
    private CitizenDto currentProfile;

    @Nullable
    @Override
    public View onCreateView(@NonNull LayoutInflater inflater,
                             @Nullable ViewGroup container,
                             @Nullable Bundle savedInstanceState)
    {
        binding = FragmentProfileBinding.inflate(inflater, container, false);
        return binding.getRoot();
    }

    @Override
    public void onViewCreated(@NonNull View view, @Nullable Bundle savedInstanceState)
    {
        super.onViewCreated(view, savedInstanceState);
        viewModel = new ViewModelProvider(this).get(ProfileViewModel.class);
        binding.swipeRefresh.setOnRefreshListener(() -> viewModel.refresh());
        binding.btnEdit.setOnClickListener(v -> showEditForm());
        binding.btnCancel.setOnClickListener(v -> hideEditForm());
        binding.btnSave.setOnClickListener(v -> saveProfile());

        showMessage("Loading profile...");
        viewModel.getProfile().observe(getViewLifecycleOwner(), result ->
        {
            binding.swipeRefresh.setRefreshing(false);
            if (result == null)
            {
                showMessage("Loading profile...");
                return;
            }

            if (!result.isSuccess())
            {
                setSaving(false);
                showMessage(result.errorMessage);
                Toast.makeText(requireContext(), result.errorMessage, Toast.LENGTH_SHORT).show();
                return;
            }

            if (result.profile == null)
            {
                setSaving(false);
                showMessage("Profile is empty");
                return;
            }

            setSaving(false);
            bindProfile(result.profile);
            hideEditForm();
        });
    }

    private void bindProfile(CitizenDto profile)
    {
        currentProfile = profile;
        binding.tvMessage.setVisibility(View.GONE);
        binding.tvName.setText(fullName(profile));
        binding.tvDetails.setText(
                "Email: " + nonEmpty(profile.email, "-") + "\n"
                        + "CIN: " + nonEmpty(profile.cin, "-") + "\n"
                        + "Phone: " + nonEmpty(profile.phoneNumber, "-") + "\n"
                        + "Address: " + nonEmpty(profile.address, "-") + "\n"
                        + "Region: " + nonEmpty(profile.region, "-") + "\n"
                        + "Birth place: " + nonEmpty(profile.birthPlace, "-") + "\n"
                        + "Birth date: " + DateFormatUtils.date(profile.birthDate) + "\n"
                        + "Email verified: " + (profile.emailVerified ? "Yes" : "No")
        );
        populateEditForm(profile);
    }

    private void showMessage(String message)
    {
        binding.tvMessage.setText(message);
        binding.tvMessage.setVisibility(View.VISIBLE);
    }

    private void showEditForm()
    {
        if (currentProfile != null)
        {
            populateEditForm(currentProfile);
        }
        binding.btnEdit.setVisibility(View.GONE);
        binding.editForm.setVisibility(View.VISIBLE);
    }

    private void hideEditForm()
    {
        binding.editForm.setVisibility(View.GONE);
        binding.btnEdit.setVisibility(View.VISIBLE);
    }

    private void populateEditForm(CitizenDto profile)
    {
        binding.inputFirstName.setText(emptyIfNull(profile.firstName));
        binding.inputLastName.setText(emptyIfNull(profile.lastName));
        binding.inputEmail.setText(emptyIfNull(profile.email));
        binding.inputPhone.setText(emptyIfNull(profile.phoneNumber));
        binding.inputAddress.setText(emptyIfNull(profile.address));
        binding.inputRegion.setText(emptyIfNull(profile.region));
        binding.inputBirthPlace.setText(emptyIfNull(profile.birthPlace));
        binding.inputBirthDate.setText(emptyIfNull(profile.birthDate));
    }

    private void saveProfile()
    {
        String birthDate = clean(binding.inputBirthDate.getText().toString());
        if (birthDate != null && !DATE_PATTERN.matcher(birthDate).matches())
        {
            Toast.makeText(requireContext(), "Birth date must use YYYY-MM-DD", Toast.LENGTH_SHORT).show();
            return;
        }

        CitizenSelfUpdateRequestDto request = new CitizenSelfUpdateRequestDto();
        request.firstName = clean(binding.inputFirstName.getText().toString());
        request.lastName = clean(binding.inputLastName.getText().toString());
        request.email = clean(binding.inputEmail.getText().toString());
        request.phoneNumber = clean(binding.inputPhone.getText().toString());
        request.address = clean(binding.inputAddress.getText().toString());
        request.region = clean(binding.inputRegion.getText().toString());
        request.birthPlace = clean(binding.inputBirthPlace.getText().toString());
        request.birthDate = birthDate;

        setSaving(true);
        viewModel.updateProfile(request);
    }

    private void setSaving(boolean saving)
    {
        binding.btnSave.setEnabled(!saving);
        binding.btnCancel.setEnabled(!saving);
        binding.btnSave.setText(saving ? "Saving..." : getString(com.privote.mobile.R.string.save));
    }

    private static String fullName(CitizenDto profile)
    {
        String firstName = nonEmpty(profile.firstName, "");
        String lastName = nonEmpty(profile.lastName, "");
        String name = (firstName + " " + lastName).trim();
        return name.isEmpty() ? nonEmpty(profile.username, "Profile") : name;
    }

    private static String nonEmpty(String value, String fallback)
    {
        return value == null || value.trim().isEmpty() ? fallback : value;
    }

    private static String emptyIfNull(String value)
    {
        return value == null ? "" : value;
    }

    private static String clean(String value)
    {
        String cleaned = value == null ? "" : value.trim();
        return cleaned.isEmpty() ? null : cleaned;
    }

    @Override
    public void onDestroyView()
    {
        super.onDestroyView();
        binding = null;
    }
}
