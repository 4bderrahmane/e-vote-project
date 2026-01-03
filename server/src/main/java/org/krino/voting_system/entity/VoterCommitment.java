package org.krino.voting_system.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.krino.voting_system.entity.enums.CommitmentStatus;

import java.time.LocalDateTime;

@Entity
@Table(name = "voter_commitments", uniqueConstraints =
        {
                @UniqueConstraint(columnNames = {"citizen_id", "election_id"}),
                @UniqueConstraint(columnNames = {"identity_commitment"})
        })
@Getter
@Setter
@NoArgsConstructor
public class VoterCommitment
{

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;


    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "citizen_id", nullable = false)
    private Citizen citizen;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "election_id", nullable = false)
    private Election election;

    @Column(name = "identity_commitment", nullable = false, length = 128)
    private String identityCommitment;

    @Column(name = "merkle_leaf_index")
    private Long merkleLeafIndex;

    /**
     * Proof that we actually added them to the blockchain.
     * Helpful for auditing if a user claims "I registered but can't vote!"
     */
    @Column(name = "transaction_hash")
    private String transactionHash;

    /**
     * PENDING: Received from React, waiting to send to Blockchain.
     * ON_CHAIN: Successfully added to the Merkle Tree.
     * FAILED: Blockchain rejected it.
     */
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private CommitmentStatus status = CommitmentStatus.PENDING;

    @CreationTimestamp
    @Column(name = "registered_at", updatable = false)
    private LocalDateTime registeredAt;


    @PreUpdate
    void anonymizeIfOnChain()
    {
        if (status == CommitmentStatus.ON_CHAIN)
        {
            this.citizen = null;
        }
    }
}