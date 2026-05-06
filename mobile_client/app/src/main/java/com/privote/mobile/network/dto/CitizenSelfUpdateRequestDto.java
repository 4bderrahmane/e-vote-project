package com.privote.mobile.network.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class CitizenSelfUpdateRequestDto
{
    private String firstName;
    private String lastName;
    private String email;
    private String phoneNumber;
    private String address;
    private String region;
    private String birthPlace;
    private String birthDate;
}
