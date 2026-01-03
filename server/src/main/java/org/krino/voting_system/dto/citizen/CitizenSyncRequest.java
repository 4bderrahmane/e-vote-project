package org.krino.voting_system.dto.citizen;

import java.time.LocalDate;
import java.util.UUID;

public record CitizenSyncRequest(
        UUID keycloakId,
        String username,
        String email,
        String firstName,
        String lastName,
        String cin,
        LocalDate birthDate,
        String birthPlace,
        String phoneNumber,
        boolean emailVerified,
        boolean enabled
)
{
}
