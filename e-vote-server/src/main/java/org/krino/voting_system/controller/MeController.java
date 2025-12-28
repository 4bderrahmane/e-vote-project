package org.krino.voting_system.controller;

import lombok.RequiredArgsConstructor;
import org.krino.voting_system.dto.citizen.CitizenResponseDto;
import org.krino.voting_system.entity.Citizen;
import org.krino.voting_system.service.CitizenService;
import org.krino.voting_system.service.account.AccountDeletionService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/users")
public class MeController
{

    private final AccountDeletionService accountDeletionService;
    private final CitizenService citizenService;

    @DeleteMapping("/me")
    public ResponseEntity<Void> deleteMe(@AuthenticationPrincipal Jwt jwt)
    {
        accountDeletionService.deleteMyAccount(jwt.getSubject());
        return ResponseEntity.noContent().build();
    }

//    @GetMapping("/me")
//    public CitizenResponseDto me(@AuthenticationPrincipal Jwt jwt)
//    {
//        String keycloakId = jwt.getSubject();
//
//        UUID uuid = UUID.fromString(keycloakId);
//        Citizen citizen = citizenService.getCitizenByUUID(uuid);
//        CitizenResponseDto c = CitizenResponseDto.fromEntity(citizen);
//        // todo I should complete the CitizenMapper so I can map these objects to return the CitizenResponseDTO to the user;
//        return citizenService.getCitizenByUUID(keycloakId);
//    }

}
