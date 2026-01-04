package org.krino.voting_system.web3.listener;

import org.krino.voting_system.web3.listener.events.ElectionEndedEvent;
import org.krino.voting_system.web3.listener.events.ElectionStartedEvent;
import org.krino.voting_system.web3.listener.events.VoteAddedEvent;
import org.web3j.abi.EventEncoder;
import org.web3j.abi.FunctionReturnDecoder;
import org.web3j.abi.TypeReference;
import org.web3j.abi.datatypes.Address;
import org.web3j.abi.datatypes.DynamicBytes;
import org.web3j.abi.datatypes.Event;
import org.web3j.abi.datatypes.Type;
import org.web3j.abi.datatypes.generated.Uint256;
import org.web3j.protocol.core.methods.response.Log;

import java.math.BigInteger;
import java.util.Arrays;
import java.util.List;
import java.util.Objects;

public final class ElectionLogDecoder
{

    private ElectionLogDecoder()
    {
    }

    public static final Event ELECTION_STARTED_EVENT = new Event(
            "ElectionStarted",
            List.of(new TypeReference<Address>(true)
            {
            })
    );
    public static final String ELECTION_STARTED_TOPIC0 = EventEncoder.encode(ELECTION_STARTED_EVENT);

    public static final Event VOTE_ADDED_EVENT = new Event(
            "VoteAdded",
            Arrays.asList(
                    new TypeReference<DynamicBytes>()
                    {
                    },
                    new TypeReference<Uint256>()
                    {
                    }
            )
    );
    public static final String VOTE_ADDED_TOPIC0 = EventEncoder.encode(VOTE_ADDED_EVENT);

    public static final Event ELECTION_ENDED_EVENT = new Event(
            "ElectionEnded",
            Arrays.asList(
                    new TypeReference<Address>(true)
                    {
                    },
                    new TypeReference<DynamicBytes>()
                    {
                    }
            )
    );
    public static final String ELECTION_ENDED_TOPIC0 = EventEncoder.encode(ELECTION_ENDED_EVENT);

    public static ElectionStartedEvent decodeElectionStarted(Log log)
    {
        if (!hasTopic0(log, ELECTION_STARTED_TOPIC0)) return null;

        // only 1 indexed param -> safe to decode topics[1] with indexed params list
        List<Type> indexed = FunctionReturnDecoder.decode(
                log.getTopics().get(1),
                ELECTION_STARTED_EVENT.getIndexedParameters()
        );
        String coordinator = ((Address) indexed.get(0)).getValue();

        return new ElectionStartedEvent(
                log.getAddress(),
                coordinator,
                safeTxHash(log),
                safeBlockNumber(log),
                safeLogIndex(log)
        );
    }

    public static VoteAddedEvent decodeVoteAdded(Log log)
    {
        if (!hasTopic0(log, VOTE_ADDED_TOPIC0)) return null;

        List<Type> nonIndexed = FunctionReturnDecoder.decode(
                log.getData(),
                VOTE_ADDED_EVENT.getNonIndexedParameters()
        );

        byte[] ciphertext = ((DynamicBytes) nonIndexed.get(0)).getValue();
        BigInteger nullifierHash = ((Uint256) nonIndexed.get(1)).getValue();

        return new VoteAddedEvent(
                log.getAddress(),
                ciphertext,
                nullifierHash,
                safeTxHash(log),
                safeBlockNumber(log),
                safeLogIndex(log)
        );
    }

    public static ElectionEndedEvent decodeElectionEnded(Log log)
    {
        if (!hasTopic0(log, ELECTION_ENDED_TOPIC0)) return null;

        List<Type> indexed = FunctionReturnDecoder.decode(
                log.getTopics().get(1),
                ELECTION_ENDED_EVENT.getIndexedParameters()
        );
        String coordinator = ((Address) indexed.get(0)).getValue();

        List<Type> nonIndexed = FunctionReturnDecoder.decode(
                log.getData(),
                ELECTION_ENDED_EVENT.getNonIndexedParameters()
        );
        byte[] decryptionKey = ((DynamicBytes) nonIndexed.get(0)).getValue();

        return new ElectionEndedEvent(
                log.getAddress(),
                coordinator,
                decryptionKey,
                safeTxHash(log),
                safeBlockNumber(log),
                safeLogIndex(log)
        );
    }

    private static boolean hasTopic0(Log log, String topic0)
    {
        return log.getTopics() != null
                && !log.getTopics().isEmpty()
                && Objects.equals(log.getTopics().get(0), topic0);
    }

    private static String safeTxHash(Log log)
    {
        return log.getTransactionHash();
    }

    private static BigInteger safeBlockNumber(Log log)
    {
        return log.getBlockNumber();
    }

    // web3j Log can have logIndex; depends on node response; keep nullable-safe
    private static BigInteger safeLogIndex(Log log)
    {
        try
        {
            return log.getLogIndex();
        }
        catch (Exception e)
        {
            return null;
        }
    }
}