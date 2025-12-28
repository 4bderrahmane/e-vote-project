/**
 * Calculate the depth of a tree given the number of leaves
 * @param hashLength the hashing function param length
 * @param numLeaves how many leaves
 * @returns the depth
 */
export declare const calcDepthFromNumLeaves: (hashLength: number, numLeaves: number) => number;
/**
 * A helper function which hashes a list of results with a salt and returns the
 * hash.
 * @param leaves A list of values
 * @param salt A random salt
 * @param depth The tree depth
 * @returns The hash of the leaves and the salt, with the salt last
 */
export declare const genTreeCommitment: (leaves: bigint[], salt: bigint, depth: number) => bigint;
/**
 * A helper function to generate the tree proof for the value at the given index in the leaves
 * @param index The index of the value to generate the proof for
 * @param leaves A list of values
 * @param depth The tree depth
 * @returns The proof
 */
export declare const genTreeProof: (index: number, leaves: bigint[], depth: number) => bigint[][];
//# sourceMappingURL=utils.d.ts.map