"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.genEmptyBallotRoots = void 0;
const maci_core_1 = require("maci-core");
const maci_crypto_1 = require("maci-crypto");
const maci_domainobjs_1 = require("maci-domainobjs");
/**
 * Generate empty ballot roots for a given state tree depth
 * @param stateTreeDepth The depth of the state tree
 * @returns The empty ballot roots
 */
const genEmptyBallotRoots = (stateTreeDepth) => {
    const roots = [];
    for (let i = 0; i < 5; i += 1) {
        const ballot = new maci_domainobjs_1.Ballot(0, i + 1);
        // The empty Ballot tree root
        const ballotTree = new maci_crypto_1.IncrementalQuinTree(stateTreeDepth, ballot.hash(), maci_core_1.STATE_TREE_ARITY, maci_crypto_1.hash2);
        roots.push(ballotTree.root);
    }
    return roots;
};
exports.genEmptyBallotRoots = genEmptyBallotRoots;
//# sourceMappingURL=genEmptyBallotRoots.js.map