package org.krino.voting_system.mapper;

import org.krino.voting_system.dto.citizen.CitizenSyncDTO;
import org.krino.voting_system.entity.Citizen;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface CitizenMapper
{

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "nationalId", source = "cin")
    @Mapping(target = "fullName", expression = "java(combineNames(dto.getFirstName(), dto.getLastName()))")
    @Mapping(target = "isEligible", constant = "true")

    @Mapping(target = "voterCommitments", ignore = true)
    @Mapping(target = "candidacies", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)

    Citizen toEntity(CitizenSyncDTO dto);
    CitizenSyncDTO toDto(Citizen entity);

    default String combineNames(String first, String last)
    {
        if (first == null && last == null) return "";
        if (first == null) return last;
        if (last == null) return first;
        return first + " " + last;
    }
}