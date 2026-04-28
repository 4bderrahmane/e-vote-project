package com.privote.mobile.network.dto;

import java.util.UUID;

public class CandidateDto
{
    public UUID publicId;
    public UUID electionPublicId;
    public String status;           // PENDING_APPROVAL | ACTIVE | WITHDRAWN | DISQUALIFIED
    public String fullName;
    public UUID partyPublicId;
    public String partyName;
}
