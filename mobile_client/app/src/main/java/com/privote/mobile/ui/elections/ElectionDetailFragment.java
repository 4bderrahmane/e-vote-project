package com.privote.mobile.ui.elections;

import android.content.Context;
import android.os.Bundle;
import android.os.Handler;
import android.os.Looper;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.TextView;
import android.widget.Toast;

import androidx.core.content.ContextCompat;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.fragment.app.Fragment;
import androidx.recyclerview.widget.LinearLayoutManager;

import com.privote.mobile.auth.AuthManager;
import com.privote.mobile.crypto.ElectionPayloadEncryptor;
import com.privote.mobile.databinding.FragmentElectionDetailBinding;
import com.privote.mobile.exception.AppError;
import com.privote.mobile.exception.ElectionPayloadEncryptionException;
import com.privote.mobile.mopro.IdentityDeriver;
import com.privote.mobile.network.dto.CandidateDto;
import com.privote.mobile.network.dto.ElectionDto;
import com.privote.mobile.network.dto.VoterRegistrationDto;
import com.privote.mobile.repository.CandidateRepository;
import com.privote.mobile.repository.ElectionRepository;
import com.privote.mobile.repository.VoteRepository;
import com.privote.mobile.repository.VoterRegistrationRepository;
import com.privote.mobile.util.DateFormatUtils;

import java.nio.charset.StandardCharsets;
import java.util.UUID;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.ThreadFactory;
import java.util.concurrent.atomic.AtomicInteger;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import uniffi.mopro.SemaphoreIdentity;
import uniffi.mopro.SemaphoreMoproException;

public class ElectionDetailFragment extends Fragment
{
    private static final String ARG_ELECTION_ID = "election_id";
    private static final String NEEDS_REGISTRATION_MESSAGE = "You must register before voting.";
    private static final String TAG = "ElectionDetail";
    private static final long MOPRO_THREAD_STACK_BYTES = 16L * 1024L * 1024L;

    private FragmentElectionDetailBinding binding;
    private ElectionRepository electionRepository;
    private CandidateRepository candidateRepository;
    private VoterRegistrationRepository registrationRepository;
    private VoteRepository voteRepository;
    private CandidateAdapter candidateAdapter;
    private UUID electionId;
    private ElectionDto currentElection;
    private VoterRegistrationDto currentRegistration;
    private ExecutorService backgroundExecutor;
    private final Handler mainHandler = new Handler(Looper.getMainLooper());

    @AllArgsConstructor(access = AccessLevel.PRIVATE)
    private static final class ElectionUiState
    {
        private final boolean registrationPhase;
        private final boolean votingPhase;
        private final boolean registered;
        private final boolean voteCast;
        private final boolean adminCanStart;
    }

    @AllArgsConstructor(access = AccessLevel.PRIVATE)
    private static final class VotePreparationData
    {
        private final UUID electionPublicId;
        private final String contractAddress;
        private final String externalNullifier;
        private final String encryptionPublicKey;
        private final String registeredCommitment;
        private final String passphrase;
        private final String userId;
        private final UUID candidatePublicId;
    }

    public static ElectionDetailFragment newInstance(UUID electionId)
    {
        ElectionDetailFragment fragment = new ElectionDetailFragment();
        Bundle args = new Bundle();
        args.putString(ARG_ELECTION_ID, electionId.toString());
        fragment.setArguments(args);
        return fragment;
    }

    @Nullable
    @Override
    public View onCreateView(@NonNull LayoutInflater inflater,
                             @Nullable ViewGroup container,
                             @Nullable Bundle savedInstanceState)
    {
        binding = FragmentElectionDetailBinding.inflate(inflater, container, false);
        return binding.getRoot();
    }

    @Override
    public void onViewCreated(@NonNull View view, @Nullable Bundle savedInstanceState)
    {
        super.onViewCreated(view, savedInstanceState);
        electionId = UUID.fromString(requireArguments().getString(ARG_ELECTION_ID));
        electionRepository = new ElectionRepository(requireContext());
        candidateRepository = new CandidateRepository(requireContext());
        registrationRepository = new VoterRegistrationRepository(requireContext());
        voteRepository = new VoteRepository(requireContext());
        candidateAdapter = new CandidateAdapter(candidate -> clearVoteMessage());
        backgroundExecutor = Executors.newSingleThreadExecutor(newLargeStackThreadFactory("mopro-identity"));

        binding.btnBack.setOnClickListener(v -> requireActivity().getSupportFragmentManager().popBackStack());
        binding.swipeRefresh.setOnRefreshListener(this::loadElection);
        binding.recyclerCandidates.setLayoutManager(new LinearLayoutManager(requireContext()));
        binding.recyclerCandidates.setAdapter(candidateAdapter);
        binding.btnRegister.setOnClickListener(v -> registerToVote());
        binding.btnCastVote.setOnClickListener(v -> castVote());
        binding.btnStartElection.setOnClickListener(v -> startVoting());

        showMessage("Loading election...");
        loadElection();
    }

    private void loadElection()
    {
        electionRepository.getElection(electionId).observe(getViewLifecycleOwner(), result ->
        {
            binding.swipeRefresh.setRefreshing(false);
            if (result == null)
            {
                showMessage("Loading election...");
                return;
            }

            if (!result.isSuccess())
            {
                showMessage(result.errorMessage);
                Toast.makeText(requireContext(), result.errorMessage, Toast.LENGTH_SHORT).show();
                return;
            }

            if (result.election == null)
            {
                showMessage("Election not found");
                return;
            }

            bindElection(result.election);
            loadRegistration();
            if (isVotingPhase(result.election) || currentRegistration != null)
            {
                loadCandidates();
            }
            else
            {
                candidateAdapter.setCandidates(null);
                binding.tvCandidatesEmpty.setVisibility(View.GONE);
            }
        });
    }

    private void bindElection(ElectionDto election)
    {
        currentElection = election;
        binding.tvMessage.setVisibility(View.GONE);
        binding.tvTitle.setText(nonEmpty(election.getTitle(), "Untitled election"));
        String phase = nonEmpty(election.getPhase(), "UNKNOWN");
        binding.tvPhase.setText(phase);
        applyPhaseChip(binding.tvPhase, phase);
        binding.tvDescription.setText(nonEmpty(election.getDescription(), "No description"));
        binding.tvDetails.setText(
                "Public ID: " + value(election.getPublicId() == null ? null : election.getPublicId().toString()) + "\n"
                        + "Start time: " + DateFormatUtils.dateTime(election.getStartTime()) + "\n"
                        + "End time: " + DateFormatUtils.dateTime(election.getEndTime()) + "\n"
                        + "Contract address: " + value(election.getContractAddress()) + "\n"
                        + "Created at: " + DateFormatUtils.dateTime(election.getCreatedAt()) + "\n"
                        + "Updated at: " + DateFormatUtils.dateTime(election.getUpdatedAt())
        );
        updateCards();
    }

    private void loadRegistration()
    {
        registrationRepository.getMyRegistration(electionId).observe(getViewLifecycleOwner(), result ->
        {
            if (result == null)
            {
                return;
            }

            if (result.notFound)
            {
                currentRegistration = null;
                updateCards();
                return;
            }

            if (!result.isSuccess())
            {
                currentRegistration = null;
                showRegisterMessage(result.errorMessage);
                updateCards();
                return;
            }

            currentRegistration = result.registration;
            if (currentRegistration != null)
            {
                loadCandidates();
            }
            updateCards();
        });
    }

    private void loadCandidates()
    {
        binding.tvCandidatesEmpty.setText("Loading candidates...");
        binding.tvCandidatesEmpty.setVisibility(View.VISIBLE);

        candidateRepository.getActiveCandidates(electionId).observe(getViewLifecycleOwner(), result ->
        {
            if (result == null)
            {
                return;
            }

            if (!result.isSuccess())
            {
                candidateAdapter.setCandidates(null);
                binding.tvCandidatesEmpty.setText(result.errorMessage);
                binding.tvCandidatesEmpty.setVisibility(View.VISIBLE);
                return;
            }

            candidateAdapter.setCandidates(result.candidates);
            boolean empty = result.candidates == null || result.candidates.isEmpty();
            binding.tvCandidatesEmpty.setText("No active candidates are available.");
            binding.tvCandidatesEmpty.setVisibility(empty ? View.VISIBLE : View.GONE);
        });
    }

    private void updateCards()
    {
        if (binding == null || currentElection == null)
        {
            return;
        }

        ElectionUiState state = buildElectionUiState();
        applyCardVisibility(state);
        applyRegistrationControls(state);
        applyVotingControls(state);
        applyContextMessages(state);
    }

    private ElectionUiState buildElectionUiState()
    {
        boolean registrationPhase = isRegistrationPhase(currentElection);
        boolean votingPhase = isVotingPhase(currentElection);
        boolean registered = currentRegistration != null;
        boolean voteCast = registered && "CAST".equalsIgnoreCase(currentRegistration.getParticipationStatus());
        boolean adminCanStart = isAdminMode()
                && registrationPhase
                && currentElection.getContractAddress() != null
                && !currentElection.getContractAddress().trim().isEmpty();
        return new ElectionUiState(registrationPhase, votingPhase, registered, voteCast, adminCanStart);
    }

    private void applyCardVisibility(ElectionUiState state)
    {
        binding.registerCard.setVisibility((state.registrationPhase || state.registered) ? View.VISIBLE : View.GONE);
        binding.voteCard.setVisibility(state.registered && !state.voteCast ? View.VISIBLE : View.GONE);
        binding.btnStartElection.setVisibility(state.adminCanStart ? View.VISIBLE : View.GONE);
        binding.btnStartElection.setEnabled(state.adminCanStart);
        binding.btnStartElection.setText(getString(com.privote.mobile.R.string.start_voting_button));
    }

    private void applyRegistrationControls(ElectionUiState state)
    {
        binding.tvRegisterStatus.setText(state.registered
                ? formatRegistrationStatus(currentRegistration)
                : getString(com.privote.mobile.R.string.register_status_not_registered));
        binding.btnRegister.setEnabled(state.registrationPhase && !state.registered);
        binding.btnRegister.setText(state.registered
                ? getString(com.privote.mobile.R.string.register_status_registered)
                : getString(com.privote.mobile.R.string.register_button));
        binding.inputRegisterPassphrase.setEnabled(state.registrationPhase && !state.registered);
    }

    private void applyVotingControls(ElectionUiState state)
    {
        boolean canCastVote = state.votingPhase && state.registered && !state.voteCast;
        binding.btnCastVote.setEnabled(canCastVote);
        binding.btnCastVote.setText(state.voteCast
                ? "Vote cast"
                : getString(com.privote.mobile.R.string.vote_button));
        binding.inputVotePassphrase.setEnabled(canCastVote);
    }

    private void applyContextMessages(ElectionUiState state)
    {
        if (state.registered && !state.votingPhase && !state.voteCast)
        {
            showVoteMessage(getString(com.privote.mobile.R.string.vote_waiting_for_start));
        }

        if (state.votingPhase && !state.registered)
        {
            showMessage(NEEDS_REGISTRATION_MESSAGE);
        }
        else if (binding.tvMessage.getVisibility() == View.VISIBLE
                && NEEDS_REGISTRATION_MESSAGE.contentEquals(binding.tvMessage.getText()))
        {
            binding.tvMessage.setVisibility(View.GONE);
        }

        if (state.voteCast)
        {
            showVoteMessage(getString(com.privote.mobile.R.string.vote_already_cast));
        }
    }

    private void registerToVote()
    {
        if (currentElection == null || !isRegistrationPhase(currentElection))
        {
            showRegisterMessage("Registration is not open for this election.");
            return;
        }

        String passphrase = binding.inputRegisterPassphrase.getText().toString();
        if (passphrase.isEmpty())
        {
            showRegisterMessage("Passphrase is required.");
            return;
        }

        String userId = AuthManager.getInstance(requireContext()).getUserId();
        if (userId == null || userId.isEmpty())
        {
            showRegisterMessage("You must be logged in to register.");
            return;
        }

        if (currentElection.getExternalNullifier() == null || currentElection.getExternalNullifier().isEmpty())
        {
            showRegisterMessage("Election is not ready for registration yet (no external nullifier).");
            return;
        }

        binding.btnRegister.setEnabled(false);
        binding.btnRegister.setText(getString(com.privote.mobile.R.string.register_button_busy));
        showRegisterMessage("Deriving identity on-device…");

        String externalNullifier = currentElection.getExternalNullifier();
        backgroundExecutor.execute(() ->
        {
            try
            {
                SemaphoreIdentity identity = IdentityDeriver.derive(passphrase, userId, externalNullifier);
                mainHandler.post(() -> submitCommitment(identity.getCommitmentDecimal()));
            }
            catch (SemaphoreMoproException | RuntimeException ex)
            {
                Log.e(TAG, "Registration identity derivation failed", ex);
                String message = AppError.crypto("Identity derivation", ex).message;
                mainHandler.post(() ->
                {
                    if (binding == null) return;
                    showRegisterMessage(message);
                    updateCards();
                });
            }
        });
    }

    private void submitCommitment(String commitment)
    {
        if (binding == null) return;
        showRegisterMessage("Submitting registration…");

        registrationRepository.register(electionId, commitment).observe(getViewLifecycleOwner(), result ->
        {
            if (result == null) return;

            if (!result.isSuccess())
            {
                showRegisterMessage(result.errorMessage);
                updateCards();
                return;
            }

            currentRegistration = result.registration;
            binding.inputRegisterPassphrase.setText("");
            showRegisterMessage("Registration confirmed.");
            loadCandidates();
            updateCards();
        });
    }

    private void startVoting()
    {
        if (currentElection == null || currentElection.getPublicId() == null)
        {
            showAdminMessage("Election is not loaded.");
            return;
        }

        binding.btnStartElection.setEnabled(false);
        binding.btnStartElection.setText("Starting voting…");
        showAdminMessage("Starting election on chain…");

        electionRepository.startElection(currentElection.getPublicId()).observe(getViewLifecycleOwner(), result ->
        {
            if (result == null) return;

            if (!result.isSuccess() || result.election == null)
            {
                showAdminMessage(result.errorMessage);
                updateCards();
                return;
            }

            bindElection(result.election);
            showAdminMessage("Voting is open.");
            loadRegistration();
            loadCandidates();
        });
    }

    private void castVote()
    {
        VotePreparationData data = collectVotePreparationData();
        if (data == null) return;
        binding.btnCastVote.setEnabled(false);
        binding.btnCastVote.setText(getString(com.privote.mobile.R.string.vote_button_busy));
        showVoteMessage("Deriving identity on-device…");
        backgroundExecutor.execute(() -> prepareAndSubmitVote(data));
    }

    private VotePreparationData collectVotePreparationData()
    {
        if (currentElection == null || !isVotingPhase(currentElection))
        {
            showVoteMessage("Voting is not open for this election.");
            return null;
        }
        if (currentRegistration == null)
        {
            showVoteMessage("Register before casting a vote.");
            return null;
        }

        CandidateDto candidate = candidateAdapter.getSelected();
        if (candidate == null || candidate.getPublicId() == null)
        {
            showVoteMessage("Select a candidate.");
            return null;
        }

        String passphrase = binding.inputVotePassphrase.getText().toString();
        if (passphrase.isEmpty())
        {
            showVoteMessage("Passphrase is required.");
            return null;
        }

        String userId = AuthManager.getInstance(requireContext()).getUserId();
        if (userId == null || userId.isEmpty())
        {
            showVoteMessage("You must be logged in to vote.");
            return null;
        }

        if (currentElection.getPublicId() == null
                || currentElection.getContractAddress() == null
                || currentElection.getExternalNullifier() == null
                || currentElection.getExternalNullifier().isEmpty())
        {
            showVoteMessage("Election is missing voting metadata.");
            return null;
        }

        if (currentElection.getEncryptionPublicKey() == null || currentElection.getEncryptionPublicKey().trim().isEmpty())
        {
            showVoteMessage("Election encryption public key is missing.");
            return null;
        }

        return new VotePreparationData(
                currentElection.getPublicId(),
                currentElection.getContractAddress(),
                currentElection.getExternalNullifier(),
                currentElection.getEncryptionPublicKey(),
                currentRegistration.getIdentityCommitment(),
                passphrase,
                userId,
                candidate.getPublicId()
        );
    }

    private void prepareAndSubmitVote(VotePreparationData data)
    {
        try
        {
            SemaphoreIdentity identity = IdentityDeriver.derive(
                    data.passphrase,
                    data.userId,
                    data.externalNullifier
            );
            if (!matchesRegisteredCommitment(data.registeredCommitment, identity.getCommitmentDecimal()))
            {
                postVotePreparationError("Passphrase does not match the identity registered for this election.");
                return;
            }

            byte[] ciphertext = ElectionPayloadEncryptor.encryptCandidateSelection(
                    data.candidatePublicId,
                    data.electionPublicId,
                    data.encryptionPublicKey
            );

            VoteRepository.CastVoteRequest request = new VoteRepository.CastVoteRequest(
                    data.electionPublicId,
                    data.contractAddress,
                    data.externalNullifier,
                    identity.getSecretDecimal(),
                    identity.getCommitmentDecimal(),
                    ciphertext
            );
            mainHandler.post(() -> submitVote(request));
        }
        catch (ElectionPayloadEncryptionException | SemaphoreMoproException | RuntimeException ex)
        {
            Log.e(TAG, "Vote preparation failed", ex);
            postVotePreparationError(AppError.crypto("Vote preparation", ex).message);
        }
    }

    private static boolean matchesRegisteredCommitment(String registeredCommitment, String derivedCommitment)
    {
        return registeredCommitment == null
                || registeredCommitment.isEmpty()
                || registeredCommitment.equals(derivedCommitment);
    }

    private void postVotePreparationError(String message)
    {
        mainHandler.post(() ->
        {
            if (binding == null) return;
            showVoteMessage(message);
            updateCards();
        });
    }

    private void submitVote(VoteRepository.CastVoteRequest request)
    {
        if (binding == null) return;
        showVoteMessage("Generating proof and casting vote…");

        voteRepository.castVote(request).observe(getViewLifecycleOwner(), result ->
        {
            if (result == null) return;

            if (!result.isSuccess())
            {
                showVoteMessage(result.errorMessage);
                updateCards();
                return;
            }

            binding.inputVotePassphrase.setText("");
            showVoteMessage("Vote submitted. Transaction: " + value(result.receipt.getTransactionHash()));
            loadRegistration();
        });
    }

    private void showRegisterMessage(String message)
    {
        binding.tvRegisterMessage.setText(message);
        binding.tvRegisterMessage.setVisibility(View.VISIBLE);
    }

    private void showVoteMessage(String message)
    {
        binding.tvVoteMessage.setText(message);
        binding.tvVoteMessage.setVisibility(View.VISIBLE);
    }

    private void showAdminMessage(String message)
    {
        binding.tvAdminMessage.setText(message);
        binding.tvAdminMessage.setVisibility(View.VISIBLE);
    }

    private void clearVoteMessage()
    {
        binding.tvVoteMessage.setVisibility(View.GONE);
    }

    private void showMessage(String message)
    {
        binding.tvMessage.setText(message);
        binding.tvMessage.setVisibility(View.VISIBLE);
    }

    private static boolean isRegistrationPhase(ElectionDto election)
    {
        return election != null && "REGISTRATION".equalsIgnoreCase(election.getPhase());
    }

    private static boolean isVotingPhase(ElectionDto election)
    {
        return election != null && "VOTING".equalsIgnoreCase(election.getPhase());
    }

    private boolean isAdminMode()
    {
        return AuthManager.getInstance(requireContext()).getActiveRole() == AuthManager.AppRole.ADMIN;
    }

    private static String formatRegistrationStatus(VoterRegistrationDto registration)
    {
        String participation = registration == null ? null : registration.getParticipationStatus();
        String commitment = registration == null ? null : registration.getCommitmentStatus();
        String status = nonEmpty(participation, "REGISTERED");
        if (commitment != null && !commitment.trim().isEmpty())
        {
            status += " / " + commitment;
        }
        return status.replace('_', ' ');
    }

    private static void applyPhaseChip(TextView chip, String phase)
    {
        Context ctx = chip.getContext();
        if ("VOTING".equalsIgnoreCase(phase))
        {
            chip.setBackgroundResource(com.privote.mobile.R.drawable.chip_success_bg);
            chip.setTextColor(ContextCompat.getColor(ctx, com.privote.mobile.R.color.phase_vote_text));
        }
        else if ("TALLY".equalsIgnoreCase(phase))
        {
            chip.setBackgroundResource(com.privote.mobile.R.drawable.chip_warning_bg);
            chip.setTextColor(ContextCompat.getColor(ctx, com.privote.mobile.R.color.phase_tally_text));
        }
        else
        {
            chip.setBackgroundResource(com.privote.mobile.R.drawable.chip_neutral_bg);
            chip.setTextColor(ContextCompat.getColor(ctx, com.privote.mobile.R.color.phase_reg_text));
        }
    }

    private static String value(String value)
    {
        return nonEmpty(value, "-");
    }

    private static String nonEmpty(String value, String fallback)
    {
        return value == null || value.trim().isEmpty() ? fallback : value;
    }

    private static ThreadFactory newLargeStackThreadFactory(String namePrefix)
    {
        AtomicInteger nextId = new AtomicInteger(1);
        return runnable ->
        {
            Thread thread = new Thread(
                    null,
                    runnable,
                    namePrefix + "-" + nextId.getAndIncrement(),
                    MOPRO_THREAD_STACK_BYTES
            );
            thread.setDaemon(false);
            return thread;
        };
    }

    @Override
    public void onDestroyView()
    {
        super.onDestroyView();
        binding = null;
    }

    @Override
    public void onDestroy()
    {
        super.onDestroy();
        if (backgroundExecutor != null)
        {
            backgroundExecutor.shutdown();
            backgroundExecutor = null;
        }
    }
}
