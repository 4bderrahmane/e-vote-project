import { CheckVerifyingKeysArgs } from "../utils";
/**
 * Command to confirm that the verifying keys in the contract match the
 * local ones
 * @note see different options for zkey files to use specific circuits https://maci.pse.dev/docs/trusted-setup, https://maci.pse.dev/docs/testing/#pre-compiled-artifacts-for-testing
 * @param CheckVerifyingKeysArgs - The arguments for the checkVerifyingKeys command
 * @returns Whether the verifying keys match or not
 */
export declare const checkVerifyingKeys: ({ stateTreeDepth, intStateTreeDepth, messageTreeDepth, voteOptionTreeDepth, messageBatchDepth, processMessagesZkeyPath, tallyVotesZkeyPath, vkRegistry, signer, useQuadraticVoting, quiet, }: CheckVerifyingKeysArgs) => Promise<boolean>;
//# sourceMappingURL=checkVerifyingKeys.d.ts.map