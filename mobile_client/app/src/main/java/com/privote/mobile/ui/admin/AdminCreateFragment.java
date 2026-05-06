package com.privote.mobile.ui.admin;

import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Toast;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.fragment.app.Fragment;
import androidx.lifecycle.ViewModelProvider;

import com.privote.mobile.auth.AuthManager;
import com.privote.mobile.databinding.FragmentAdminCreateBinding;
import com.privote.mobile.network.dto.ElectionCreateRequestDto;
import com.privote.mobile.network.dto.PartyCreateRequestDto;
import com.privote.mobile.viewmodel.AdminCreateViewModel;

import java.util.ArrayList;
import java.util.List;

public class AdminCreateFragment extends Fragment
{
    private FragmentAdminCreateBinding binding;
    private AdminCreateViewModel viewModel;

    @Nullable
    @Override
    public View onCreateView(@NonNull LayoutInflater inflater,
                             @Nullable ViewGroup container,
                             @Nullable Bundle savedInstanceState)
    {
        binding = FragmentAdminCreateBinding.inflate(inflater, container, false);
        return binding.getRoot();
    }

    @Override
    public void onViewCreated(@NonNull View view, @Nullable Bundle savedInstanceState)
    {
        super.onViewCreated(view, savedInstanceState);
        viewModel = new ViewModelProvider(this).get(AdminCreateViewModel.class);

        binding.inputElectionPhase.setText("REGISTRATION");
        binding.btnElectionMode.setOnClickListener(v -> showElectionForm());
        binding.btnPartyMode.setOnClickListener(v -> showPartyForm());
        binding.btnCreateElection.setOnClickListener(v -> createElection());
        binding.btnCreateParty.setOnClickListener(v -> createParty());
    }

    private void showElectionForm()
    {
        binding.electionForm.setVisibility(View.VISIBLE);
        binding.partyForm.setVisibility(View.GONE);
        binding.btnElectionMode.setBackgroundResource(com.privote.mobile.R.drawable.welcome_primary_button_bg);
        binding.btnElectionMode.setTextColor(getResources().getColor(com.privote.mobile.R.color.white, null));
        binding.btnPartyMode.setBackgroundResource(com.privote.mobile.R.drawable.welcome_outline_button_bg);
        binding.btnPartyMode.setTextColor(getResources().getColor(com.privote.mobile.R.color.welcome_text, null));
    }

    private void showPartyForm()
    {
        binding.electionForm.setVisibility(View.GONE);
        binding.partyForm.setVisibility(View.VISIBLE);
        binding.btnPartyMode.setBackgroundResource(com.privote.mobile.R.drawable.welcome_primary_button_bg);
        binding.btnPartyMode.setTextColor(getResources().getColor(com.privote.mobile.R.color.white, null));
        binding.btnElectionMode.setBackgroundResource(com.privote.mobile.R.drawable.welcome_outline_button_bg);
        binding.btnElectionMode.setTextColor(getResources().getColor(com.privote.mobile.R.color.welcome_text, null));
    }

    private void createElection()
    {
        String title = clean(binding.inputElectionTitle.getText().toString());
        String end = clean(binding.inputElectionEnd.getText().toString());
        String publicKeyHex = clean(binding.inputElectionPublicKey.getText().toString());
        String coordinatorId = AuthManager.getInstance(requireContext()).getUserId();

        if (title == null || end == null || publicKeyHex == null || coordinatorId == null)
        {
            showMessage("Title, end time, public key, and logged-in admin are required");
            return;
        }

        byte[] publicKey;
        try
        {
            publicKey = hexToBytes(publicKeyHex);
        } catch (IllegalArgumentException e)
        {
            showMessage(e.getMessage());
            return;
        }

        if (publicKey.length != 32)
        {
            showMessage("Encryption public key must be exactly 32 bytes / 64 hex characters");
            return;
        }

        ElectionCreateRequestDto request = new ElectionCreateRequestDto();
        request.title = title;
        request.description = clean(binding.inputElectionDescription.getText().toString());
        request.startTime = toInstant(clean(binding.inputElectionStart.getText().toString()));
        request.endTime = toInstant(end);
        request.phase = clean(binding.inputElectionPhase.getText().toString());
        request.coordinatorKeycloakId = coordinatorId;
        request.encryptionPublicKey = publicKey;

        if (request.endTime == null)
        {
            showMessage("End time must use YYYY-MM-DD HH:mm");
            return;
        }

        submitElection(request);
    }

    private void createParty()
    {
        String name = clean(binding.inputPartyName.getText().toString());
        List<String> memberCins = splitCsv(binding.inputPartyMemberCins.getText().toString());
        if (name == null || memberCins.isEmpty())
        {
            showMessage("Party name and at least one member CIN are required");
            return;
        }

        PartyCreateRequestDto request = new PartyCreateRequestDto();
        request.name = name;
        request.abbreviation = clean(binding.inputPartyAbbreviation.getText().toString());
        request.description = clean(binding.inputPartyDescription.getText().toString());
        request.memberCins = memberCins;
        submitParty(request);
    }

    private void submitElection(ElectionCreateRequestDto request)
    {
        binding.btnCreateElection.setEnabled(false);
        viewModel.createElection(request).observe(getViewLifecycleOwner(), result ->
        {
            binding.btnCreateElection.setEnabled(true);
            handleResult(result.getMessage(), result.getErrorMessage());
        });
    }

    private void submitParty(PartyCreateRequestDto request)
    {
        binding.btnCreateParty.setEnabled(false);
        viewModel.createParty(request).observe(getViewLifecycleOwner(), result ->
        {
            binding.btnCreateParty.setEnabled(true);
            handleResult(result.getMessage(), result.getErrorMessage());
        });
    }

    private void handleResult(String message, String error)
    {
        if (error != null)
        {
            showMessage(error);
            Toast.makeText(requireContext(), error, Toast.LENGTH_LONG).show();
            return;
        }

        showMessage(message);
        Toast.makeText(requireContext(), message, Toast.LENGTH_SHORT).show();
    }

    private void showMessage(String message)
    {
        binding.tvMessage.setText(message);
    }

    private static String toInstant(String input)
    {
        if (input == null) return null;
        if (!input.matches("\\d{4}-\\d{2}-\\d{2} \\d{2}:\\d{2}")) return null;
        return input.replace(' ', 'T') + ":00Z";
    }

    private static List<String> splitCsv(String raw)
    {
        List<String> values = new ArrayList<>();
        if (raw == null) return values;
        for (String part : raw.split(","))
        {
            String value = clean(part);
            if (value != null) values.add(value);
        }
        return values;
    }

    private static byte[] hexToBytes(String hex)
    {
        String normalized = hex.replaceFirst("(?i)^0x", "").replaceAll("\\s+", "");
        if (!normalized.matches("[0-9a-fA-F]+") || normalized.length() % 2 != 0)
        {
            throw new IllegalArgumentException("Public key must be an even-length hexadecimal string");
        }

        byte[] bytes = new byte[normalized.length() / 2];
        for (int i = 0; i < bytes.length; i++)
        {
            bytes[i] = (byte) Integer.parseInt(normalized.substring(i * 2, i * 2 + 2), 16);
        }
        return bytes;
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
