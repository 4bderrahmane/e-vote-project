"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.transferOwnership = exports.getFeeData = exports.getSigners = exports.getDefaultNetwork = exports.getDefaultSigner = exports.log = exports.sleep = exports.formatProofForVerifierContract = void 0;
exports.sortActions = sortActions;
exports.asHex = asHex;
exports.generateMerkleTree = generateMerkleTree;
const merkle_tree_1 = require("@openzeppelin/merkle-tree");
/**
 * Format a SnarkProof type to an array of strings
 * which can be passed to the Groth16 verifier contract.
 * @param proof the SnarkProof to format
 * @returns an array of strings
 */
const formatProofForVerifierContract = (proof) => [
    proof.pi_a[0],
    proof.pi_a[1],
    proof.pi_b[0][1],
    proof.pi_b[0][0],
    proof.pi_b[1][1],
    proof.pi_b[1][0],
    proof.pi_c[0],
    proof.pi_c[1],
].map((x) => x.toString());
exports.formatProofForVerifierContract = formatProofForVerifierContract;
/**
 * Pause the thread for n milliseconds
 * @param ms - the amount of time to sleep in milliseconds
 */
const sleep = async (ms) => {
    await new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
};
exports.sleep = sleep;
/**
 * The comparison function for Actions based on block number and transaction
 * index.
 * @param actions - the array of actions to sort
 * @returns the sorted array of actions
 */
function sortActions(actions) {
    return actions.slice().sort((a, b) => {
        if (a.blockNumber > b.blockNumber) {
            return 1;
        }
        if (a.blockNumber < b.blockNumber) {
            return -1;
        }
        if (a.transactionIndex > b.transactionIndex) {
            return 1;
        }
        if (a.transactionIndex < b.transactionIndex) {
            return -1;
        }
        return 0;
    });
}
/**
 * Print to the console
 * @param msg - the message to print
 * @param quiet - whether to suppress console output
 */
const log = (msg, quiet) => {
    if (!quiet) {
        // eslint-disable-next-line no-console
        console.log(msg);
    }
};
exports.log = log;
/**
 * Get the default signer from the hardhat node
 * @returns the default signer
 */
const getDefaultSigner = async () => {
    const { ethers } = await Promise.resolve().then(() => __importStar(require("hardhat")));
    const [signer] = await ethers.getSigners();
    return signer;
};
exports.getDefaultSigner = getDefaultSigner;
/**
 * Get the default signer network from the hardhat node
 * @returns the default network
 */
const getDefaultNetwork = async () => {
    const signer = await (0, exports.getDefaultSigner)();
    return signer.provider?.getNetwork();
};
exports.getDefaultNetwork = getDefaultNetwork;
/**
 * Get all of the available signers from the hardhat node
 * @dev to be used while testing
 * @returns the signers
 */
const getSigners = async () => {
    const { ethers } = await Promise.resolve().then(() => __importStar(require("hardhat")));
    return ethers.getSigners();
};
exports.getSigners = getSigners;
/**
 * Get the current fee data from the blockchain node.
 * This is needed to ensure transaction go through in busy times
 * @returns - the fee data
 */
const getFeeData = async () => {
    const signer = await (0, exports.getDefaultSigner)();
    return signer.provider?.getFeeData();
};
exports.getFeeData = getFeeData;
/**
 * Transfer ownership of a contract (using Ownable from OpenZeppelin)
 * @param contract - the contract to transfer ownership of
 * @param newOwner - the address of the new owner
 * @param quiet - whether to suppress console output
 */
const transferOwnership = async (contract, newOwner, quiet = false) => {
    (0, exports.log)(`Transferring ownership of ${await contract.getAddress()} to ${newOwner}`, quiet);
    const tx = await contract.transferOwnership(newOwner, {
        maxFeePerGas: await (0, exports.getFeeData)().then((res) => res?.maxFeePerGas),
    });
    await tx.wait();
};
exports.transferOwnership = transferOwnership;
/**
 * Convert bignumberish to hex
 *
 * @param value - bignumberish string
 * @returns hex representation of it
 */
function asHex(value) {
    return `0x${BigInt(value).toString(16)}`;
}
function generateMerkleTree(elements) {
    return merkle_tree_1.StandardMerkleTree.of(elements, ["address"]);
}
//# sourceMappingURL=utils.js.map