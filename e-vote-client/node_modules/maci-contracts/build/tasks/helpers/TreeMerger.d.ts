import type { ITreeMergeParams } from "./types";
/**
 * @notice Tree merger keeps merging simple for hardhat task.
 * This class is using for merging signups and messages.
 */
export declare class TreeMerger {
    /**
     * User messages AccQueue contract
     */
    private messageAccQueueContract;
    /**
     * Poll contract
     */
    private pollContract;
    /**
     * Ethers signer
     */
    private deployer;
    /**
     * Initialize class properties
     *
     * @param {ITreeMergeParams} params - contracts and signer
     */
    constructor({ deployer, messageAccQueueContract, pollContract }: ITreeMergeParams);
    /**
     * Check if voting period is over. Otherwise, throw an error.
     */
    checkPollDuration(): Promise<void>;
    /**
     * Merge user signup MACI state
     *
     * @param pollId - poll id
     */
    mergeSignups(): Promise<void>;
    /**
     * Merge message subtrees
     *
     * @param queueOps - the number of queue operations to perform
     */
    mergeMessageSubtrees(queueOps: number): Promise<void>;
    /**
     * Merge message queue
     */
    mergeMessages(): Promise<void>;
}
//# sourceMappingURL=TreeMerger.d.ts.map