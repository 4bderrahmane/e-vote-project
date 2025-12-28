import type { Leaf, Node, IMerkleProof } from "./types";
/**
 * An implementation of an incremental Merkle tree
 * @dev adapted from https://github.com/weijiekoh/optimisedmt
 */
export declare class IncrementalQuinTree {
    depth: number;
    zeroValue: bigint;
    arity: number;
    hashFunc: (leaves: Leaf[]) => bigint;
    nextIndex: number;
    zeros: bigint[];
    root: bigint;
    nodes: Node;
    numNodes: number;
    capacity: number;
    /**
     * Create a new instance of the MaciQuinTree
     * @param depth The depth of the tree
     * @param zeroValue The zero value of the tree
     * @param arity The arity of the tree
     * @param hashFunc The hash function of the tree
     */
    constructor(depth: number, zeroValue: bigint, arity: number, hashFunc: (leaves: bigint[]) => bigint);
    /**
     * Insert a leaf at the next available index
     * @param value The value to insert
     */
    insert(value: Leaf): void;
    /**
     * Update a leaf at a given index
     * @param index The index of the leaf to update
     * @param value The value to update the leaf with
     */
    update(index: number, value: Leaf): void;
    /**
     * Calculate the indices of the leaves in the path to the root
     * @param index The index of the leaf
     * @returns The indices of the leaves in the path to the root
     */
    calcLeafIndices(index: number): number[];
    /**
     * Generate a proof for a given leaf index
     * @param index The index of the leaf to generate a proof for
     * @returns The proof
     */
    genProof(index: number): IMerkleProof;
    /**
     * Generates a Merkle proof from a subroot to the root.
     * @param startIndex The index of the first leaf
     * @param endIndex The index of the last leaf
     * @returns The Merkle proof
     */
    genSubrootProof(startIndex: number, endIndex: number): IMerkleProof;
    /**
     * Verify a proof
     * @param proof The proof to verify
     * @returns Whether the proof is valid
     */
    verifyProof: (proof: IMerkleProof) => boolean;
    /**
     * Calculate the indices of the parent
     * @param index The index of the leaf
     * @returns The indices of the parent
     */
    calcParentIndices(index: number): number[];
    /**
     * Calculate the indices of the children of a node
     * @param index The index of the node
     * @returns The indices of the children
     */
    calcChildIndices(index: number): number[];
    /**
     * Get a node at a given index
     * @param index The index of the node
     * @returns The node
     */
    getNode(index: number): Leaf;
    /**
     * Set a node (not the root)
     * @param index the index of the node
     * @param value the value of the node
     */
    setNode(index: number, value: Leaf): void;
    /**
     * Copy the tree to a new instance
     * @returns The new instance
     */
    copy(): IncrementalQuinTree;
    /**
     * Calculate the zeroes and the root of a tree
     * @param arity The arity of the tree
     * @param depth The depth of the tree
     * @param zeroValue The zero value of the tree
     * @param hashFunc The hash function of the tree
     * @returns The zeros and the root
     */
    private calcInitialVals;
}
//# sourceMappingURL=quinTree.d.ts.map