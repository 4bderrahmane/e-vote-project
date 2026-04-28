package com.privote.mobile.network.dto;

import java.util.List;
import java.util.UUID;

public class ElectionResultDto
{
    public UUID electionPublicId;
    public String electionTitle;
    public String endTime;
    public boolean published;
    public long totalVotes;
    public long talliedBallots;
    public long registeredVoters;
    public double turnoutPercentage;
    public List<ElectionResultCandidateDto> candidates;
}
