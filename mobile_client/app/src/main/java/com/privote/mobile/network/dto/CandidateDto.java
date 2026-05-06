package com.privote.mobile.network.dto;

import java.util.UUID;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class CandidateDto
{
    private UUID publicId;
    private UUID electionPublicId;
    private String status;           // PENDING_APPROVAL | ACTIVE | WITHDRAWN | DISQUALIFIED
    private String fullName;
    private UUID partyPublicId;
    private String partyName;
}
