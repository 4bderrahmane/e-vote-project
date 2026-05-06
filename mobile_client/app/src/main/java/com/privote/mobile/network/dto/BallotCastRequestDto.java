package com.privote.mobile.network.dto;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class BallotCastRequestDto
{
    private final byte[] ciphertext;
    private final String nullifier;
    private final List<String> proof;
}
