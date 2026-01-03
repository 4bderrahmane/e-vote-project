package org.krino.voting_system.web3.client;


import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.web3j.protocol.Web3j;
import org.web3j.protocol.core.methods.response.TransactionReceipt;
import org.web3j.tx.TransactionManager;
import org.web3j.tx.gas.ContractGasProvider;

import java.math.BigInteger;

@Service
@RequiredArgsConstructor
public class ElectionClient
{
    private final Web3j web3j;
    private final TransactionManager txManager;
    private final ContractGasProvider gasProvider;

    public TransactionReceipt addVoter(String electionAddress, BigInteger identityCommitment) throws Exception
    {
        var election = org.krino.voting_system.web3.contracts.Election.load(
                electionAddress, web3j, txManager, gasProvider
        );
        return election.addVoter(identityCommitment).send();
    }

    public boolean isNullifierUsed(String electionAddress, BigInteger nullifierHash) throws Exception
    {
        var election = org.krino.voting_system.web3.contracts.Election.load(
                electionAddress, web3j, txManager, gasProvider
        );
        return election.isNullifierUsed(nullifierHash).send();
    }
}
