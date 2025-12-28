"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mergeMessages = void 0;
const typechain_types_1 = require("maci-contracts/typechain-types");
const banner_1 = require("../utils/banner");
const contracts_1 = require("../utils/contracts");
const defaults_1 = require("../utils/defaults");
const storage_1 = require("../utils/storage");
const theme_1 = require("../utils/theme");
/**
 * Merge the message queue on chain
 * @param MergeMessagesArgs - The arguments for the mergeMessages command
 */
const mergeMessages = async ({ pollId, quiet = true, maciAddress, numQueueOps, signer, }) => {
    (0, banner_1.banner)(quiet);
    const network = await signer.provider?.getNetwork();
    // maci contract validation
    const maciContractAddress = maciAddress || (await (0, storage_1.readContractAddress)("MACI", network?.name));
    if (!maciContractAddress) {
        (0, theme_1.logError)("Could not read contracts");
    }
    if (!(await (0, contracts_1.contractExists)(signer.provider, maciContractAddress))) {
        (0, theme_1.logError)("MACI contract does not exist");
    }
    if (pollId < 0) {
        (0, theme_1.logError)("Invalid poll id");
    }
    const maciContract = typechain_types_1.MACI__factory.connect(maciContractAddress, signer);
    const pollContracts = await maciContract.polls(pollId);
    if (!(await (0, contracts_1.contractExists)(signer.provider, pollContracts.poll))) {
        (0, theme_1.logError)("Poll contract does not exist");
    }
    const pollContract = typechain_types_1.Poll__factory.connect(pollContracts.poll, signer);
    const extContracts = await pollContract.extContracts();
    const messageAqContractAddr = extContracts.messageAq;
    const accQueueContract = typechain_types_1.AccQueue__factory.connect(messageAqContractAddr, signer);
    // check if it's time to merge the message AQ
    const dd = await pollContract.getDeployTimeAndDuration();
    const deadline = Number(dd[0]) + Number(dd[1]);
    const now = await (0, contracts_1.currentBlockTimestamp)(signer.provider);
    if (now < deadline) {
        (0, theme_1.logError)("The voting period is not over yet");
    }
    let subTreesMerged = false;
    // infinite loop to merge the sub trees
    while (!subTreesMerged) {
        // eslint-disable-next-line no-await-in-loop
        subTreesMerged = await accQueueContract.subTreesMerged();
        if (subTreesMerged) {
            (0, theme_1.logGreen)(quiet, (0, theme_1.success)("All message subtrees have been merged."));
        }
        else {
            // eslint-disable-next-line no-await-in-loop
            await accQueueContract
                .getSrIndices()
                .then((data) => data.map((x) => Number(x)))
                .then((indices) => {
                (0, theme_1.logYellow)(quiet, (0, theme_1.info)(`Merging message subroots ${indices[0] + 1} / ${indices[1] + 1}`));
            });
            // eslint-disable-next-line no-await-in-loop
            const tx = await pollContract.mergeMessageAqSubRoots(numQueueOps || defaults_1.DEFAULT_SR_QUEUE_OPS);
            // eslint-disable-next-line no-await-in-loop
            const receipt = await tx.wait();
            if (receipt?.status !== 1) {
                (0, theme_1.logError)("Transaction failed");
            }
            (0, theme_1.logGreen)(quiet, (0, theme_1.success)(`Executed mergeMessageAqSubRoots(); gas used: ${receipt.gasUsed.toString()}`));
            (0, theme_1.logYellow)(quiet, (0, theme_1.info)(`Transaction hash: ${receipt.hash}`));
        }
    }
    // check if the message AQ has been fully merged
    const messageTreeDepth = Number((await pollContract.treeDepths()).messageTreeDepth);
    // check if the main root was not already computed
    const mainRoot = (await accQueueContract.getMainRoot(messageTreeDepth.toString())).toString();
    if (mainRoot === "0") {
        // go and merge the message tree
        (0, theme_1.logYellow)(quiet, (0, theme_1.info)("Merging subroots to a main message root..."));
        const tx = await pollContract.mergeMessageAq();
        const receipt = await tx.wait();
        if (receipt?.status !== 1) {
            (0, theme_1.logError)("Transaction failed");
        }
        (0, theme_1.logGreen)(quiet, (0, theme_1.success)(`Executed mergeMessageAq(); gas used: ${receipt.gasUsed.toString()}`));
        (0, theme_1.logYellow)(quiet, (0, theme_1.info)(`Transaction hash: ${receipt.hash}`));
        (0, theme_1.logGreen)(quiet, (0, theme_1.success)("The message tree has been merged."));
    }
    else {
        (0, theme_1.logYellow)(quiet, (0, theme_1.info)("The message tree has already been merged."));
    }
};
exports.mergeMessages = mergeMessages;
//# sourceMappingURL=mergeMessages.js.map