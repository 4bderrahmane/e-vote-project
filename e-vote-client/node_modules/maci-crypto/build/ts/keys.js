"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.genEcdhSharedKey = exports.genKeypair = exports.genPubKey = exports.unpackPubKey = exports.packPubKey = exports.formatPrivKeyForBabyJub = exports.genRandomSalt = exports.genPrivKey = void 0;
const baby_jubjub_1 = require("@zk-kit/baby-jubjub");
const eddsa_poseidon_1 = require("@zk-kit/eddsa-poseidon");
const crypto_1 = require("crypto");
const babyjub_1 = require("./babyjub");
/**
 * Generate a private key
 * @returns A random seed for a private key.
 */
const genPrivKey = () => BigInt(`0x${(0, crypto_1.randomBytes)(32).toString("hex")}`);
exports.genPrivKey = genPrivKey;
/**
 * Generate a random value
 * @returns A BabyJub-compatible salt.
 */
const genRandomSalt = () => (0, babyjub_1.genRandomBabyJubValue)();
exports.genRandomSalt = genRandomSalt;
/**
 * An internal function which formats a random private key to be compatible
 * with the BabyJub curve. This is the format which should be passed into the
 * PubKey and other circuits.
 * @param privKey A private key generated using genPrivKey()
 * @returns A BabyJub-compatible private key.
 */
const formatPrivKeyForBabyJub = (privKey) => BigInt((0, eddsa_poseidon_1.deriveSecretScalar)(privKey.toString()));
exports.formatPrivKeyForBabyJub = formatPrivKeyForBabyJub;
/**
 * Losslessly reduces the size of the representation of a public key
 * @param pubKey The public key to pack
 * @returns A packed public key
 */
const packPubKey = (pubKey) => BigInt((0, eddsa_poseidon_1.packPublicKey)(pubKey));
exports.packPubKey = packPubKey;
/**
 * Restores the original PubKey from its packed representation
 * @param packed The value to unpack
 * @returns The unpacked public key
 */
const unpackPubKey = (packed) => {
    const pubKey = (0, eddsa_poseidon_1.unpackPublicKey)(packed);
    return pubKey.map((x) => BigInt(x));
};
exports.unpackPubKey = unpackPubKey;
/**
 * @param privKey A private key generated using genPrivKey()
 * @returns A public key associated with the private key
 */
const genPubKey = (privKey) => {
    const key = (0, eddsa_poseidon_1.derivePublicKey)(privKey.toString());
    return [BigInt(key[0]), BigInt(key[1])];
};
exports.genPubKey = genPubKey;
/**
 * Generates a keypair.
 * @returns a keypair
 */
const genKeypair = () => {
    const privKey = (0, exports.genPrivKey)();
    const pubKey = (0, exports.genPubKey)(privKey);
    const keypair = { privKey, pubKey };
    return keypair;
};
exports.genKeypair = genKeypair;
/**
 * Generates an Elliptic-Curve Diffie–Hellman (ECDH) shared key given a private
 * key and a public key.
 * @param privKey A private key generated using genPrivKey()
 * @param pubKey A public key generated using genPubKey()
 * @returns The ECDH shared key.
 */
const genEcdhSharedKey = (privKey, pubKey) => (0, baby_jubjub_1.mulPointEscalar)(pubKey, (0, exports.formatPrivKeyForBabyJub)(privKey));
exports.genEcdhSharedKey = genEcdhSharedKey;
//# sourceMappingURL=keys.js.map