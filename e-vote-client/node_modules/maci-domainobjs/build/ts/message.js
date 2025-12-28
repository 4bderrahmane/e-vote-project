"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Message = void 0;
const maci_crypto_1 = require("maci-crypto");
const assert_1 = __importDefault(require("assert"));
/**
 * @notice An encrypted command and signature.
 */
class Message {
    /**
     * Create a new instance of a Message
     * @param msgType the type of the message
     * @param data the data of the message
     */
    constructor(data) {
        /**
         * Return the message as an array of bigints
         * @returns the message as an array of bigints
         */
        this.asArray = () => this.data;
        /**
         * Return the message as a contract param
         * @returns the message as a contract param
         */
        this.asContractParam = () => ({
            data: this.data.map((x) => x.toString()),
        });
        /**
         * Return the message as a circuit input
         * @returns the message as a circuit input
         */
        this.asCircuitInputs = () => this.asArray();
        /**
         * Hash the message data and a public key
         * @param encPubKey the public key that is used to encrypt this message
         * @returns the hash of the message data and the public key
         */
        this.hash = (encPubKey) => (0, maci_crypto_1.hash12)([...this.data, ...encPubKey.rawPubKey]);
        /**
         * Create a copy of the message
         * @returns a copy of the message
         */
        this.copy = () => new Message(this.data.map((x) => BigInt(x.toString())));
        /**
         * Check if two messages are equal
         * @param m the message to compare with
         * @returns the result of the comparison
         */
        this.equals = (m) => {
            if (this.data.length !== m.data.length) {
                return false;
            }
            return this.data.every((data, index) => data === m.data[index]);
        };
        (0, assert_1.default)(data.length === Message.DATA_LENGTH);
        this.data = data;
    }
    /**
     * Serialize to a JSON object
     */
    toJSON() {
        return this.asContractParam();
    }
    /**
     * Deserialize into a Message instance
     * @param json - the json representation
     * @returns the deserialized object as a Message instance
     */
    static fromJSON(json) {
        return new Message(json.data.map((x) => BigInt(x)));
    }
}
exports.Message = Message;
Message.DATA_LENGTH = 10;
//# sourceMappingURL=message.js.map