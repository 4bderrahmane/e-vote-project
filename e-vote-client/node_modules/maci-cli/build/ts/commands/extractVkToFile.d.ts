import { ExtractVkToFileArgs } from "../utils/interfaces";
/**
 * Command to confirm that the verifying keys in the contract match the
 * local ones
 * @note see different options for zkey files to use specific circuits https://maci.pse.dev/docs/trusted-setup, https://maci.pse.dev/docs/testing/#pre-compiled-artifacts-for-testing
 * @param CheckVerifyingKeysArgs - The arguments for the checkVerifyingKeys command
 * @returns Whether the verifying keys match or not
 */
export declare const extractVkToFile: ({ processMessagesZkeyPathQv, tallyVotesZkeyPathQv, processMessagesZkeyPathNonQv, tallyVotesZkeyPathNonQv, outputFilePath, }: ExtractVkToFileArgs) => Promise<void>;
//# sourceMappingURL=extractVkToFile.d.ts.map