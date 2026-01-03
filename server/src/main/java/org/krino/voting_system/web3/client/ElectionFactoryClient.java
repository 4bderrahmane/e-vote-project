package org.krino.voting_system.web3.client;

import lombok.RequiredArgsConstructor;
import org.krino.voting_system.web3.config.Web3jProperties;
import org.springframework.stereotype.Service;
import org.web3j.protocol.Web3j;
import org.web3j.tx.TransactionManager;
import org.web3j.tx.gas.ContractGasProvider;

import java.math.BigInteger;

@Service
@RequiredArgsConstructor
public class ElectionFactoryClient
{
    private final Web3j web3j;
    private final TransactionManager txManager;
    private final ContractGasProvider gasProvider;
    private final Web3jProperties props;

    public String createElection(byte[] uuid16, BigInteger endTimeSeconds, byte[] encryptionPubKey32) throws Exception
    {
        var factory = org.krino.voting_system.web3.contracts.ElectionFactory.load(
                props.getElectionFactoryAddress(), web3j, txManager, gasProvider
        );

        var receipt = factory.createElection(uuid16, endTimeSeconds, encryptionPubKey32).send();

        // Wrapper can decode events from the receipt :contentReference[oaicite:4]{index=4}
        var events = factory.getElectionDeployedEvents(receipt);
        if (events.isEmpty()) throw new IllegalStateException("ElectionDeployed event not found");

        return events.get(0).election; // deployed election address
    }
}
