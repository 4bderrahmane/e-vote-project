"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.calcQuinTreeDepthFromMaxLeaves = exports.calcBinaryTreeDepthFromMaxLeaves = void 0;
/**
 * Utility to calculate the depth of a binary tree
 * @param maxLeaves - the number of leaves in the tree
 * @returns the depth of the tree
 */
const calcBinaryTreeDepthFromMaxLeaves = (maxLeaves) => {
    let result = 0;
    while (2 ** result < maxLeaves) {
        result += 1;
    }
    return result;
};
exports.calcBinaryTreeDepthFromMaxLeaves = calcBinaryTreeDepthFromMaxLeaves;
/**
 * Utility to calculate the depth of a quin tree
 * @param maxLeaves the number of leaves in the tree
 * @returns the depth of the tree
 */
const calcQuinTreeDepthFromMaxLeaves = (maxLeaves) => {
    let result = 0;
    while (5 ** result < maxLeaves) {
        result += 1;
    }
    return result;
};
exports.calcQuinTreeDepthFromMaxLeaves = calcQuinTreeDepthFromMaxLeaves;
//# sourceMappingURL=trees.js.map