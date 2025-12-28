"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.verify = void 0;
const typechain_types_1 = require("maci-contracts/typechain-types");
const maci_crypto_1 = require("maci-crypto");
const banner_1 = require("../utils/banner");
const contracts_1 = require("../utils/contracts");
const theme_1 = require("../utils/theme");
const verifiers_1 = require("../utils/verifiers");
/**
 * Verify the results of a poll on-chain
 * @param VerifyArgs - The arguments for the verify command
 */
const verify = async ({ pollId, tallyData, maciAddress, signer, quiet = true }) => {
    (0, banner_1.banner)(quiet);
    const tallyResults = tallyData;
    const useQv = tallyResults.isQuadratic;
    // prioritize the tally file data
    const maciContractAddress = tallyResults.maci || maciAddress;
    // check existence of MACI, Tally and Subsidy contract addresses
    if (!maciContractAddress) {
        (0, theme_1.logError)("MACI contract address is empty");
    }
    if (!(await (0, contracts_1.contractExists)(signer.provider, maciContractAddress))) {
        (0, theme_1.logError)(`Error: there is no MACI contract deployed at ${maciContractAddress}.`);
    }
    // get the contract objects
    const maciContract = typechain_types_1.MACI__factory.connect(maciContractAddress, signer);
    const pollContracts = await maciContract.polls(pollId);
    const pollContract = typechain_types_1.Poll__factory.connect(pollContracts.poll, signer);
    const tallyContract = typechain_types_1.Tally__factory.connect(pollContracts.tally, signer);
    // verification
    const onChainTallyCommitment = BigInt(await tallyContract.tallyCommitment());
    (0, theme_1.logYellow)(quiet, (0, theme_1.info)(`on-chain tally commitment: ${onChainTallyCommitment.toString(16)}`));
    // check the results commitment
    const validResultsCommitment = tallyResults.newTallyCommitment.match(/0x[a-fA-F0-9]+/);
    if (!validResultsCommitment) {
        (0, theme_1.logError)("Invalid results commitment format");
    }
    const treeDepths = await pollContract.treeDepths();
    const voteOptionTreeDepth = Number(treeDepths.voteOptionTreeDepth);
    const numVoteOptions = 5 ** voteOptionTreeDepth;
    if (tallyResults.results.tally.length !== numVoteOptions) {
        (0, theme_1.logError)("Wrong number of vote options.");
    }
    // compute newResultsCommitment
    const newResultsCommitment = (0, maci_crypto_1.genTreeCommitment)(tallyResults.results.tally.map((x) => BigInt(x)), BigInt(tallyResults.results.salt), voteOptionTreeDepth);
    // compute newSpentVoiceCreditsCommitment
    const newSpentVoiceCreditsCommitment = (0, maci_crypto_1.hash2)([
        BigInt(tallyResults.totalSpentVoiceCredits.spent),
        BigInt(tallyResults.totalSpentVoiceCredits.salt),
    ]);
    if (useQv) {
        if (tallyResults.perVOSpentVoiceCredits?.tally.length !== numVoteOptions) {
            (0, theme_1.logError)("Wrong number of vote options.");
        }
        // verify that the results commitment matches the output of genTreeCommitment()
        // compute newPerVOSpentVoiceCreditsCommitment
        const newPerVOSpentVoiceCreditsCommitment = (0, maci_crypto_1.genTreeCommitment)(tallyResults.perVOSpentVoiceCredits.tally.map((x) => BigInt(x)), BigInt(tallyResults.perVOSpentVoiceCredits.salt), voteOptionTreeDepth);
        // compute newTallyCommitment
        const newTallyCommitment = (0, maci_crypto_1.hash3)([
            newResultsCommitment,
            newSpentVoiceCreditsCommitment,
            newPerVOSpentVoiceCreditsCommitment,
        ]);
        if (onChainTallyCommitment !== newTallyCommitment) {
            (0, theme_1.logError)("The on-chain tally commitment does not match.");
        }
        (0, theme_1.logGreen)(quiet, (0, theme_1.success)("The on-chain tally commitment matches."));
        // verify total spent voice credits on-chain
        const isValid = await tallyContract.verifySpentVoiceCredits(tallyResults.totalSpentVoiceCredits.spent, tallyResults.totalSpentVoiceCredits.salt, newResultsCommitment, newPerVOSpentVoiceCreditsCommitment);
        if (isValid) {
            (0, theme_1.logGreen)(quiet, (0, theme_1.success)("The on-chain verification of total spent voice credits passed."));
        }
        else {
            (0, theme_1.logError)("The on-chain verification of total spent voice credits failed.");
        }
        // verify per vote option voice credits on-chain
        const failedSpentCredits = await (0, verifiers_1.verifyPerVOSpentVoiceCredits)(tallyContract, tallyResults, voteOptionTreeDepth, newSpentVoiceCreditsCommitment, newResultsCommitment);
        if (failedSpentCredits.length === 0) {
            (0, theme_1.logGreen)(quiet, (0, theme_1.success)("The on-chain verification of per vote option spent voice credits passed"));
        }
        else {
            (0, theme_1.logError)(`At least one tally result failed the on-chain verification. Please check your Tally data at these indexes: ${failedSpentCredits.join(", ")}`);
        }
        // verify tally result on-chain for each vote option
        const failedPerVOSpentCredits = await (0, verifiers_1.verifyTallyResults)(tallyContract, tallyResults, voteOptionTreeDepth, newSpentVoiceCreditsCommitment, newPerVOSpentVoiceCreditsCommitment);
        if (failedPerVOSpentCredits.length === 0) {
            (0, theme_1.logGreen)(quiet, (0, theme_1.success)("The on-chain verification of tally results passed"));
        }
        else {
            (0, theme_1.logError)(`At least one spent voice credits entry in the tally results failed the on-chain verification. Please check your tally results at these indexes: ${failedPerVOSpentCredits.join(", ")}`);
        }
    }
    else {
        // verify that the results commitment matches the output of genTreeCommitment()
        // compute newTallyCommitment
        const newTallyCommitment = (0, maci_crypto_1.hashLeftRight)(newResultsCommitment, newSpentVoiceCreditsCommitment);
        if (onChainTallyCommitment !== newTallyCommitment) {
            (0, theme_1.logError)("The on-chain tally commitment does not match.");
        }
        (0, theme_1.logGreen)(quiet, (0, theme_1.success)("The on-chain tally commitment matches."));
        // verify total spent voice credits on-chain
        const isValid = await tallyContract.verifySpentVoiceCredits(tallyResults.totalSpentVoiceCredits.spent, tallyResults.totalSpentVoiceCredits.salt, newResultsCommitment, 0n);
        if (isValid) {
            (0, theme_1.logGreen)(quiet, (0, theme_1.success)("The on-chain verification of total spent voice credits passed."));
        }
        else {
            (0, theme_1.logError)("The on-chain verification of total spent voice credits failed.");
        }
        // verify tally result on-chain for each vote option
        const failedResult = await (0, verifiers_1.verifyTallyResults)(tallyContract, tallyResults, voteOptionTreeDepth, newSpentVoiceCreditsCommitment);
        if (failedResult.length === 0) {
            (0, theme_1.logGreen)(quiet, (0, theme_1.success)("The on-chain verification of tally results passed"));
        }
        else {
            (0, theme_1.logError)(`At least one result entry in the tally results failed the on-chain verification. Please check your tally results at these indexes: ${failedResult.join(", ")}`);
        }
    }
};
exports.verify = verify;
//# sourceMappingURL=verify.js.map