"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrivKey = exports.SERIALIZED_PRIV_KEY_PREFIX = void 0;
const maci_crypto_1 = require("maci-crypto");
exports.SERIALIZED_PRIV_KEY_PREFIX = "macisk.";
/**
 * @notice PrivKey is a TS Class representing a MACI PrivateKey
 * which is a seed to be used to generate a public key (point on the curve)
 * This is a MACI private key, which is not to be
 * confused with an Ethereum private key.
 * A serialized MACI private key is prefixed by 'macisk.'
 */
class PrivKey {
    /**
     * Generate a new Private key object
     * @param rawPrivKey the raw private key (a bigint)
     */
    constructor(rawPrivKey) {
        /**
         * Create a copy of this Private key
         * @returns a copy of the Private key
         */
        this.copy = () => new PrivKey(BigInt(this.rawPrivKey.toString()));
        /**
         * Return this Private key as a circuit input
         * @returns the Private key as a circuit input
         */
        this.asCircuitInputs = () => (0, maci_crypto_1.formatPrivKeyForBabyJub)(this.rawPrivKey).toString();
        /**
         * Serialize the private key
         * @returns the serialized private key
         */
        this.serialize = () => {
            let x = this.rawPrivKey.toString(16);
            if (x.length % 2 !== 0) {
                x = `0${x}`;
            }
            return `${exports.SERIALIZED_PRIV_KEY_PREFIX}${x.padStart(64, "0")}`;
        };
        this.rawPrivKey = rawPrivKey;
    }
    /**
     * Serialize this object
     */
    toJSON() {
        return {
            privKey: this.serialize(),
        };
    }
    /**
     * Deserialize this object from a JSON object
     * @param json - the json object
     * @returns the deserialized object as a PrivKey instance
     */
    static fromJSON(json) {
        return PrivKey.deserialize(json.privKey);
    }
}
exports.PrivKey = PrivKey;
/**
 * Deserialize the private key
 * @param s the serialized private key
 * @returns the deserialized private key
 */
PrivKey.deserialize = (s) => {
    const x = s.slice(exports.SERIALIZED_PRIV_KEY_PREFIX.length);
    return new PrivKey(BigInt(`0x${x}`));
};
/**
 * Check if the serialized private key is valid
 * @param s the serialized private key
 * @returns whether it is a valid serialized private key
 */
PrivKey.isValidSerializedPrivKey = (s) => {
    const correctPrefix = s.startsWith(exports.SERIALIZED_PRIV_KEY_PREFIX);
    const x = s.slice(exports.SERIALIZED_PRIV_KEY_PREFIX.length);
    return correctPrefix && x.length === 64;
};
//# sourceMappingURL=privateKey.js.map