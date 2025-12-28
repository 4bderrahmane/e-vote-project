package org.krino.voting_system.dto.party;

import lombok.Data;

@Data
public class PartyCreateDto
{
    private String name;

    private String abbreviation;

    private String description;
}
