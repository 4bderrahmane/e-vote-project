import type { IPublishBatchArgs, IPublishBatchData, PublishArgs } from "../utils/interfaces";
/**
 * Publish a new message to a MACI Poll contract
 * @param PublishArgs - The arguments for the publish command
 * @returns The ephemeral private key used to encrypt the message
 */
export declare const publish: ({ pubkey, stateIndex, voteOptionIndex, nonce, pollId, newVoteWeight, maciAddress, salt, privateKey, signer, quiet, }: PublishArgs) => Promise<string>;
/**
 * Batch publish new messages to a MACI Poll contract
 * @param {IPublishBatchArgs} args - The arguments for the publish command
 * @returns {IPublishBatchData} The ephemeral private key used to encrypt the message, transaction hash
 */
export declare const publishBatch: ({ messages, pollId, maciAddress, publicKey, privateKey, signer, quiet, }: IPublishBatchArgs) => Promise<IPublishBatchData>;
//# sourceMappingURL=publish.d.ts.map