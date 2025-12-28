import { type PubKey, type Keypair, StateLeaf } from "maci-domainobjs";
import type { IJsonMaciState, IMaciState, TreeDepths } from "./utils/types";
import { Poll } from "./Poll";
/**
 * A representation of the MACI contract.
 */
export declare class MaciState implements IMaciState {
    polls: Map<bigint, Poll>;
    stateLeaves: StateLeaf[];
    stateTreeDepth: number;
    numSignUps: number;
    pollBeingProcessed?: boolean;
    currentPollBeingProcessed?: bigint;
    /**
     * Constructs a new MaciState object.
     * @param stateTreeDepth - The depth of the state tree.
     */
    constructor(stateTreeDepth: number);
    /**
     * Sign up a user with the given public key, initial voice credit balance, and timestamp.
     * @param pubKey - The public key of the user.
     * @param initialVoiceCreditBalance - The initial voice credit balance of the user.
     * @param timestamp - The timestamp of the sign-up.
     * @returns The index of the newly signed-up user in the state tree.
     */
    signUp(pubKey: PubKey, initialVoiceCreditBalance: bigint, timestamp: bigint): number;
    /**
     * Deploy a new poll with the given parameters.
     * @param pollEndTimestamp - The Unix timestamp at which the poll ends.
     * @param treeDepths - The depths of the tree.
     * @param messageBatchSize - The batch size for processing messages.
     * @param coordinatorKeypair - The keypair of the MACI round coordinator.
     * @returns The index of the newly deployed poll.
     */
    deployPoll(pollEndTimestamp: bigint, treeDepths: TreeDepths, messageBatchSize: number, coordinatorKeypair: Keypair): bigint;
    /**
     * Deploy a null poll.
     */
    deployNullPoll(): void;
    /**
     * Create a deep copy of the MaciState object.
     * @returns A new instance of the MaciState object with the same properties.
     */
    copy: () => MaciState;
    /**
     * Check if the MaciState object is equal to another MaciState object.
     * @param m - The MaciState object to compare.
     * @returns True if the two MaciState objects are equal, false otherwise.
     */
    equals: (m: MaciState) => boolean;
    /**
     * Serialize the MaciState object to a JSON object.
     * @returns A JSON object representing the MaciState object.
     */
    toJSON(): IJsonMaciState;
    /**
     * Create a new MaciState object from a JSON object.
     * @param json - The JSON object representing the MaciState object.
     * @returns A new instance of the MaciState object with the properties from the JSON object.
     */
    static fromJSON(json: IJsonMaciState): MaciState;
}
//# sourceMappingURL=MaciState.d.ts.map