package org.krino.voting_system.repository;

import org.krino.voting_system.entity.Ballot;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface BallotRepository extends JpaRepository<Ballot, UUID>
{
}
