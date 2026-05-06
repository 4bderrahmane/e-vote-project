package com.privote.mobile.network.dto;

import java.util.UUID;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class ElectionDto
{
    private UUID publicId;
    private String title;
    private String description;
    private String startTime;
    private String endTime;
    private String phase;           // REGISTRATION | VOTING | TALLY
    private String externalNullifier;
    private String contractAddress;
    private String encryptionPublicKey;
    private String createdAt;
    private String updatedAt;
}
