package com.privote.mobile.network.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class ElectionCreateRequestDto
{
    private String title;
    private String description;
    private String startTime;
    private String endTime;
    private String phase;
    private String coordinatorKeycloakId;
    private byte[] encryptionPublicKey;
}
