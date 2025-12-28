import { EcdhSharedKey, Keypair, PrivKey, PubKey } from "./types";
/**
 * Generate a private key
 * @returns A random seed for a private key.
 */
export declare const genPrivKey: () => bigint;
/**
 * Generate a random value
 * @returns A BabyJub-compatible salt.
 */
export declare const genRandomSalt: () => bigint;
/**
 * An internal function which formats a random private key to be compatible
 * with the BabyJub curve. This is the format which should be passed into the
 * PubKey and other circuits.
 * @param privKey A private key generated using genPrivKey()
 * @returns A BabyJub-compatible private key.
 */
export declare const formatPrivKeyForBabyJub: (privKey: PrivKey) => bigint;
/**
 * Losslessly reduces the size of the representation of a public key
 * @param pubKey The public key to pack
 * @returns A packed public key
 */
export declare const packPubKey: (pubKey: PubKey) => bigint;
/**
 * Restores the original PubKey from its packed representation
 * @param packed The value to unpack
 * @returns The unpacked public key
 */
export declare const unpackPubKey: (packed: bigint) => PubKey;
/**
 * @param privKey A private key generated using genPrivKey()
 * @returns A public key associated with the private key
 */
export declare const genPubKey: (privKey: PrivKey) => PubKey;
/**
 * Generates a keypair.
 * @returns a keypair
 */
export declare const genKeypair: () => Keypair;
/**
 * Generates an Elliptic-Curve Diffie–Hellman (ECDH) shared key given a private
 * key and a public key.
 * @param privKey A private key generated using genPrivKey()
 * @param pubKey A public key generated using genPubKey()
 * @returns The ECDH shared key.
 */
export declare const genEcdhSharedKey: (privKey: PrivKey, pubKey: PubKey) => EcdhSharedKey;
//# sourceMappingURL=keys.d.ts.map