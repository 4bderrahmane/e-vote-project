package org.krino.voting_system.web3.listener.events;

import java.math.BigInteger;

public record VoteAddedEvent(
        String electionAddress,
        byte[] ciphertext,
        BigInteger nullifierHash,
        String txHash,
        BigInteger blockNumber,
        BigInteger logIndex)
{

}
