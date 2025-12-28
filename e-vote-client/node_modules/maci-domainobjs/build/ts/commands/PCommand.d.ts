import { type Signature, type EcdhSharedKey } from "maci-crypto";
import type { IJsonPCommand } from "./types";
import type { PrivKey } from "../privateKey";
import { Message } from "../message";
import { PubKey } from "../publicKey";
export interface IDecryptMessage {
    command: PCommand;
    signature: Signature;
}
/**
 * @notice Unencrypted data whose fields include the user's public key, vote etc.
 * This represents a Vote command.
 */
export declare class PCommand {
    stateIndex: bigint;
    newPubKey: PubKey;
    voteOptionIndex: bigint;
    newVoteWeight: bigint;
    nonce: bigint;
    pollId: bigint;
    salt: bigint;
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
    constructor(stateIndex: bigint, newPubKey: PubKey, voteOptionIndex: bigint, newVoteWeight: bigint, nonce: bigint, pollId: bigint, salt?: bigint);
    /**
     * Create a deep clone of this PCommand
     * @returns a copy of the PCommand
     */
    copy: <T extends PCommand>() => T;
    /**
     * @notice Returns this Command as an array. Note that 5 of the Command's fields
     * are packed into a single 250-bit value. This allows Messages to be
     * smaller and thereby save gas when the user publishes a message.
     * @returns bigint[] - the command as an array
     */
    asArray: () => bigint[];
    asCircuitInputs: () => bigint[];
    equals: (command: PCommand) => boolean;
    hash: () => bigint;
    /**
     * @notice Signs this command and returns a Signature.
     */
    sign: (privKey: PrivKey) => Signature;
    /**
     * @notice Returns true if the given signature is a correct signature of this
     * command and signed by the private key associated with the given public
     * key.
     */
    verifySignature: (signature: Signature, pubKey: PubKey) => boolean;
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
    encrypt: (signature: Signature, sharedKey: EcdhSharedKey) => Message;
    /**
     * Decrypts a Message to produce a Command.
     * @dev You can force decrypt the message by setting `force` to true.
     * This is useful in case you don't want an invalid message to throw an error.
     * @param message - the message to decrypt
     * @param sharedKey - the shared key to use for decryption
     * @param force - whether to force decryption or not
     */
    static decrypt: (message: Message, sharedKey: EcdhSharedKey, force?: boolean) => IDecryptMessage;
    /**
     * Serialize into a JSON object
     */
    toJSON(): IJsonPCommand;
    /**
     * Deserialize into a PCommand instance
     * @param json
     * @returns a PCommand instance
     */
    static fromJSON(json: IJsonPCommand): PCommand;
}
//# sourceMappingURL=PCommand.d.ts.map