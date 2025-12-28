import type { IJsonStateLeaf, IStateLeaf, IStateLeafContractParams } from "./types";
import { PubKey } from "./publicKey";
/**
 * @notice A leaf in the state tree, which maps
 * public keys to voice credit balances
 */
export declare class StateLeaf implements IStateLeaf {
    pubKey: PubKey;
    voiceCreditBalance: bigint;
    timestamp: bigint;
    /**
     * Create a new instance of a state leaf
     * @param pubKey the public key of the user signin up
     * @param voiceCreditBalance the voice credit balance of the user
     * @param timestamp the timestamp of when the user signed-up
     */
    constructor(pubKey: PubKey, voiceCreditBalance: bigint, timestamp: bigint);
    /**
     * Crate a deep copy of the object
     * @returns a copy of the state leaf
     */
    copy(): StateLeaf;
    /**
     * Generate a blank state leaf
     * @returns a blank state leaf
     */
    static genBlankLeaf(): StateLeaf;
    /**
     * Generate a random leaf (random salt and random key pair)
     * @returns a random state leaf
     */
    static genRandomLeaf(): StateLeaf;
    /**
     * Return this state leaf as an array of bigints
     * @returns the state leaf as an array of bigints
     */
    private asArray;
    /**
     * Return this state leaf as an array of bigints
     * @returns the state leaf as an array of bigints
     */
    asCircuitInputs: () => bigint[];
    /**
     * Hash this state leaf (first convert as array)
     * @returns the has of the state leaf elements
     */
    hash: () => bigint;
    /**
     * Return this state leaf as a contract param
     * @returns the state leaf as a contract param (object)
     */
    asContractParam(): IStateLeafContractParams;
    /**
     * Check if two state leaves are equal
     * @param s the state leaf to compare with
     * @returns whether they are equal or not
     */
    equals(s: StateLeaf): boolean;
    /**
     * Serialize the state leaf
     * @notice serialize the public key
     * @notice convert the voice credit balance and timestamp to a hex string
     * @returns
     */
    serialize: () => string;
    /**
     * Deserialize the state leaf
     * @param serialized the serialized state leaf
     * @returns a deserialized state leaf
     */
    static deserialize: (serialized: string) => StateLeaf;
    /**
     * Serialize to a JSON object
     */
    toJSON(): IJsonStateLeaf;
    /**
     * Deserialize into a StateLeaf instance
     * @param json - the json representation
     * @returns the deserialized object as a StateLeaf instance
     */
    static fromJSON(json: IJsonStateLeaf): StateLeaf;
}
//# sourceMappingURL=stateLeaf.d.ts.map