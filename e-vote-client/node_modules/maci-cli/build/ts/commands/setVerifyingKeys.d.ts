import { type SetVerifyingKeysArgs } from "../utils";
/**
 * Function that sets the verifying keys in the VkRegistry contract
 * @note see different options for zkey files to use specific circuits https://maci.pse.dev/docs/trusted-setup, https://maci.pse.dev/docs/testing/#pre-compiled-artifacts-for-testing
 * @param SetVerifyingKeysArgs - The arguments for the setVerifyingKeys command
 */
export declare const setVerifyingKeys: ({ stateTreeDepth, intStateTreeDepth, messageTreeDepth, voteOptionTreeDepth, messageBatchDepth, processMessagesZkeyPathQv, tallyVotesZkeyPathQv, processMessagesZkeyPathNonQv, tallyVotesZkeyPathNonQv, vkRegistry, signer, useQuadraticVoting, quiet, }: SetVerifyingKeysArgs) => Promise<void>;
//# sourceMappingURL=setVerifyingKeys.d.ts.map