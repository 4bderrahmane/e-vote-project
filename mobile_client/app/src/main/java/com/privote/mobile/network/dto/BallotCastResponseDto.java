package com.privote.mobile.network.dto;

import java.util.UUID;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class BallotCastResponseDto
{
    private UUID ballotId;
    private UUID electionPublicId;
    private String ciphertextHash;
    private String nullifier;
    private String transactionHash;
    private Long blockNumber;
    private String castAt;
}
