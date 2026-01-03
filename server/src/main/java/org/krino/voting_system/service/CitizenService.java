package org.krino.voting_system.service;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.jspecify.annotations.NonNull;
import org.krino.voting_system.dto.citizen.CitizenSyncRequest;
import org.krino.voting_system.entity.Citizen;
import org.krino.voting_system.exception.ResourceNotFoundException;
import org.krino.voting_system.repository.CitizenRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Transactional
@Service
@RequiredArgsConstructor
public class CitizenService
{
    private final CitizenRepository citizenRepository;

    public List<Citizen> getAllCitizens()
    {
        return citizenRepository.findAll();
    }

    public Citizen getCitizenByUUID(UUID uuid)
    {
        return citizenRepository.findByKeycloakId(uuid)
                .orElseThrow(() -> new ResourceNotFoundException("Citizen not found with UUID: " + uuid));
    }

    public void sync(CitizenSyncRequest req)
    {
        if (req.keycloakId() == null) throw new IllegalArgumentException("externalId is required");
        if (req.cin() == null || req.cin().isBlank()) throw new IllegalArgumentException("cin is required");
        if (req.email() == null || req.email().isBlank()) throw new IllegalArgumentException("email is required");
        if (req.firstName() == null || req.firstName().isBlank())
            throw new IllegalArgumentException("firstName is required");
        if (req.lastName() == null || req.lastName().isBlank())
            throw new IllegalArgumentException("lastName is required");

        var existing = citizenRepository.findByKeycloakId(req.keycloakId());

        if (existing.isPresent())
        {
            Citizen c = getCitizen(req, existing);

            citizenRepository.save(c);
            return;
        }

        citizenRepository.findByCin(req.cin()).ifPresent(other ->
        {
            throw new IllegalStateException("CIN already used by another account");
        });

        Citizen created = Citizen.builder()
                .keycloakId(req.keycloakId())
                .cin(req.cin())
                .username(req.username())
                .email(req.email())
                .firstName(req.firstName())
                .lastName(req.lastName())
                .phoneNumber(req.phoneNumber())
                .birthPlace(req.birthPlace())
                .birthDate(req.birthDate())
                .emailVerified(req.emailVerified())
                // keep app-owned fields defaults (isEligible true, hasVoted false)
                .build();

        citizenRepository.save(created);
    }

    private static @NonNull Citizen getCitizen(CitizenSyncRequest req, Optional<Citizen> existing)
    {
        Citizen c = existing.orElseGet(Citizen::new);

        if (c.getCin() != null && !c.getCin().equals(req.cin()))
        {
            throw new IllegalStateException("CIN mismatch for this keycloakId");
        }

        c.setUsername(req.username());
        c.setEmail(req.email());
        c.setFirstName(req.firstName());
        c.setLastName(req.lastName());
        c.setPhoneNumber(req.phoneNumber());
        c.setBirthPlace(req.birthPlace());
        c.setBirthDate(req.birthDate());
        c.setEmailVerified(req.emailVerified());
        return c;
    }
}
