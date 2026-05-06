package com.privote.mobile.network;

import com.privote.mobile.network.dto.BallotCastRequestDto;
import com.privote.mobile.network.dto.BallotCastResponseDto;
import com.privote.mobile.network.dto.CandidateDto;
import com.privote.mobile.network.dto.CitizenDto;
import com.privote.mobile.network.dto.CitizenSelfUpdateRequestDto;
import com.privote.mobile.network.dto.ElectionCreateRequestDto;
import com.privote.mobile.network.dto.ElectionDto;
import com.privote.mobile.network.dto.ElectionResultDto;
import com.privote.mobile.network.dto.PartyCreateRequestDto;
import com.privote.mobile.network.dto.PartyDto;
import com.privote.mobile.network.dto.VoterRegistrationDto;
import com.privote.mobile.network.dto.VoterRegistrationRequestDto;

import java.util.List;
import java.util.UUID;

import retrofit2.Call;
import retrofit2.http.Body;
import retrofit2.http.GET;
import retrofit2.http.PATCH;
import retrofit2.http.POST;
import retrofit2.http.Path;

public interface ApiService
{
    @GET("api/users/me")
    Call<CitizenDto> getMe();

    @PATCH("api/users/me")
    Call<CitizenDto> updateMe(@Body CitizenSelfUpdateRequestDto request);


    @GET("api/elections")
    Call<List<ElectionDto>> getElections();

    @GET("api/elections/{uuid}")
    Call<ElectionDto> getElection(@Path("uuid") UUID uuid);

    @POST("api/elections/{uuid}/start")
    Call<ElectionDto> startElection(@Path("uuid") UUID uuid);

    @POST("api/elections/create")
    Call<ElectionDto> createElection(@Body ElectionCreateRequestDto request);

    @POST("api/parties/create")
    Call<PartyDto> createParty(@Body PartyCreateRequestDto request);

    @GET("api/parties")
    Call<List<PartyDto>> getParties();

    @GET("api/elections/{uuid}/candidates/active")
    Call<List<CandidateDto>> getActiveCandidates(@Path("uuid") UUID electionUuid);

    @POST("api/elections/{uuid}/registrations/me")
    Call<VoterRegistrationDto> registerToVote(
            @Path("uuid") UUID electionUuid,
            @Body VoterRegistrationRequestDto request
    );

    @GET("api/elections/{uuid}/registrations/me")
    Call<VoterRegistrationDto> getMyRegistration(@Path("uuid") UUID electionUuid);

    @POST("api/elections/{uuid}/votes/me")
    Call<BallotCastResponseDto> castVote(
            @Path("uuid") UUID electionUuid,
            @Body BallotCastRequestDto request
    );

    @GET("api/elections/{uuid}/results")
    Call<ElectionResultDto> getResults(@Path("uuid") UUID electionUuid);
}
