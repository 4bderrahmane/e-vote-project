package org.krino.voting_system.repository;

import org.krino.voting_system.entity.Citizen;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface CitizenRepository extends JpaRepository<Citizen, Long>
{
    Optional<Citizen> findByKeycloakId(UUID uuid);

    Optional<Citizen> findByCin(String cin);
}