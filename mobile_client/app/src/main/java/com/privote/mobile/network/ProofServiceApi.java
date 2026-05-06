package com.privote.mobile.network;

import com.privote.mobile.network.dto.MerkleProofDto;

import retrofit2.Call;
import retrofit2.http.GET;
import retrofit2.http.Path;
import retrofit2.http.Query;

public interface ProofServiceApi
{
    @GET("elections/{address}/proof")
    Call<MerkleProofDto> getMerkleProof(
            @Path("address") String electionAddress,
            @Query("commitment") String commitmentDecimal
    );
}
