package com.privote.mobile.network.dto;

import java.util.UUID;

public class BallotCastResponseDto
{
    public UUID ballotId;
    public UUID electionPublicId;
    public String ciphertextHash;
    public String nullifier;
    public String transactionHash;
    public Long blockNumber;
    public String castAt;
}
