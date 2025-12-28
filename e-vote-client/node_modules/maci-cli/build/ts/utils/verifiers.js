"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyTallyResults = exports.verifyPerVOSpentVoiceCredits = void 0;
const maci_crypto_1 = require("maci-crypto");
/**
 * Loop through each per vote option spent voice credits and verify it on-chain
 *
 * @param tallyContract The tally contract
 * @param tallyData The tally.json file data
 * @param voteOptionTreeDepth The vote option tree depth
 * @param newSpentVoiceCreditsCommitment The total spent voice credits commitment
 * @param newResultsCommitment The tally result commitment
 * @returns list of the indexes of the tally result that failed on-chain verification
 */
const verifyPerVOSpentVoiceCredits = async (tallyContract, tallyData, voteOptionTreeDepth, newSpentVoiceCreditsCommitment, newResultsCommitment) => {
    const failedIndices = [];
    for (let i = 0; i < tallyData.perVOSpentVoiceCredits.tally.length; i += 1) {
        const proof = (0, maci_crypto_1.genTreeProof)(i, tallyData.perVOSpentVoiceCredits.tally.map((x) => BigInt(x)), voteOptionTreeDepth);
        // eslint-disable-next-line no-await-in-loop
        const isValid = await tallyContract.verifyPerVOSpentVoiceCredits(i, tallyData.perVOSpentVoiceCredits.tally[i], proof, tallyData.perVOSpentVoiceCredits.salt, voteOptionTreeDepth, newSpentVoiceCreditsCommitment, newResultsCommitment);
        if (!isValid) {
            failedIndices.push(i);
        }
    }
    return failedIndices;
};
exports.verifyPerVOSpentVoiceCredits = verifyPerVOSpentVoiceCredits;
/**
 * Loop through each tally result and verify it on-chain
 * @param tallyContract The tally contract
 * @param tallyData The tally.json file data
 * @param voteOptionTreeDepth The vote option tree depth
 * @param newSpentVoiceCreditsCommitment The total spent voice credits commitment
 * @param newPerVOSpentVoiceCreditsCommitment The per vote option voice credits commitment
 * @returns list of the indexes of the tally result that failed on-chain verification
 */
const verifyTallyResults = async (tallyContract, tallyData, voteOptionTreeDepth, newSpentVoiceCreditsCommitment, newPerVOSpentVoiceCreditsCommitment) => {
    const failedIndices = [];
    for (let i = 0; i < tallyData.results.tally.length; i += 1) {
        const proof = (0, maci_crypto_1.genTreeProof)(i, tallyData.results.tally.map((x) => BigInt(x)), voteOptionTreeDepth);
        // eslint-disable-next-line no-await-in-loop
        const isValid = await tallyContract.verifyTallyResult(i, tallyData.results.tally[i], proof, tallyData.results.salt, voteOptionTreeDepth, newSpentVoiceCreditsCommitment, newPerVOSpentVoiceCreditsCommitment ?? 0n);
        if (!isValid) {
            failedIndices.push(i);
        }
    }
    return failedIndices;
};
exports.verifyTallyResults = verifyTallyResults;
//# sourceMappingURL=verifiers.js.map