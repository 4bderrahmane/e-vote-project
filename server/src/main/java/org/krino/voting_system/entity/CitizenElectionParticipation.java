package org.krino.voting_system.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.krino.voting_system.entity.enums.ParticipationStatus;

import java.time.LocalDateTime;
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(
        name = "citizen_election_participations",
        uniqueConstraints = @UniqueConstraint(
                name = "uk_citizen_election",
                columnNames = {"citizen_id", "election_id"}
        ),
        indexes = {
                @Index(name = "idx_participation_citizen", columnList = "citizen_id"),
                @Index(name = "idx_participation_election", columnList = "election_id")
        }
)
public class CitizenElectionParticipation
{

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "citizen_id", nullable = false)
    private Citizen citizen;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "election_id", nullable = false)
    private Election election;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ParticipationStatus status;

    private LocalDateTime registeredAt;

}
