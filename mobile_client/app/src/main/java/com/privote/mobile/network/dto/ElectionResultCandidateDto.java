package com.privote.mobile.network.dto;

import java.util.UUID;

public class ElectionResultCandidateDto
{
    public UUID candidatePublicId;
    public String fullName;
    public String partyName;
    public long votes;
    public double percentage;
}
