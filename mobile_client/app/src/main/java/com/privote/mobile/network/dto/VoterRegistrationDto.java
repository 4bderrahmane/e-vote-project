package com.privote.mobile.network.dto;

import java.util.UUID;

public class VoterRegistrationDto
{
    public UUID electionPublicId;
    public UUID citizenKeycloakId;
    public String participationStatus;
    public String commitmentStatus;
    public String identityCommitment;
    public Long merkleLeafIndex;
    public String transactionHash;
    public String registeredAt;
}
