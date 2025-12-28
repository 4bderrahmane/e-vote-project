import type { PubKey } from "./publicKey";
import type { IMessageContractParams } from "./types";
/**
 * @notice An encrypted command and signature.
 */
export declare class Message {
    data: bigint[];
    static DATA_LENGTH: number;
    /**
     * Create a new instance of a Message
     * @param msgType the type of the message
     * @param data the data of the message
     */
    constructor(data: bigint[]);
    /**
     * Return the message as an array of bigints
     * @returns the message as an array of bigints
     */
    private asArray;
    /**
     * Return the message as a contract param
     * @returns the message as a contract param
     */
    asContractParam: () => IMessageContractParams;
    /**
     * Return the message as a circuit input
     * @returns the message as a circuit input
     */
    asCircuitInputs: () => bigint[];
    /**
     * Hash the message data and a public key
     * @param encPubKey the public key that is used to encrypt this message
     * @returns the hash of the message data and the public key
     */
    hash: (encPubKey: PubKey) => bigint;
    /**
     * Create a copy of the message
     * @returns a copy of the message
     */
    copy: () => Message;
    /**
     * Check if two messages are equal
     * @param m the message to compare with
     * @returns the result of the comparison
     */
    equals: (m: Message) => boolean;
    /**
     * Serialize to a JSON object
     */
    toJSON(): IMessageContractParams;
    /**
     * Deserialize into a Message instance
     * @param json - the json representation
     * @returns the deserialized object as a Message instance
     */
    static fromJSON(json: IMessageContractParams): Message;
}
//# sourceMappingURL=message.d.ts.map