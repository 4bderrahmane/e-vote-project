import type { TallyData } from "./interfaces";
import type { Tally } from "maci-contracts";
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
export declare const verifyPerVOSpentVoiceCredits: (tallyContract: Tally, tallyData: TallyData, voteOptionTreeDepth: number, newSpentVoiceCreditsCommitment: bigint, newResultsCommitment: bigint) => Promise<number[]>;
/**
 * Loop through each tally result and verify it on-chain
 * @param tallyContract The tally contract
 * @param tallyData The tally.json file data
 * @param voteOptionTreeDepth The vote option tree depth
 * @param newSpentVoiceCreditsCommitment The total spent voice credits commitment
 * @param newPerVOSpentVoiceCreditsCommitment The per vote option voice credits commitment
 * @returns list of the indexes of the tally result that failed on-chain verification
 */
export declare const verifyTallyResults: (tallyContract: Tally, tallyData: TallyData, voteOptionTreeDepth: number, newSpentVoiceCreditsCommitment: bigint, newPerVOSpentVoiceCreditsCommitment?: bigint) => Promise<number[]>;
//# sourceMappingURL=verifiers.d.ts.map