package org.krino.voting_system.entity;

import jakarta.persistence.*;
import lombok.*;
import org.krino.voting_system.entity.enums.ElectionStatus;

import java.time.LocalDateTime;
import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "elections")
public class Election
{
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Generate this in the constructor so it's never null
    @Column(nullable = false, unique = true, updatable = false)
    private UUID publicId = UUID.randomUUID();

    private String title;

    private String description;

    private LocalDateTime startDate;

    private LocalDateTime endDate;

    private ElectionStatus status;

    private String contractAddress;
}
