"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PCommand = void 0;
const maci_crypto_1 = require("maci-crypto");
const assert_1 = __importDefault(require("assert"));
const message_1 = require("../message");
const publicKey_1 = require("../publicKey");
/**
 * @notice Unencrypted data whose fields include the user's public key, vote etc.
 * This represents a Vote command.
 */
class PCommand {
    /**
     * Create a new PCommand
     * @param stateIndex the state index of the user
     * @param newPubKey the new public key of the user
     * @param voteOptionIndex the index of the vote option
     * @param newVoteWeight the new vote weight of the user
     * @param nonce the nonce of the message
     * @param pollId the poll ID
     * @param salt the salt of the message
     */
    constructor(stateIndex, newPubKey, voteOptionIndex, newVoteWeight, nonce, pollId, salt = (0, maci_crypto_1.genRandomSalt)()) {
        /**
         * Create a deep clone of this PCommand
         * @returns a copy of the PCommand
         */
        this.copy = () => new PCommand(BigInt(this.stateIndex.toString()), this.newPubKey.copy(), BigInt(this.voteOptionIndex.toString()), BigInt(this.newVoteWeight.toString()), BigInt(this.nonce.toString()), BigInt(this.pollId.toString()), BigInt(this.salt.toString()));
        /**
         * @notice Returns this Command as an array. Note that 5 of the Command's fields
         * are packed into a single 250-bit value. This allows Messages to be
         * smaller and thereby save gas when the user publishes a message.
         * @returns bigint[] - the command as an array
         */
        this.asArray = () => {
            /* eslint-disable no-bitwise */
            const params = BigInt(this.stateIndex) +
                (BigInt(this.voteOptionIndex) << BigInt(50)) +
                (BigInt(this.newVoteWeight) << BigInt(100)) +
                (BigInt(this.nonce) << BigInt(150)) +
                (BigInt(this.pollId) << BigInt(200));
            /* eslint-enable no-bitwise */
            const command = [params, ...this.newPubKey.asArray(), this.salt];
            (0, assert_1.default)(command.length === 4);
            return command;
        };
        this.asCircuitInputs = () => this.asArray();
        /*
         * Check whether this command has deep equivalence to another command
         */
        this.equals = (command) => this.stateIndex === command.stateIndex &&
            this.newPubKey.equals(command.newPubKey) &&
            this.voteOptionIndex === command.voteOptionIndex &&
            this.newVoteWeight === command.newVoteWeight &&
            this.nonce === command.nonce &&
            this.pollId === command.pollId &&
            this.salt === command.salt;
        this.hash = () => (0, maci_crypto_1.hash4)(this.asArray());
        /**
         * @notice Signs this command and returns a Signature.
         */
        this.sign = (privKey) => (0, maci_crypto_1.sign)(privKey.rawPrivKey.toString(), this.hash());
        /**
         * @notice Returns true if the given signature is a correct signature of this
         * command and signed by the private key associated with the given public
         * key.
         */
        this.verifySignature = (signature, pubKey) => (0, maci_crypto_1.verifySignature)(this.hash(), signature, pubKey.rawPubKey);
        /**
         * @notice Encrypts this command along with a signature to produce a Message.
         * To save gas, we can constrain the following values to 50 bits and pack
         * them into a 250-bit value:
         * 0. state index
         * 3. vote option index
         * 4. new vote weight
         * 5. nonce
         * 6. poll ID
         */
        this.encrypt = (signature, sharedKey) => {
            const plaintext = [...this.asArray(), BigInt(signature.R8[0]), BigInt(signature.R8[1]), BigInt(signature.S)];
            (0, assert_1.default)(plaintext.length === 7);
            const ciphertext = (0, maci_crypto_1.poseidonEncrypt)(plaintext, sharedKey, BigInt(0));
            const message = new message_1.Message(ciphertext);
            return message;
        };
        const limit50Bits = BigInt(2 ** 50);
        (0, assert_1.default)(limit50Bits >= stateIndex);
        (0, assert_1.default)(limit50Bits >= voteOptionIndex);
        (0, assert_1.default)(limit50Bits >= newVoteWeight);
        (0, assert_1.default)(limit50Bits >= nonce);
        (0, assert_1.default)(limit50Bits >= pollId);
        this.stateIndex = stateIndex;
        this.newPubKey = newPubKey;
        this.voteOptionIndex = voteOptionIndex;
        this.newVoteWeight = newVoteWeight;
        this.nonce = nonce;
        this.pollId = pollId;
        this.salt = salt;
    }
    /**
     * Serialize into a JSON object
     */
    toJSON() {
        return {
            stateIndex: this.stateIndex.toString(),
            newPubKey: this.newPubKey.serialize(),
            voteOptionIndex: this.voteOptionIndex.toString(),
            newVoteWeight: this.newVoteWeight.toString(),
            nonce: this.nonce.toString(),
            pollId: this.pollId.toString(),
            salt: this.salt.toString(),
        };
    }
    /**
     * Deserialize into a PCommand instance
     * @param json
     * @returns a PCommand instance
     */
    static fromJSON(json) {
        const command = new PCommand(BigInt(json.stateIndex), publicKey_1.PubKey.deserialize(json.newPubKey), BigInt(json.voteOptionIndex), BigInt(json.newVoteWeight), BigInt(json.nonce), BigInt(json.pollId), BigInt(json.salt));
        return command;
    }
}
exports.PCommand = PCommand;
/**
 * Decrypts a Message to produce a Command.
 * @dev You can force decrypt the message by setting `force` to true.
 * This is useful in case you don't want an invalid message to throw an error.
 * @param message - the message to decrypt
 * @param sharedKey - the shared key to use for decryption
 * @param force - whether to force decryption or not
 */
PCommand.decrypt = (message, sharedKey, force = false) => {
    const decrypted = force
        ? (0, maci_crypto_1.poseidonDecryptWithoutCheck)(message.data, sharedKey, BigInt(0), 7)
        : (0, maci_crypto_1.poseidonDecrypt)(message.data, sharedKey, BigInt(0), 7);
    const p = BigInt(decrypted[0].toString());
    // Returns the value of the 50 bits at position `pos` in `val`
    // create 50 '1' bits
    // shift left by pos
    // AND with val
    // shift right by pos
    const extract = (val, pos) => 
    // eslint-disable-next-line no-bitwise
    BigInt((((BigInt(1) << BigInt(50)) - BigInt(1)) << BigInt(pos)) & val) >> BigInt(pos);
    // p is a packed value
    // bits 0 - 50:    stateIndex
    // bits 51 - 100:  voteOptionIndex
    // bits 101 - 150: newVoteWeight
    // bits 151 - 200: nonce
    // bits 201 - 250: pollId
    const stateIndex = extract(p, 0);
    const voteOptionIndex = extract(p, 50);
    const newVoteWeight = extract(p, 100);
    const nonce = extract(p, 150);
    const pollId = extract(p, 200);
    // create new public key but allow it to be invalid (as when passing an mismatched
    // encPubKey, a message will not decrypt resulting in potentially invalid public keys)
    const newPubKey = new publicKey_1.PubKey([decrypted[1], decrypted[2]], true);
    const salt = decrypted[3];
    const command = new PCommand(stateIndex, newPubKey, voteOptionIndex, newVoteWeight, nonce, pollId, salt);
    const signature = {
        R8: [decrypted[4], decrypted[5]],
        S: decrypted[6],
    };
    return { command, signature };
};
//# sourceMappingURL=PCommand.js.map