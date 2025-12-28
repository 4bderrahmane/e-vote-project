"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkVerifyingKeys = void 0;
const maci_circuits_1 = require("maci-circuits");
const maci_contracts_1 = require("maci-contracts");
const maci_domainobjs_1 = require("maci-domainobjs");
const fs_1 = __importDefault(require("fs"));
const utils_1 = require("../utils");
/**
 * Command to confirm that the verifying keys in the contract match the
 * local ones
 * @note see different options for zkey files to use specific circuits https://maci.pse.dev/docs/trusted-setup, https://maci.pse.dev/docs/testing/#pre-compiled-artifacts-for-testing
 * @param CheckVerifyingKeysArgs - The arguments for the checkVerifyingKeys command
 * @returns Whether the verifying keys match or not
 */
const checkVerifyingKeys = async ({ stateTreeDepth, intStateTreeDepth, messageTreeDepth, voteOptionTreeDepth, messageBatchDepth, processMessagesZkeyPath, tallyVotesZkeyPath, vkRegistry, signer, useQuadraticVoting = true, quiet = true, }) => {
    (0, utils_1.banner)(quiet);
    const network = await signer.provider?.getNetwork();
    // ensure we have the contract addresses that we need
    const vkContractAddress = vkRegistry || (await (0, utils_1.readContractAddress)("VkRegistry", network?.name));
    if (!vkContractAddress) {
        (0, utils_1.logError)("Please provide a VkRegistry contract address");
    }
    if (!(await (0, utils_1.contractExists)(signer.provider, vkContractAddress))) {
        (0, utils_1.logError)("The VkRegistry contract does not exist");
    }
    const vkRegistryContractInstance = maci_contracts_1.VkRegistry__factory.connect(vkContractAddress, signer);
    // we need to ensure that the zkey files exist
    const isProcessMessagesZkeyPathExists = fs_1.default.existsSync(processMessagesZkeyPath);
    if (!isProcessMessagesZkeyPathExists) {
        (0, utils_1.logError)("The provided Process messages zkey does not exist");
    }
    const isTallyVotesZkeyPathExists = fs_1.default.existsSync(tallyVotesZkeyPath);
    if (!isTallyVotesZkeyPathExists) {
        (0, utils_1.logError)("The provided Tally votes zkey does not exist");
    }
    // extract the verification keys from the zkey files
    const processVk = maci_domainobjs_1.VerifyingKey.fromObj(await (0, maci_circuits_1.extractVk)(processMessagesZkeyPath));
    const tallyVk = maci_domainobjs_1.VerifyingKey.fromObj(await (0, maci_circuits_1.extractVk)(tallyVotesZkeyPath));
    try {
        (0, utils_1.logYellow)(quiet, (0, utils_1.info)("Retrieving verifying keys from the contract..."));
        // retrieve the verifying keys from the contract
        const messageBatchSize = 5 ** messageBatchDepth;
        const processVkOnChain = await vkRegistryContractInstance.getProcessVk(stateTreeDepth, messageTreeDepth, voteOptionTreeDepth, messageBatchSize, useQuadraticVoting ? maci_contracts_1.EMode.QV : maci_contracts_1.EMode.NON_QV);
        const tallyVkOnChain = await vkRegistryContractInstance.getTallyVk(stateTreeDepth, intStateTreeDepth, voteOptionTreeDepth, useQuadraticVoting ? maci_contracts_1.EMode.QV : maci_contracts_1.EMode.NON_QV);
        // do the actual validation
        if (!(0, utils_1.compareVks)(processVk, processVkOnChain)) {
            (0, utils_1.logError)("Process verifying keys do not match");
        }
        if (!(0, utils_1.compareVks)(tallyVk, tallyVkOnChain)) {
            (0, utils_1.logError)("Tally verifying keys do not match");
        }
    }
    catch (error) {
        (0, utils_1.logError)(error.message);
    }
    (0, utils_1.logGreen)(quiet, (0, utils_1.success)("Verifying keys match"));
    return true;
};
exports.checkVerifyingKeys = checkVerifyingKeys;
//# sourceMappingURL=checkVerifyingKeys.js.map