package org.krino.voting_system.entity;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigInteger;

@Entity
@Table(name = "web3_event_cursor")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Web3EventCursor
{
    @Id
    @Column(name = "cursor_key", nullable = false, updatable = false, length = 128)
    private String key;

    // uint256-ish => BigInteger
    @Column(name = "next_block", nullable = false, precision = 78, scale = 0)
    private BigInteger nextBlock;

    @Column(name = "next_log_index", nullable = false, precision = 78, scale = 0)
    private BigInteger nextLogIndex;
}