"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Keypair = void 0;
const maci_crypto_1 = require("maci-crypto");
const assert_1 = __importDefault(require("assert"));
const privateKey_1 = require("./privateKey");
const publicKey_1 = require("./publicKey");
/**
 * @notice A KeyPair is a pair of public and private keys
 * This is a MACI keypair, which is not to be
 * confused with an Ethereum public and private keypair.
 * A MACI keypair is comprised of a MACI public key and a MACI private key
 */
class Keypair {
    /**
     * Create a new instance of a Keypair
     * @param privKey the private key (optional)
     * @notice if no privKey is passed, it will automatically generate a new private key
     */
    constructor(privKey) {
        /**
         * Create a deep clone of this Keypair
         * @returns a copy of the Keypair
         */
        this.copy = () => new Keypair(this.privKey.copy());
        if (privKey) {
            this.privKey = privKey;
            this.pubKey = new publicKey_1.PubKey((0, maci_crypto_1.genPubKey)(privKey.rawPrivKey));
        }
        else {
            const rawKeyPair = (0, maci_crypto_1.genKeypair)();
            this.privKey = new privateKey_1.PrivKey(rawKeyPair.privKey);
            this.pubKey = new publicKey_1.PubKey(rawKeyPair.pubKey);
        }
    }
    /**
     * Generate a shared key
     * @param privKey
     * @param pubKey
     * @returns
     */
    static genEcdhSharedKey(privKey, pubKey) {
        return (0, maci_crypto_1.genEcdhSharedKey)(privKey.rawPrivKey, pubKey.rawPubKey);
    }
    /**
     * Check whether two Keypairs are equal
     * @param keypair the keypair to compare with
     * @returns whether they are equal or not
     */
    equals(keypair) {
        const equalPrivKey = this.privKey.rawPrivKey === keypair.privKey.rawPrivKey;
        const equalPubKey = this.pubKey.rawPubKey[0] === keypair.pubKey.rawPubKey[0] &&
            this.pubKey.rawPubKey[1] === keypair.pubKey.rawPubKey[1];
        // If this assertion fails, something is very wrong and this function
        // should not return anything
        // eslint-disable-next-line no-bitwise
        (0, assert_1.default)(!(+equalPrivKey ^ +equalPubKey));
        return equalPrivKey;
    }
    /**
     * Serialize into a JSON object
     */
    toJSON() {
        return {
            privKey: this.privKey.serialize(),
            pubKey: this.pubKey.serialize(),
        };
    }
    /**
     * Deserialize into a Keypair instance
     * @param json
     * @returns a keypair instance
     */
    static fromJSON(json) {
        return new Keypair(privateKey_1.PrivKey.deserialize(json.privKey));
    }
}
exports.Keypair = Keypair;
//# sourceMappingURL=keyPair.js.map