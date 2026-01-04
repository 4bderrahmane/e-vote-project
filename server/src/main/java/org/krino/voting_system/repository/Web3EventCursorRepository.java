package org.krino.voting_system.repository;

import org.krino.voting_system.entity.Web3EventCursor;
import org.springframework.data.jpa.repository.JpaRepository;

public interface Web3EventCursorRepository extends JpaRepository<Web3EventCursor, String>
{
}
