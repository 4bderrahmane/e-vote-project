import { type PrivKey as RawPrivKey } from "maci-crypto";
import type { IJsonPrivateKey } from "./types";
export declare const SERIALIZED_PRIV_KEY_PREFIX = "macisk.";
/**
 * @notice PrivKey is a TS Class representing a MACI PrivateKey
 * which is a seed to be used to generate a public key (point on the curve)
 * This is a MACI private key, which is not to be
 * confused with an Ethereum private key.
 * A serialized MACI private key is prefixed by 'macisk.'
 */
export declare class PrivKey {
    rawPrivKey: RawPrivKey;
    /**
     * Generate a new Private key object
     * @param rawPrivKey the raw private key (a bigint)
     */
    constructor(rawPrivKey: RawPrivKey);
    /**
     * Create a copy of this Private key
     * @returns a copy of the Private key
     */
    copy: () => PrivKey;
    /**
     * Return this Private key as a circuit input
     * @returns the Private key as a circuit input
     */
    asCircuitInputs: () => string;
    /**
     * Serialize the private key
     * @returns the serialized private key
     */
    serialize: () => string;
    /**
     * Deserialize the private key
     * @param s the serialized private key
     * @returns the deserialized private key
     */
    static deserialize: (s: string) => PrivKey;
    /**
     * Check if the serialized private key is valid
     * @param s the serialized private key
     * @returns whether it is a valid serialized private key
     */
    static isValidSerializedPrivKey: (s: string) => boolean;
    /**
     * Serialize this object
     */
    toJSON(): IJsonPrivateKey;
    /**
     * Deserialize this object from a JSON object
     * @param json - the json object
     * @returns the deserialized object as a PrivKey instance
     */
    static fromJSON(json: IJsonPrivateKey): PrivKey;
}
//# sourceMappingURL=privateKey.d.ts.map