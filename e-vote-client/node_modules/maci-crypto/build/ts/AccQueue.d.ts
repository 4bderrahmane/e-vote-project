import type { Leaf } from "./types";
/**
 * An Accumulator Queue which conforms to the implementation in AccQueue.sol.
 * Each enqueue() operation updates a subtree, and a merge() operation combines
 * all subtrees into a main tree.
 * @notice It supports 2 or 5 elements per leaf.
 */
export declare class AccQueue {
    private MAX_DEPTH;
    private subDepth;
    private hashLength;
    private zeroValue;
    private currentSubtreeIndex;
    private numLeaves;
    private leafQueue;
    private nextSRindexToQueue;
    private smallSRTroot;
    private subRootQueue;
    private subRoots;
    private mainRoots;
    private zeros;
    private subTreesMerged;
    readonly subHashFunc: (leaves: Leaf[]) => bigint;
    readonly hashFunc: (leaves: Leaf[]) => bigint;
    /**
     * Create a new instance of AccQueue
     * @param subDepth - the depth of the subtrees
     * @param hashLength - the number of leaves per node
     * @param zeroValue - the default value for empty leaves
     */
    constructor(subDepth: number, hashLength: number, zeroValue: bigint);
    /**
     * Get the small SRT root
     * @returns small SRT root
     */
    getSmallSRTroot(): bigint;
    /**
     * Get the subroots
     * @returns subroots
     */
    getSubRoots(): Leaf[];
    /**
     * Get the subdepth
     * @returns subdepth
     */
    getSubDepth(): number;
    /**
     * Get the root of merged subtrees
     * @returns the root of merged subtrees
     */
    getMainRoots(): Leaf[];
    /**
     * Get the zero values per level. i.e. zeros[0] is zeroValue,
     * zeros[1] is the hash of leavesPerNode zeros, and so on.
     * @returns zeros
     */
    getZeros(): bigint[];
    /**
     * Get the subroot at a given index
     * @param index - The index of the subroot
     * @returns the subroot
     */
    getSubRoot(index: number): Leaf;
    /**
     * Get the number of inputs per hash function
     *
     * @returns the number of inputs
     */
    getHashLength(): number;
    /**
     * Enqueue a leaf into the current subtree
     * @param leaf The leaf to insert.
     * @returns The index of the leaf
     */
    enqueue(leaf: Leaf): number;
    /**
     * Private function that performs the actual enqueue operation
     * @param leaf - The leaf to insert
     * @param level - The level of the subtree
     */
    private enqueueOp;
    /**
     * Fill any empty leaves of the last subtree with zeros and store the
     * resulting subroot.
     */
    fill(): void;
    /**
     * Private function that performs the actual fill operation
     * @param level - The level of the subtree
     */
    private fillOp;
    /**
     * Calculate the depth of the smallest possible Merkle tree which fits all
     * @returns the depth of the smallest possible Merkle tree which fits all
     */
    calcSRTdepth(): number;
    /**
     * Insert a subtree into the queue. This is used when the subtree is
     * already computed.
     * @param subRoot - The root of the subtree
     */
    insertSubTree(subRoot: bigint): void;
    /**
     * Merge all the subroots into a tree of a specified depth.
     * It requires this.mergeSubRoots() to be run first.
     */
    merge(depth: number): void;
    /**
     * Merge all the subroots into a tree of a specified depth.
     * Uses an IncrementalQuinTree instead of the two-step method that
     * AccQueue.sol uses.
     */
    mergeDirect(depth: number): void;
    /**
     * Merge all subroots into the smallest possible Merkle tree which fits
     * them. e.g. if there are 5 subroots and hashLength == 2, the tree depth
     * is 3 since 2 ** 3 = 8 which is the next power of 2.
     * @param numSrQueueOps - The number of subroots to queue into the SRT
     */
    mergeSubRoots(numSrQueueOps?: number): void;
    /**
     * Queues the leaf (a subroot) into queuedSRTlevels
     * @param leaf - The leaf to insert
     * @param level - The level of the subtree
     * @param maxDepth - The maximum depth of the tree
     */
    private queueSubRoot;
    /**
     * Get the root at a certain depth
     * @param depth - The depth of the tree
     * @returns the root
     */
    getRoot(depth: number): bigint | null | undefined;
    /**
     * Check if the root at a certain depth exists (subtree root)
     * @param depth - the depth of the tree
     * @returns whether the root exists
     */
    hasRoot(depth: number): boolean;
    /**
     * @notice Deep-copies this object
     * @returns a deep copy of this object
     */
    copy(): AccQueue;
    /**
     * Convert map to 2D array
     *
     * @param map - map representation of 2D array
     * @returns 2D array
     */
    private mapToArray;
    /**
     * Convert 2D array to its map representation
     *
     * @param array - 2D array
     * @returns map representation of 2D array
     */
    private arrayToMap;
    /**
     * Hash an array of leaves
     * @param leaves - The leaves to hash
     * @returns the hash value of the leaves
     */
    hash(leaves: bigint[]): bigint;
}
//# sourceMappingURL=AccQueue.d.ts.map