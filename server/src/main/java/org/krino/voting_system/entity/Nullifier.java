package org.krino.voting_system.entity;


import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Getter
@Setter
@Table(name = "nullifiers")
public class Nullifier
{

    // The Nullifier is the PRIMARY KEY.
    // This automatically prevents duplicates at the database level.
    @Id
    @Column(nullable = false, unique = true)
    private String nullifierHash;

    // Which election topic this nullifier was used for (optional, if you have multiple elections)
    private UUID electionId;

    // Timestamp to track when the vote happened
    private LocalDateTime usedAt;

    @PrePersist
    protected void onCreate()
    {
        usedAt = LocalDateTime.now();
    }
}
