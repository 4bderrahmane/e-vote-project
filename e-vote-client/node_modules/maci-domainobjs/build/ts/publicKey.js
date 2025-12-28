"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PubKey = exports.SERIALIZED_PUB_KEY_PREFIX = void 0;
const maci_crypto_1 = require("maci-crypto");
const assert_1 = __importDefault(require("assert"));
exports.SERIALIZED_PUB_KEY_PREFIX = "macipk.";
/**
 * @notice A class representing a public key
 * This is a MACI public key, which is not to be
 * confused with an Ethereum public key.
 * A serialized MACI public key is prefixed by 'macipk.'
 * A raw MACI public key can be thought as a pair of
 * BigIntegers (x, y) representing a point on the baby jubjub curve
 */
class PubKey {
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
    constructor(rawPubKey, allowInvalid = false) {
        /**
         * Create a copy of the public key
         * @returns a copy of the public key
         */
        this.copy = () => new PubKey([BigInt(this.rawPubKey[0].toString()), BigInt(this.rawPubKey[1].toString())]);
        /**
         * Return this public key as smart contract parameters
         * @returns the public key as smart contract parameters
         */
        this.asContractParam = () => {
            const [x, y] = this.rawPubKey;
            return {
                x: x.toString(),
                y: y.toString(),
            };
        };
        /**
         * Return this public key as circuit inputs
         * @returns an array of strings
         */
        this.asCircuitInputs = () => this.rawPubKey.map((x) => x.toString());
        /**
         * Return this public key as an array of bigints
         * @returns the public key as an array of bigints
         */
        this.asArray = () => [this.rawPubKey[0], this.rawPubKey[1]];
        /**
         * Generate a serialized public key from this public key object
         * @returns the string representation of a serialized public key
         */
        this.serialize = () => {
            const packed = (0, maci_crypto_1.packPubKey)(this.rawPubKey).toString(16);
            if (packed.length % 2 !== 0) {
                return `${exports.SERIALIZED_PUB_KEY_PREFIX}0${packed}`;
            }
            return `${exports.SERIALIZED_PUB_KEY_PREFIX}${packed}`;
        };
        /**
         * Hash the two baby jubjub coordinates
         * @returns the hash of this public key
         */
        this.hash = () => (0, maci_crypto_1.hashLeftRight)(this.rawPubKey[0], this.rawPubKey[1]);
        /**
         * Check whether this public key equals to another public key
         * @param p the public key to compare with
         * @returns whether they match
         */
        this.equals = (p) => this.rawPubKey[0] === p.rawPubKey[0] && this.rawPubKey[1] === p.rawPubKey[1];
        if (!allowInvalid) {
            (0, assert_1.default)((0, maci_crypto_1.inCurve)(rawPubKey), "PubKey not on curve");
        }
        this.rawPubKey = rawPubKey;
    }
    /**
     * Serialize this object
     */
    toJSON() {
        return {
            pubKey: this.serialize(),
        };
    }
    /**
     * Deserialize a JSON object into a PubKey instance
     * @param json - the json object
     * @returns PubKey
     */
    static fromJSON(json) {
        return PubKey.deserialize(json.pubKey);
    }
}
exports.PubKey = PubKey;
/**
 * Deserialize a serialized public key
 * @param s the serialized public key
 * @returns the deserialized public key
 */
PubKey.deserialize = (s) => {
    const len = exports.SERIALIZED_PUB_KEY_PREFIX.length;
    return new PubKey((0, maci_crypto_1.unpackPubKey)(BigInt(`0x${s.slice(len).toString()}`)));
};
/**
 * Check whether a serialized public key is serialized correctly
 * @param s the serialized public key
 * @returns whether the serialized public key is valid
 */
PubKey.isValidSerializedPubKey = (s) => {
    const correctPrefix = s.startsWith(exports.SERIALIZED_PUB_KEY_PREFIX);
    try {
        PubKey.deserialize(s);
        return correctPrefix;
    }
    catch {
        return false;
    }
};
//# sourceMappingURL=publicKey.js.map