package org.krino.voting_system.web3;

import io.reactivex.disposables.Disposable;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.web3j.abi.EventEncoder;
import org.web3j.abi.TypeReference;
import org.web3j.abi.datatypes.Address;
import org.web3j.abi.datatypes.Event;
import org.web3j.abi.datatypes.Utf8String;
import org.web3j.abi.FunctionReturnDecoder;
import org.web3j.crypto.Credentials;
import org.web3j.crypto.WalletUtils;
import org.web3j.protocol.Web3j;
import org.web3j.protocol.core.DefaultBlockParameterName;
import org.web3j.protocol.core.methods.request.EthFilter;
import org.web3j.protocol.core.methods.response.TransactionReceipt;
import org.web3j.protocol.http.HttpService;

import jakarta.annotation.PostConstruct;
import jakarta.annotation.PreDestroy;
import org.web3j.abi.datatypes.Type;

import java.util.Arrays;
import java.util.List;

@Service
public class ElectionListenerService
{

    private final Logger logger = LoggerFactory.getLogger(ElectionListenerService.class);
    private final Web3j web3j = Web3j.build(new HttpService("http://localhost:8545"));
    private static final String FACTORY_CONTRACT_ADDRESS = "0xYourFactoryAddressHere...";

    private Disposable subscription;

    @PreDestroy
    public void shutdown()
    {
        if (subscription != null && !subscription.isDisposed())
        {
            subscription.dispose();
        }
    }

    @PostConstruct
    public void subscribeToElectionEvents()
    {
        logger.info("Starting Event Listener...");

        Event event = new Event("ElectionCreated",
                Arrays.asList(
                        new TypeReference<Address>(true)
                        {
                        }, // 'true' means it is Indexed
                        new TypeReference<Utf8String>(false)
                        {
                        },
                        new TypeReference<Address>(false)
                        {
                        }
                ));

        String eventSignature = EventEncoder.encode(event);

        EthFilter filter = new EthFilter(
                DefaultBlockParameterName.LATEST,
                DefaultBlockParameterName.LATEST,
                FACTORY_CONTRACT_ADDRESS
        );

        filter.addSingleTopic(eventSignature);

        // Keep the subscription so the IDE doesn't warn about ignored result, and so you can later dispose it on shutdown.
        subscription = web3j.ethLogFlowable(filter).subscribe(log ->
        {
            logger.info("New Event Detected!");

            String rawAddressParams = log.getTopics().get(1);
            Address electionAddress = (Address) FunctionReturnDecoder.decodeIndexedValue(
                    rawAddressParams,
                    new TypeReference<Address>()
                    {
                    }
            );

//            @SuppressWarnings("unchecked")
            List<Type> nonIndexedValues = FunctionReturnDecoder.decode(
                    log.getData(),
                    event.getNonIndexedParameters()
            );

            Utf8String electionNameAbi = (Utf8String) nonIndexedValues.get(0);
            Address creatorAddressAbi = (Address) nonIndexedValues.get(1);

            String electionName = electionNameAbi.getValue();
            String creatorAddress = creatorAddressAbi.getValue();

            saveElectionToDatabase(electionAddress.getValue(), electionName, creatorAddress);

        }, error -> logger.error("Error listening to events: {}", error.getMessage()));
    }

//    public String registerUserOnChain(String identityCommitment)
//    {
//
//        // 1. Load your Admin Wallet (The one paying for the transaction)
//        Credentials credentials = WalletUtils.loadCredentials("password", "/path/to/wallet.json");
//
//        // 2. Connect to Blockchain (e.g., Local Ganache, Polygon, or your Private Node)
//        Web3j web3j = Web3j.build(new HttpService("http://localhost:8545"));
//
//        // 3. Load the Semaphore Contract
//        SemaphoreContract contract = SemaphoreContract.load(contractAddress, web3j, credentials, gasPrice, gasLimit);
//
//        // 4. Send the Transaction (This is where the Trust comes from!)
//        // The contract updates the Merkle Tree on-chain.
//        TransactionReceipt receipt = contract.addMember(groupId, identityCommitment).send();
//
//        // 5. Return the Transaction Hash (Proof of Registration)
//        return receipt.getTransactionHash();
//    }

    private void saveElectionToDatabase(String address, String name, String creator)
    {
        logger.info("New Election Deployed: {}", address);
        logger.info("Name: {}", name);
        logger.info("Creator: {}", creator);
    }
}
