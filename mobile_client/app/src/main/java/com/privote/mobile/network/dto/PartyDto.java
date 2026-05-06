package com.privote.mobile.network.dto;

import java.util.UUID;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class PartyDto
{
    private UUID publicId;
    private String name;
    private String abbreviation;
    private String description;
}
