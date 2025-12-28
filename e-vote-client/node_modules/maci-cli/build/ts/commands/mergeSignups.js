"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mergeSignups = void 0;
const typechain_types_1 = require("maci-contracts/typechain-types");
const banner_1 = require("../utils/banner");
const contracts_1 = require("../utils/contracts");
const storage_1 = require("../utils/storage");
const theme_1 = require("../utils/theme");
/**
 * Command to merge the signups of a MACI contract
 * @param MergeSignupsArgs - The arguments for the mergeSignups command
 */
const mergeSignups = async ({ pollId, maciAddress, signer, quiet = true }) => {
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
    // check if it's time to merge the message AQ
    const dd = await pollContract.getDeployTimeAndDuration();
    const deadline = Number(dd[0]) + Number(dd[1]);
    const now = await (0, contracts_1.currentBlockTimestamp)(signer.provider);
    if (now < deadline) {
        (0, theme_1.logError)("Voting period is not over");
    }
    if (!(await pollContract.stateMerged())) {
        // go and merge the state tree
        (0, theme_1.logYellow)(quiet, (0, theme_1.info)("Calculating root and storing on Poll..."));
        const tx = await pollContract.mergeMaciState();
        const receipt = await tx.wait();
        if (receipt?.status !== 1) {
            (0, theme_1.logError)("Error merging state subroots");
        }
        (0, theme_1.logYellow)(quiet, (0, theme_1.info)(`Transaction hash: ${receipt.hash}`));
        (0, theme_1.logGreen)(quiet, (0, theme_1.success)(`Executed mergeStateAq(); gas used: ${receipt.gasUsed.toString()}`));
    }
    else {
        (0, theme_1.logError)("The state tree has already been merged.");
    }
};
exports.mergeSignups = mergeSignups;
//# sourceMappingURL=mergeSignups.js.map