package com.privote.mobile.network.dto;

import java.util.UUID;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class ElectionResultCandidateDto
{
    private UUID candidatePublicId;
    private String fullName;
    private String partyName;
    private long votes;
    private double percentage;
}
