import { type PubKey as RawPubKey } from "maci-crypto";
import type { IJsonPublicKey, IG1ContractParams } from "./types";
export declare const SERIALIZED_PUB_KEY_PREFIX = "macipk.";
/**
 * @notice A class representing a public key
 * This is a MACI public key, which is not to be
 * confused with an Ethereum public key.
 * A serialized MACI public key is prefixed by 'macipk.'
 * A raw MACI public key can be thought as a pair of
 * BigIntegers (x, y) representing a point on the baby jubjub curve
 */
export declare class PubKey {
    rawPubKey: RawPubKey;
    /**
     * Create a new instance of a public key
     * @dev You might want to allow an invalid raw key,
     * as when decrypting invalid messages, the public key data
     * will be random, and likely not be a point on the curve.
     * However we need to match keys to the circuit which does
     * not perform such checks
     * @param rawPubKey the raw public key
     * @param allowInvalid whether to allow invalid public keys
     */
    constructor(rawPubKey: RawPubKey, allowInvalid?: boolean);
    /**
     * Create a copy of the public key
     * @returns a copy of the public key
     */
    copy: () => PubKey;
    /**
     * Return this public key as smart contract parameters
     * @returns the public key as smart contract parameters
     */
    asContractParam: () => IG1ContractParams;
    /**
     * Return this public key as circuit inputs
     * @returns an array of strings
     */
    asCircuitInputs: () => string[];
    /**
     * Return this public key as an array of bigints
     * @returns the public key as an array of bigints
     */
    asArray: () => bigint[];
    /**
     * Generate a serialized public key from this public key object
     * @returns the string representation of a serialized public key
     */
    serialize: () => string;
    /**
     * Hash the two baby jubjub coordinates
     * @returns the hash of this public key
     */
    hash: () => bigint;
    /**
     * Check whether this public key equals to another public key
     * @param p the public key to compare with
     * @returns whether they match
     */
    equals: (p: PubKey) => boolean;
    /**
     * Deserialize a serialized public key
     * @param s the serialized public key
     * @returns the deserialized public key
     */
    static deserialize: (s: string) => PubKey;
    /**
     * Check whether a serialized public key is serialized correctly
     * @param s the serialized public key
     * @returns whether the serialized public key is valid
     */
    static isValidSerializedPubKey: (s: string) => boolean;
    /**
     * Serialize this object
     */
    toJSON(): IJsonPublicKey;
    /**
     * Deserialize a JSON object into a PubKey instance
     * @param json - the json object
     * @returns PubKey
     */
    static fromJSON(json: IJsonPublicKey): PubKey;
}
//# sourceMappingURL=publicKey.d.ts.map