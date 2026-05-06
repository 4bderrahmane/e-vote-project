package com.privote.mobile.repository;

import android.content.Context;
import android.util.Log;

import androidx.lifecycle.LiveData;
import androidx.lifecycle.MutableLiveData;

import com.privote.mobile.mopro.SemaphoreProver;
import com.privote.mobile.network.ApiClient;
import com.privote.mobile.network.ProofServiceClient;
import com.privote.mobile.network.dto.BallotCastRequestDto;
import com.privote.mobile.network.dto.BallotCastResponseDto;
import com.privote.mobile.network.dto.MerkleProofDto;
import com.privote.mobile.exception.AppError;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.ThreadFactory;
import java.util.concurrent.atomic.AtomicInteger;

import lombok.AllArgsConstructor;
import retrofit2.Call;
import retrofit2.Response;
import uniffi.mopro.SemaphoreMoproException;
import uniffi.mopro.SemaphoreProofResult;

public class VoteRepository
{
    private static final String TAG = "VoteRepository";
    private static final int SEMAPHORE_20_DEPTH = 20;
    private static final long MOPRO_THREAD_STACK_BYTES = 16L * 1024L * 1024L;

    public static class VoteCastResult
    {
        public final BallotCastResponseDto receipt;
        public final AppError error;
        public final String errorMessage;

        private VoteCastResult(BallotCastResponseDto receipt, AppError error)
        {
            this.receipt = receipt;
            this.error = error;
            this.errorMessage = error == null ? null : error.message;
        }

        public static VoteCastResult success(BallotCastResponseDto receipt)
        {
            return new VoteCastResult(receipt, null);
        }

        public static VoteCastResult failure(AppError error)
        {
            return new VoteCastResult(null, error);
        }

        public boolean isSuccess()
        {
            return errorMessage == null;
        }
    }

    @AllArgsConstructor
    public static class CastVoteRequest
    {
        public final UUID electionPublicId;
        public final String electionContractAddress;
        public final String externalNullifierDecimal;
        public final String identitySecretDecimal;
        public final String identityCommitmentDecimal;
        public final byte[] ciphertext;
    }

    private static final ExecutorService EXECUTOR = Executors.newSingleThreadExecutor(
            newLargeStackThreadFactory("mopro-proof")
    );

    private final ApiClient apiClient;
    private final ProofServiceClient proofServiceClient;
    private final SemaphoreProver prover;

    public VoteRepository(Context ctx)
    {
        this.apiClient = ApiClient.getInstance(ctx);
        this.proofServiceClient = ProofServiceClient.getInstance();
        this.prover = new SemaphoreProver(ctx);
    }

    public LiveData<VoteCastResult> castVote(CastVoteRequest request)
    {
        MutableLiveData<VoteCastResult> liveData = new MutableLiveData<>();
        EXECUTOR.execute(() -> liveData.postValue(castVoteBlocking(request)));
        return liveData;
    }

    private VoteCastResult castVoteBlocking(CastVoteRequest request)
    {
        MerkleProofDto merkleProof;
        try
        {
            merkleProof = fetchMerkleProof(request);
        }
        catch (IOException ex)
        {
            return VoteCastResult.failure(AppError.network("Merkle proof request", ex));
        }

        if (merkleProof == null)
        {
            return VoteCastResult.failure(AppError.validation("Merkle proof response was empty"));
        }

        if (merkleProof.expectedDepth == null || merkleProof.siblings == null || merkleProof.index == null)
        {
            return VoteCastResult.failure(AppError.validation("Merkle proof response is missing required fields"));
        }

        if (request.identityCommitmentDecimal != null
                && merkleProof.leaf != null
                && !request.identityCommitmentDecimal.equals(merkleProof.leaf))
        {
            return VoteCastResult.failure(AppError.validation(
                    "Merkle proof leaf does not match registered identity commitment"
            ));
        }

        SemaphoreProofResult proof;
        try
        {
            List<String> siblings = padSiblingsForSemaphore20(merkleProof.siblings);
            proof = prover.proveVote(
                    request.identitySecretDecimal,
                    Integer.toString(merkleProof.expectedDepth),
                    Long.toString(merkleProof.index),
                    siblings,
                    request.ciphertext,
                    request.externalNullifierDecimal
            );
        }
        catch (SemaphoreMoproException | IOException | RuntimeException ex)
        {
            Log.e(TAG, "Proof generation failed", ex);
            return VoteCastResult.failure(AppError.proof("Proof generation", ex));
        }

        String nullifier = extractNullifier(proof);
        if (nullifier == null)
        {
            return VoteCastResult.failure(AppError.validation("Proof generation returned no nullifier"));
        }

        BallotCastRequestDto ballot = new BallotCastRequestDto(
                request.ciphertext,
                nullifier,
                proof.getProofPoints()
        );

        try
        {
            Call<BallotCastResponseDto> call = apiClient.api().castVote(request.electionPublicId, ballot);
            Response<BallotCastResponseDto> response = call.execute();
            if (!response.isSuccessful() || response.body() == null)
            {
                return VoteCastResult.failure(AppError.http("Cast vote", response.code()));
            }
            return VoteCastResult.success(response.body());
        }
        catch (IOException ex)
        {
            return VoteCastResult.failure(AppError.network("Cast vote", ex));
        }
    }

    private MerkleProofDto fetchMerkleProof(CastVoteRequest request) throws IOException
    {
        String address = request.electionContractAddress == null
                ? null
                : request.electionContractAddress.toLowerCase();

        Response<MerkleProofDto> response = proofServiceClient
                .api()
                .getMerkleProof(address, request.identityCommitmentDecimal)
                .execute();

        if (!response.isSuccessful())
        {
            throw new IOException("HTTP " + response.code());
        }

        return response.body();
    }

    /**
     * Public signals are ordered as
     * {@code [merkleRoot, nullifier, messageHash, scopeHash]} by the Mopro Rust side.
     */
    private static String extractNullifier(SemaphoreProofResult proof)
    {
        if (proof.getPublicInputs() == null || proof.getPublicInputs().size() < 2)
        {
            return null;
        }
        return proof.getPublicInputs().get(1);
    }

    private static List<String> padSiblingsForSemaphore20(List<String> siblings)
    {
        if (siblings.size() > SEMAPHORE_20_DEPTH)
        {
            throw new IllegalArgumentException(
                    "Merkle proof has more than " + SEMAPHORE_20_DEPTH + " siblings"
            );
        }

        ArrayList<String> padded = new ArrayList<>(SEMAPHORE_20_DEPTH);
        padded.addAll(siblings);
        while (padded.size() < SEMAPHORE_20_DEPTH)
        {
            padded.add("0");
        }
        return padded;
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
}
