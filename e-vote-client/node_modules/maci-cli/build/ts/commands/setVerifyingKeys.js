"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setVerifyingKeys = void 0;
const maci_circuits_1 = require("maci-circuits");
const maci_contracts_1 = require("maci-contracts");
const typechain_types_1 = require("maci-contracts/typechain-types");
const maci_core_1 = require("maci-core");
const maci_domainobjs_1 = require("maci-domainobjs");
const fs_1 = __importDefault(require("fs"));
const utils_1 = require("../utils");
/**
 * Function that sets the verifying keys in the VkRegistry contract
 * @note see different options for zkey files to use specific circuits https://maci.pse.dev/docs/trusted-setup, https://maci.pse.dev/docs/testing/#pre-compiled-artifacts-for-testing
 * @param SetVerifyingKeysArgs - The arguments for the setVerifyingKeys command
 */
const setVerifyingKeys = async ({ stateTreeDepth, intStateTreeDepth, messageTreeDepth, voteOptionTreeDepth, messageBatchDepth, processMessagesZkeyPathQv, tallyVotesZkeyPathQv, processMessagesZkeyPathNonQv, tallyVotesZkeyPathNonQv, vkRegistry, signer, useQuadraticVoting = true, quiet = true, }) => {
    (0, utils_1.banner)(quiet);
    const network = await signer.provider?.getNetwork();
    // we must either have the contract as param or stored to file
    const vkRegistryAddress = vkRegistry || (await (0, utils_1.readContractAddress)("VkRegistry", network?.name));
    if (!vkRegistryAddress) {
        (0, utils_1.logError)("vkRegistry contract address is empty");
    }
    // check if zKey files exist
    const isProcessMessagesZkeyPathQvExists = processMessagesZkeyPathQv
        ? fs_1.default.existsSync(processMessagesZkeyPathQv)
        : false;
    if (useQuadraticVoting && processMessagesZkeyPathQv && !isProcessMessagesZkeyPathQvExists) {
        (0, utils_1.logError)(`${processMessagesZkeyPathQv} does not exist.`);
    }
    const isTallyVotesZkeyPathQvExists = tallyVotesZkeyPathQv ? fs_1.default.existsSync(tallyVotesZkeyPathQv) : false;
    if (useQuadraticVoting && tallyVotesZkeyPathQv && !isTallyVotesZkeyPathQvExists) {
        (0, utils_1.logError)(`${tallyVotesZkeyPathQv} does not exist.`);
    }
    const isProcessMessagesZkeyPathNonQvExists = processMessagesZkeyPathNonQv
        ? fs_1.default.existsSync(processMessagesZkeyPathNonQv)
        : false;
    if (!useQuadraticVoting && processMessagesZkeyPathNonQv && !isProcessMessagesZkeyPathNonQvExists) {
        (0, utils_1.logError)(`${processMessagesZkeyPathNonQv} does not exist.`);
    }
    const isTallyVotesZkeyPathNonQvExists = tallyVotesZkeyPathNonQv ? fs_1.default.existsSync(tallyVotesZkeyPathNonQv) : false;
    if (!useQuadraticVoting && tallyVotesZkeyPathNonQv && !isTallyVotesZkeyPathNonQvExists) {
        (0, utils_1.logError)(`${tallyVotesZkeyPathNonQv} does not exist.`);
    }
    // extract the vks
    const processVkQv = processMessagesZkeyPathQv && maci_domainobjs_1.VerifyingKey.fromObj(await (0, maci_circuits_1.extractVk)(processMessagesZkeyPathQv));
    const tallyVkQv = tallyVotesZkeyPathQv && maci_domainobjs_1.VerifyingKey.fromObj(await (0, maci_circuits_1.extractVk)(tallyVotesZkeyPathQv));
    const processVkNonQv = processMessagesZkeyPathNonQv && maci_domainobjs_1.VerifyingKey.fromObj(await (0, maci_circuits_1.extractVk)(processMessagesZkeyPathNonQv));
    const tallyVkNonQv = tallyVotesZkeyPathNonQv && maci_domainobjs_1.VerifyingKey.fromObj(await (0, maci_circuits_1.extractVk)(tallyVotesZkeyPathNonQv));
    // validate args
    if (stateTreeDepth < 1 ||
        intStateTreeDepth < 1 ||
        messageTreeDepth < 1 ||
        voteOptionTreeDepth < 1 ||
        messageBatchDepth < 1) {
        (0, utils_1.logError)("Invalid depth or batch size parameters");
    }
    if (stateTreeDepth < intStateTreeDepth) {
        (0, utils_1.logError)("Invalid state tree depth or intermediate state tree depth");
    }
    checkZkeyFilepaths({
        processMessagesZkeyPath: processMessagesZkeyPathQv,
        tallyVotesZkeyPath: tallyVotesZkeyPathQv,
        stateTreeDepth,
        messageTreeDepth,
        messageBatchDepth,
        voteOptionTreeDepth,
        intStateTreeDepth,
    });
    checkZkeyFilepaths({
        processMessagesZkeyPath: processMessagesZkeyPathNonQv,
        tallyVotesZkeyPath: tallyVotesZkeyPathNonQv,
        stateTreeDepth,
        messageTreeDepth,
        messageBatchDepth,
        voteOptionTreeDepth,
        intStateTreeDepth,
    });
    // ensure we have a contract deployed at the provided address
    if (!(await (0, utils_1.contractExists)(signer.provider, vkRegistryAddress))) {
        (0, utils_1.logError)(`A VkRegistry contract is not deployed at ${vkRegistryAddress}`);
    }
    // connect to VkRegistry contract
    const vkRegistryContract = typechain_types_1.VkRegistry__factory.connect(vkRegistryAddress, signer);
    const messageBatchSize = maci_core_1.MESSAGE_TREE_ARITY ** messageBatchDepth;
    // check if the process messages vk was already set
    const processVkSig = (0, maci_core_1.genProcessVkSig)(stateTreeDepth, messageTreeDepth, voteOptionTreeDepth, messageBatchSize);
    if (useQuadraticVoting && (await vkRegistryContract.isProcessVkSet(processVkSig, maci_contracts_1.EMode.QV))) {
        (0, utils_1.logError)("This process verifying key is already set in the contract");
    }
    if (!useQuadraticVoting && (await vkRegistryContract.isProcessVkSet(processVkSig, maci_contracts_1.EMode.NON_QV))) {
        (0, utils_1.logError)("This process verifying key is already set in the contract");
    }
    // do the same for the tally votes vk
    const tallyVkSig = (0, maci_core_1.genTallyVkSig)(stateTreeDepth, intStateTreeDepth, voteOptionTreeDepth);
    if (useQuadraticVoting && (await vkRegistryContract.isTallyVkSet(tallyVkSig, maci_contracts_1.EMode.QV))) {
        (0, utils_1.logError)("This tally verifying key is already set in the contract");
    }
    if (!useQuadraticVoting && (await vkRegistryContract.isTallyVkSet(tallyVkSig, maci_contracts_1.EMode.NON_QV))) {
        (0, utils_1.logError)("This tally verifying key is already set in the contract");
    }
    // actually set those values
    try {
        (0, utils_1.logYellow)(quiet, (0, utils_1.info)("Setting verifying keys..."));
        const processZkeys = [processVkQv, processVkNonQv]
            .filter(Boolean)
            .map((vk) => vk.asContractParam());
        const tallyZkeys = [tallyVkQv, tallyVkNonQv]
            .filter(Boolean)
            .map((vk) => vk.asContractParam());
        const modes = [];
        if (processVkQv && tallyVkQv) {
            modes.push(maci_contracts_1.EMode.QV);
        }
        if (processVkNonQv && tallyVkNonQv) {
            modes.push(maci_contracts_1.EMode.NON_QV);
        }
        // set them onchain
        const tx = await vkRegistryContract.setVerifyingKeysBatch(stateTreeDepth, intStateTreeDepth, messageTreeDepth, voteOptionTreeDepth, messageBatchSize, modes, processZkeys, tallyZkeys);
        const receipt = await tx.wait();
        if (receipt?.status !== 1) {
            (0, utils_1.logError)("Set verifying keys transaction failed");
        }
        (0, utils_1.logYellow)(quiet, (0, utils_1.info)(`Transaction hash: ${receipt.hash}`));
        // confirm that they were actually set correctly
        if (useQuadraticVoting) {
            const processVkOnChain = await vkRegistryContract.getProcessVk(stateTreeDepth, messageTreeDepth, voteOptionTreeDepth, messageBatchSize, maci_contracts_1.EMode.QV);
            const tallyVkOnChain = await vkRegistryContract.getTallyVk(stateTreeDepth, intStateTreeDepth, voteOptionTreeDepth, maci_contracts_1.EMode.QV);
            if (!(0, utils_1.compareVks)(processVkQv, processVkOnChain)) {
                (0, utils_1.logError)("processVk mismatch");
            }
            if (!(0, utils_1.compareVks)(tallyVkQv, tallyVkOnChain)) {
                (0, utils_1.logError)("tallyVk mismatch");
            }
        }
        else {
            const processVkOnChain = await vkRegistryContract.getProcessVk(stateTreeDepth, messageTreeDepth, voteOptionTreeDepth, messageBatchSize, maci_contracts_1.EMode.NON_QV);
            const tallyVkOnChain = await vkRegistryContract.getTallyVk(stateTreeDepth, intStateTreeDepth, voteOptionTreeDepth, maci_contracts_1.EMode.NON_QV);
            if (!(0, utils_1.compareVks)(processVkNonQv, processVkOnChain)) {
                (0, utils_1.logError)("processVk mismatch");
            }
            if (!(0, utils_1.compareVks)(tallyVkNonQv, tallyVkOnChain)) {
                (0, utils_1.logError)("tallyVk mismatch");
            }
        }
    }
    catch (error) {
        (0, utils_1.logError)(error.message);
    }
    (0, utils_1.logGreen)(quiet, (0, utils_1.success)("Verifying keys set successfully"));
};
exports.setVerifyingKeys = setVerifyingKeys;
function checkZkeyFilepaths({ processMessagesZkeyPath, tallyVotesZkeyPath, stateTreeDepth, messageTreeDepth, messageBatchDepth, voteOptionTreeDepth, intStateTreeDepth, }) {
    if (!processMessagesZkeyPath || !tallyVotesZkeyPath) {
        return;
    }
    // Check the pm zkey filename against specified params
    const pmMatch = processMessagesZkeyPath.match(/.+_(\d+)-(\d+)-(\d+)-(\d+)/);
    if (!pmMatch) {
        (0, utils_1.logError)(`${processMessagesZkeyPath} has an invalid filename`);
        return;
    }
    const pmStateTreeDepth = Number(pmMatch[1]);
    const pmMsgTreeDepth = Number(pmMatch[2]);
    const pmMsgBatchDepth = Number(pmMatch[3]);
    const pmVoteOptionTreeDepth = Number(pmMatch[4]);
    const tvMatch = tallyVotesZkeyPath.match(/.+_(\d+)-(\d+)-(\d+)/);
    if (!tvMatch) {
        (0, utils_1.logError)(`${tallyVotesZkeyPath} has an invalid filename`);
        return;
    }
    const tvStateTreeDepth = Number(tvMatch[1]);
    const tvIntStateTreeDepth = Number(tvMatch[2]);
    const tvVoteOptionTreeDepth = Number(tvMatch[3]);
    if (stateTreeDepth !== pmStateTreeDepth ||
        messageTreeDepth !== pmMsgTreeDepth ||
        messageBatchDepth !== pmMsgBatchDepth ||
        voteOptionTreeDepth !== pmVoteOptionTreeDepth ||
        stateTreeDepth !== tvStateTreeDepth ||
        intStateTreeDepth !== tvIntStateTreeDepth ||
        voteOptionTreeDepth !== tvVoteOptionTreeDepth) {
        (0, utils_1.logError)("Incorrect .zkey file; please check the circuit params");
    }
}
//# sourceMappingURL=setVerifyingKeys.js.map