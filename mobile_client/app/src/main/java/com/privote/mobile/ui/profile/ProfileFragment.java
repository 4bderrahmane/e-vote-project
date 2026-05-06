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
                "Email: " + nonEmpty(profile.getEmail(), "-") + "\n"
                        + "CIN: " + nonEmpty(profile.getCin(), "-") + "\n"
                        + "Phone: " + nonEmpty(profile.getPhoneNumber(), "-") + "\n"
                        + "Address: " + nonEmpty(profile.getAddress(), "-") + "\n"
                        + "Region: " + nonEmpty(profile.getRegion(), "-") + "\n"
                        + "Birth place: " + nonEmpty(profile.getBirthPlace(), "-") + "\n"
                        + "Birth date: " + DateFormatUtils.date(profile.getBirthDate()) + "\n"
                        + "Email verified: " + (profile.isEmailVerified() ? "Yes" : "No")
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
        binding.inputFirstName.setText(emptyIfNull(profile.getFirstName()));
        binding.inputLastName.setText(emptyIfNull(profile.getLastName()));
        binding.inputEmail.setText(emptyIfNull(profile.getEmail()));
        binding.inputPhone.setText(emptyIfNull(profile.getPhoneNumber()));
        binding.inputAddress.setText(emptyIfNull(profile.getAddress()));
        binding.inputRegion.setText(emptyIfNull(profile.getRegion()));
        binding.inputBirthPlace.setText(emptyIfNull(profile.getBirthPlace()));
        binding.inputBirthDate.setText(emptyIfNull(profile.getBirthDate()));
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
        request.setFirstName(clean(binding.inputFirstName.getText().toString()));
        request.setLastName(clean(binding.inputLastName.getText().toString()));
        request.setEmail(clean(binding.inputEmail.getText().toString()));
        request.setPhoneNumber(clean(binding.inputPhone.getText().toString()));
        request.setAddress(clean(binding.inputAddress.getText().toString()));
        request.setRegion(clean(binding.inputRegion.getText().toString()));
        request.setBirthPlace(clean(binding.inputBirthPlace.getText().toString()));
        request.setBirthDate(birthDate);

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
        String firstName = nonEmpty(profile.getFirstName(), "");
        String lastName = nonEmpty(profile.getLastName(), "");
        String name = (firstName + " " + lastName).trim();
        return name.isEmpty() ? nonEmpty(profile.getUsername(), "Profile") : name;
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
