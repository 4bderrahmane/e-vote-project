package com.privote.mobile.network.dto;

import java.util.List;
import java.util.UUID;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class ElectionResultDto
{
    private UUID electionPublicId;
    private String electionTitle;
    private String endTime;
    private boolean published;
    private long totalVotes;
    private long talliedBallots;
    private long registeredVoters;
    private double turnoutPercentage;
    private List<ElectionResultCandidateDto> candidates;
}
