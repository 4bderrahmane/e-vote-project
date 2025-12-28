package org.krino.voting_system.dto.citizen;

import lombok.Data;

import java.time.LocalDate;

@Data
public class CitizenResponseDto
{
    private String firstName;
    private String lastName;
    private String cin;
    private String email;
    private String birthPlace;
    private LocalDate birthDate;

}