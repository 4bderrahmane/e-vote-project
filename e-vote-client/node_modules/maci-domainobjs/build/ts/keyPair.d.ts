import { EcdhSharedKey } from "maci-crypto";
import type { IJsonKeyPair } from "./types";
import { PrivKey } from "./privateKey";
import { PubKey } from "./publicKey";
/**
 * @notice A KeyPair is a pair of public and private keys
 * This is a MACI keypair, which is not to be
 * confused with an Ethereum public and private keypair.
 * A MACI keypair is comprised of a MACI public key and a MACI private key
 */
export declare class Keypair {
    privKey: PrivKey;
    pubKey: PubKey;
    /**
     * Create a new instance of a Keypair
     * @param privKey the private key (optional)
     * @notice if no privKey is passed, it will automatically generate a new private key
     */
    constructor(privKey?: PrivKey);
    /**
     * Create a deep clone of this Keypair
     * @returns a copy of the Keypair
     */
    copy: () => Keypair;
    /**
     * Generate a shared key
     * @param privKey
     * @param pubKey
     * @returns
     */
    static genEcdhSharedKey(privKey: PrivKey, pubKey: PubKey): EcdhSharedKey;
    /**
     * Check whether two Keypairs are equal
     * @param keypair the keypair to compare with
     * @returns whether they are equal or not
     */
    equals(keypair: Keypair): boolean;
    /**
     * Serialize into a JSON object
     */
    toJSON(): IJsonKeyPair;
    /**
     * Deserialize into a Keypair instance
     * @param json
     * @returns a keypair instance
     */
    static fromJSON(json: IJsonKeyPair): Keypair;
}
//# sourceMappingURL=keyPair.d.ts.map