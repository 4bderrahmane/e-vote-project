import { type TallyData, type GenProofsArgs } from "../utils";
/**
 * Generate proofs for the message processing and tally calculations
 * @note see different options for zkey files to use specific circuits https://maci.pse.dev/docs/trusted-setup, https://maci.pse.dev/docs/testing/#pre-compiled-artifacts-for-testing
 * @param GenProofsArgs - The arguments for the genProofs command
 * @returns The tally data
 */
export declare const genProofs: ({ outputDir, tallyFile, tallyZkey, processZkey, pollId, rapidsnark, processWitgen, processDatFile, tallyWitgen, tallyDatFile, coordinatorPrivKey, maciAddress, transactionHash, processWasm, tallyWasm, useWasm, stateFile, startBlock, blocksPerBatch, endBlock, signer, useQuadraticVoting, quiet, }: GenProofsArgs) => Promise<TallyData>;
//# sourceMappingURL=genProofs.d.ts.map