package org.krino.voting_system.entity;

import jakarta.persistence.*;
import lombok.*;
import org.krino.voting_system.entity.enums.ElectionPhase;

import java.util.UUID;
import java.math.BigInteger;
import java.time.Instant;

@Builder
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(
        name = "elections",
        indexes = {
                @Index(name = "idx_elections_public_id", columnList = "public_id", unique = true),
                @Index(name = "idx_elections_contract_address", columnList = "contract_address", unique = true),
                @Index(name = "idx_elections_end_time", columnList = "end_time")
        }
)
public class Election
{

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Version
    private Long version;

    @Column(name = "public_id", nullable = false, unique = true, updatable = false)
    private UUID publicId;

    @Column(name = "contract_address", unique = true, length = 42)
    private String contractAddress;

    @PrePersist
    @PreUpdate
    void normalize()
    {
        if (publicId == null) publicId = UUID.randomUUID();
        if (contractAddress != null) contractAddress = contractAddress.toLowerCase();
    }

    @Column(nullable = false)
    private String title;

    @Column(columnDefinition = "text")
    private String description;

    private Instant startTime;

    @Column(name = "end_time", nullable = false)
    private Instant endTime;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 32)
    private ElectionPhase phase;

    // On chain externalNullifier (uint256)
    @Column(nullable = false, precision = 78, scale = 0)
    private BigInteger externalNullifier;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "coordinator_id", referencedColumnName = "id", nullable = false, foreignKey = @ForeignKey(name = "fk_elections_coordinator"))
    private Citizen coordinator;

    @Column(name = "encryption_public_key", nullable = false, columnDefinition = "bytea")
    private byte[] encryptionPublicKey;

    @Column(name = "decryption_key", columnDefinition = "bytea")
    private byte[] decryptionKey;
}