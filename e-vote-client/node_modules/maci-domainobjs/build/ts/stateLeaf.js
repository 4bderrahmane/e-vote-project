"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StateLeaf = void 0;
const maci_crypto_1 = require("maci-crypto");
const keyPair_1 = require("./keyPair");
const publicKey_1 = require("./publicKey");
/**
 * @notice A leaf in the state tree, which maps
 * public keys to voice credit balances
 */
class StateLeaf {
    /**
     * Create a new instance of a state leaf
     * @param pubKey the public key of the user signin up
     * @param voiceCreditBalance the voice credit balance of the user
     * @param timestamp the timestamp of when the user signed-up
     */
    constructor(pubKey, voiceCreditBalance, timestamp) {
        /**
         * Return this state leaf as an array of bigints
         * @returns the state leaf as an array of bigints
         */
        this.asArray = () => [...this.pubKey.asArray(), this.voiceCreditBalance, this.timestamp];
        /**
         * Return this state leaf as an array of bigints
         * @returns the state leaf as an array of bigints
         */
        this.asCircuitInputs = () => this.asArray();
        /**
         * Hash this state leaf (first convert as array)
         * @returns the has of the state leaf elements
         */
        this.hash = () => (0, maci_crypto_1.hash4)(this.asArray());
        /**
         * Serialize the state leaf
         * @notice serialize the public key
         * @notice convert the voice credit balance and timestamp to a hex string
         * @returns
         */
        this.serialize = () => {
            const j = [this.pubKey.serialize(), this.voiceCreditBalance.toString(16), this.timestamp.toString(16)];
            return Buffer.from(JSON.stringify(j, null, 0), "utf8").toString("base64url");
        };
        this.pubKey = pubKey;
        this.voiceCreditBalance = voiceCreditBalance;
        this.timestamp = timestamp;
    }
    /**
     * Crate a deep copy of the object
     * @returns a copy of the state leaf
     */
    copy() {
        return new StateLeaf(this.pubKey.copy(), BigInt(this.voiceCreditBalance.toString()), BigInt(this.timestamp.toString()));
    }
    /**
     * Generate a blank state leaf
     * @returns a blank state leaf
     */
    static genBlankLeaf() {
        // The public key for a blank state leaf is the first Pedersen base
        // point from iden3's circomlib implementation of the Pedersen hash.
        // Since it is generated using a hash-to-curve function, we are
        // confident that no-one knows the private key associated with this
        // public key. See:
        // https://github.com/iden3/circomlib/blob/d5ed1c3ce4ca137a6b3ca48bec4ac12c1b38957a/src/pedersen_printbases.js
        // Its hash should equal
        // 6769006970205099520508948723718471724660867171122235270773600567925038008762.
        return new StateLeaf(new publicKey_1.PubKey([
            BigInt("10457101036533406547632367118273992217979173478358440826365724437999023779287"),
            BigInt("19824078218392094440610104313265183977899662750282163392862422243483260492317"),
        ]), BigInt(0), BigInt(0));
    }
    /**
     * Generate a random leaf (random salt and random key pair)
     * @returns a random state leaf
     */
    static genRandomLeaf() {
        const keypair = new keyPair_1.Keypair();
        return new StateLeaf(keypair.pubKey, (0, maci_crypto_1.genRandomSalt)(), BigInt(0));
    }
    /**
     * Return this state leaf as a contract param
     * @returns the state leaf as a contract param (object)
     */
    asContractParam() {
        return {
            pubKey: this.pubKey.asContractParam(),
            voiceCreditBalance: this.voiceCreditBalance.toString(),
            timestamp: this.timestamp.toString(),
        };
    }
    /**
     * Check if two state leaves are equal
     * @param s the state leaf to compare with
     * @returns whether they are equal or not
     */
    equals(s) {
        return (this.pubKey.equals(s.pubKey) && this.voiceCreditBalance === s.voiceCreditBalance && this.timestamp === s.timestamp);
    }
    /**
     * Serialize to a JSON object
     */
    toJSON() {
        return {
            pubKey: this.pubKey.serialize(),
            voiceCreditBalance: this.voiceCreditBalance.toString(),
            timestamp: this.timestamp.toString(),
        };
    }
    /**
     * Deserialize into a StateLeaf instance
     * @param json - the json representation
     * @returns the deserialized object as a StateLeaf instance
     */
    static fromJSON(json) {
        return new StateLeaf(publicKey_1.PubKey.deserialize(json.pubKey), BigInt(json.voiceCreditBalance), BigInt(json.timestamp));
    }
}
exports.StateLeaf = StateLeaf;
/**
 * Deserialize the state leaf
 * @param serialized the serialized state leaf
 * @returns a deserialized state leaf
 */
StateLeaf.deserialize = (serialized) => {
    const base64 = serialized.replace(/-/g, "+").replace(/_/g, "/");
    const json = JSON.parse(Buffer.from(base64, "base64").toString("utf8"));
    return new StateLeaf(publicKey_1.PubKey.deserialize(json[0]), BigInt(`0x${json[1]}`), BigInt(`0x${json[2]}`));
};
//# sourceMappingURL=stateLeaf.js.map