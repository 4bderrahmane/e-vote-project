"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.extractVkToFile = void 0;
const maci_circuits_1 = require("maci-circuits");
const fs_1 = __importDefault(require("fs"));
/**
 * Command to confirm that the verifying keys in the contract match the
 * local ones
 * @note see different options for zkey files to use specific circuits https://maci.pse.dev/docs/trusted-setup, https://maci.pse.dev/docs/testing/#pre-compiled-artifacts-for-testing
 * @param CheckVerifyingKeysArgs - The arguments for the checkVerifyingKeys command
 * @returns Whether the verifying keys match or not
 */
const extractVkToFile = async ({ processMessagesZkeyPathQv, tallyVotesZkeyPathQv, processMessagesZkeyPathNonQv, tallyVotesZkeyPathNonQv, outputFilePath, }) => {
    const [processVkQv, tallyVkQv, processVkNonQv, tallyVkNonQv] = await Promise.all([
        (0, maci_circuits_1.extractVk)(processMessagesZkeyPathQv),
        (0, maci_circuits_1.extractVk)(tallyVotesZkeyPathQv),
        (0, maci_circuits_1.extractVk)(processMessagesZkeyPathNonQv),
        (0, maci_circuits_1.extractVk)(tallyVotesZkeyPathNonQv),
    ]);
    await fs_1.default.promises.writeFile(outputFilePath, JSON.stringify({ processVkQv, tallyVkQv, processVkNonQv, tallyVkNonQv }));
};
exports.extractVkToFile = extractVkToFile;
//# sourceMappingURL=extractVkToFile.js.map