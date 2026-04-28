package com.privote.mobile.network.dto;

import java.util.List;

public class BallotCastRequestDto
{
    public byte[] ciphertext;
    public String nullifier;
    public List<String> proof;

    public BallotCastRequestDto(byte[] ciphertext, String nullifier, List<String> proof)
    {
        this.ciphertext = ciphertext;
        this.nullifier = nullifier;
        this.proof = proof;
    }
}
