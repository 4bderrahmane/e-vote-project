import { IncrementalQuinTree } from "maci-crypto";
import { PCommand, Keypair, Ballot, PubKey, Message, type StateLeaf } from "maci-domainobjs";
import type { MaciState } from "./MaciState";
import type { TreeDepths, BatchSizes, IPoll, IJsonPoll, IProcessMessagesOutput, ITallyCircuitInputs, IProcessMessagesCircuitInputs } from "./utils/types";
/**
 * A representation of the Poll contract.
 */
export declare class Poll implements IPoll {
    coordinatorKeypair: Keypair;
    treeDepths: TreeDepths;
    batchSizes: BatchSizes;
    stateTreeDepth: number;
    actualStateTreeDepth: number;
    maxVoteOptions: number;
    maxMessages: number;
    pollEndTimestamp: bigint;
    ballots: Ballot[];
    ballotTree?: IncrementalQuinTree;
    messages: Message[];
    messageTree: IncrementalQuinTree;
    commands: PCommand[];
    encPubKeys: PubKey[];
    stateCopied: boolean;
    stateLeaves: StateLeaf[];
    stateTree?: IncrementalQuinTree;
    numBatchesProcessed: number;
    currentMessageBatchIndex?: number;
    maciStateRef: MaciState;
    pollId: bigint;
    sbSalts: Record<number | string, bigint>;
    resultRootSalts: Record<number | string, bigint>;
    preVOSpentVoiceCreditsRootSalts: Record<number | string, bigint>;
    spentVoiceCreditSubtotalSalts: Record<number | string, bigint>;
    tallyResult: bigint[];
    perVOSpentVoiceCredits: bigint[];
    numBatchesTallied: number;
    totalSpentVoiceCredits: bigint;
    emptyBallot: Ballot;
    emptyBallotHash?: bigint;
    private numSignups;
    /**
     * Constructs a new Poll object.
     * @param pollEndTimestamp - The Unix timestamp at which the poll ends.
     * @param coordinatorKeypair - The keypair of the coordinator.
     * @param treeDepths - The depths of the trees used in the poll.
     * @param batchSizes - The sizes of the batches used in the poll.
     * @param maciStateRef - The reference to the MACI state.
     */
    constructor(pollEndTimestamp: bigint, coordinatorKeypair: Keypair, treeDepths: TreeDepths, batchSizes: BatchSizes, maciStateRef: MaciState);
    /**
     * Update a Poll with data from MaciState.
     * This is the step where we copy the state from the MaciState instance,
     * and set the number of signups we have so far.
     */
    updatePoll: (numSignups: bigint) => void;
    /**
     * Process one message.
     * @param message - The message to process.
     * @param encPubKey - The public key associated with the encryption private key.
     * @returns A number of variables which will be used in the zk-SNARK circuit.
     */
    processMessage: (message: Message, encPubKey: PubKey, qv?: boolean) => IProcessMessagesOutput;
    /**
     * Inserts a Message and the corresponding public key used to generate the
     * ECDH shared key which was used to encrypt said message.
     * @param message - The message to insert
     * @param encPubKey - The public key used to encrypt the message
     */
    publishMessage: (message: Message, encPubKey: PubKey) => void;
    /**
     * This method checks if there are any unprocessed messages in the Poll instance.
     * @returns Returns true if the number of processed batches is
     * less than the total number of batches, false otherwise.
     */
    hasUnprocessedMessages: () => boolean;
    /**
     * Process _batchSize messages starting from the saved index. This
     * function will process messages even if the number of messages is not an
     * exact multiple of _batchSize. e.g. if there are 10 messages, index is
     * 8, and _batchSize is 4, this function will only process the last two
     * messages in this.messages, and finally update the zeroth state leaf.
     * Note that this function will only process as many state leaves as there
     * are ballots to prevent accidental inclusion of a new user after this
     * poll has concluded.
     * @param pollId The ID of the poll associated with the messages to
     *        process
     * @param quiet - Whether to log errors or not
     * @returns stringified circuit inputs
     */
    processMessages: (pollId: bigint, qv?: boolean, quiet?: boolean) => IProcessMessagesCircuitInputs;
    /**
     * Generates partial circuit inputs for processing a batch of messages
     * @param index - The index of the partial batch.
     * @returns stringified partial circuit inputs
     */
    private genProcessMessagesCircuitInputsPartial;
    /**
     * Process all messages. This function does not update the ballots or state
     * leaves; rather, it copies and then updates them. This makes it possible
     * to test the result of multiple processMessage() invocations.
     * @returns The state leaves and ballots of the poll
     */
    processAllMessages: () => {
        stateLeaves: StateLeaf[];
        ballots: Ballot[];
    };
    /**
     * Checks whether there are any untallied ballots.
     * @returns Whether there are any untallied ballots
     */
    hasUntalliedBallots: () => boolean;
    /**
     * This method tallies a ballots and updates the tally results.
     * @returns the circuit inputs for the TallyVotes circuit.
     */
    tallyVotes: () => ITallyCircuitInputs;
    tallyVotesNonQv: () => ITallyCircuitInputs;
    /**
     * This method generates a commitment to the total spent voice credits.
     *
     * This is the hash of the total spent voice credits and a salt, computed as Poseidon([totalCredits, _salt]).
     * @param salt - The salt used in the hash function.
     * @param numBallotsToCount - The number of ballots to count for the calculation.
     * @param useQuadraticVoting - Whether to use quadratic voting or not. Default is true.
     * @returns Returns the hash of the total spent voice credits and a salt, computed as Poseidon([totalCredits, _salt]).
     */
    private genSpentVoiceCreditSubtotalCommitment;
    /**
     * This method generates a commitment to the spent voice credits per vote option.
     *
     * This is the hash of the Merkle root of the spent voice credits per vote option and a salt, computed as Poseidon([root, _salt]).
     * @param salt - The salt used in the hash function.
     * @param numBallotsToCount - The number of ballots to count for the calculation.
     * @param useQuadraticVoting - Whether to use quadratic voting or not. Default is true.
     * @returns Returns the hash of the Merkle root of the spent voice credits per vote option and a salt, computed as Poseidon([root, _salt]).
     */
    private genPerVOSpentVoiceCreditsCommitment;
    /**
     * Create a deep copy of the Poll object.
     * @returns A new instance of the Poll object with the same properties.
     */
    copy: () => Poll;
    /**
     * Check if the Poll object is equal to another Poll object.
     * @param p - The Poll object to compare.
     * @returns True if the two Poll objects are equal, false otherwise.
     */
    equals: (p: Poll) => boolean;
    /**
     * Serialize the Poll object to a JSON object
     * @returns a JSON object
     */
    toJSON(): IJsonPoll;
    /**
     * Deserialize a json object into a Poll instance
     * @param json the json object to deserialize
     * @param maciState the reference to the MaciState Class
     * @returns a new Poll instance
     */
    static fromJSON(json: IJsonPoll, maciState: MaciState): Poll;
    /**
     * Set the coordinator's keypair
     * @param serializedPrivateKey - the serialized private key
     */
    setCoordinatorKeypair: (serializedPrivateKey: string) => void;
    /**
     * Set the number of signups to match the ones from the contract
     * @param numSignups - the number of signups
     */
    setNumSignups: (numSignups: bigint) => void;
    /**
     * Get the number of signups
     * @returns The number of signups
     */
    getNumSignups: () => bigint;
}
//# sourceMappingURL=Poll.d.ts.map