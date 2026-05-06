package com.privote.mobile.network.dto;

import java.util.UUID;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class VoterRegistrationDto
{
    private UUID electionPublicId;
    private UUID citizenKeycloakId;
    private String participationStatus;
    private String commitmentStatus;
    private String identityCommitment;
    private Long merkleLeafIndex;
    private String transactionHash;
    private String registeredAt;
}
