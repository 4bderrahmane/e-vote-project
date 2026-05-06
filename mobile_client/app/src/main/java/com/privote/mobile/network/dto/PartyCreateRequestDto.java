package com.privote.mobile.network.dto;

import java.util.List;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class PartyCreateRequestDto
{
    private String name;
    private String abbreviation;
    private String description;
    private List<String> memberCins;
}
