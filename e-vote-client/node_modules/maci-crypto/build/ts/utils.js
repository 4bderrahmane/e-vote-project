"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.genTreeProof = exports.genTreeCommitment = exports.calcDepthFromNumLeaves = void 0;
const hashing_1 = require("./hashing");
const quinTree_1 = require("./quinTree");
/**
 * Calculate the depth of a tree given the number of leaves
 * @param hashLength the hashing function param length
 * @param numLeaves how many leaves
 * @returns the depth
 */
const calcDepthFromNumLeaves = (hashLength, numLeaves) => {
    let depth = 1;
    let max = hashLength ** depth;
    while (BigInt(max) < numLeaves) {
        depth += 1;
        max = hashLength ** depth;
    }
    return depth;
};
exports.calcDepthFromNumLeaves = calcDepthFromNumLeaves;
/**
 * A helper function which hashes a list of results with a salt and returns the
 * hash.
 * @param leaves A list of values
 * @param salt A random salt
 * @param depth The tree depth
 * @returns The hash of the leaves and the salt, with the salt last
 */
const genTreeCommitment = (leaves, salt, depth) => {
    const tree = new quinTree_1.IncrementalQuinTree(depth, 0n, 5, hashing_1.hash5);
    leaves.forEach((leaf) => {
        tree.insert(leaf);
    });
    return (0, hashing_1.hashLeftRight)(tree.root, salt);
};
exports.genTreeCommitment = genTreeCommitment;
/**
 * A helper function to generate the tree proof for the value at the given index in the leaves
 * @param index The index of the value to generate the proof for
 * @param leaves A list of values
 * @param depth The tree depth
 * @returns The proof
 */
const genTreeProof = (index, leaves, depth) => {
    const tree = new quinTree_1.IncrementalQuinTree(depth, 0n, 5, hashing_1.hash5);
    leaves.forEach((leaf) => {
        tree.insert(leaf);
    });
    const proof = tree.genProof(index);
    return proof.pathElements;
};
exports.genTreeProof = genTreeProof;
//# sourceMappingURL=utils.js.map