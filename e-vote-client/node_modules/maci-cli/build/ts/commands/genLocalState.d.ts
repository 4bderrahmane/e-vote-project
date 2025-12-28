import { type GenLocalStateArgs } from "../utils";
/**
 * Generate a local MACI state from the smart contracts events
 * @param GenLocalStateArgs - The arguments for the genLocalState command
 */
export declare const genLocalState: ({ outputPath, pollId, maciAddress, coordinatorPrivateKey, ethereumProvider, endBlock, startBlock, blockPerBatch, transactionHash, sleep, signer, quiet, }: GenLocalStateArgs) => Promise<void>;
//# sourceMappingURL=genLocalState.d.ts.map