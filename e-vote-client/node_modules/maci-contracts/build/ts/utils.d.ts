import { StandardMerkleTree } from "@openzeppelin/merkle-tree";
import type { Action, SnarkProof, Groth16Proof } from "./types";
import type { Ownable } from "../typechain-types";
import type { BigNumberish, FeeData, Network, Signer } from "ethers";
/**
 * Format a SnarkProof type to an array of strings
 * which can be passed to the Groth16 verifier contract.
 * @param proof the SnarkProof to format
 * @returns an array of strings
 */
export declare const formatProofForVerifierContract: (proof: SnarkProof | Groth16Proof) => string[];
/**
 * Pause the thread for n milliseconds
 * @param ms - the amount of time to sleep in milliseconds
 */
export declare const sleep: (ms: number) => Promise<void>;
/**
 * The comparison function for Actions based on block number and transaction
 * index.
 * @param actions - the array of actions to sort
 * @returns the sorted array of actions
 */
export declare function sortActions(actions: Action[]): Action[];
/**
 * Print to the console
 * @param msg - the message to print
 * @param quiet - whether to suppress console output
 */
export declare const log: (msg: string, quiet: boolean) => void;
/**
 * Get the default signer from the hardhat node
 * @returns the default signer
 */
export declare const getDefaultSigner: () => Promise<Signer>;
/**
 * Get the default signer network from the hardhat node
 * @returns the default network
 */
export declare const getDefaultNetwork: () => Promise<Network | undefined>;
/**
 * Get all of the available signers from the hardhat node
 * @dev to be used while testing
 * @returns the signers
 */
export declare const getSigners: () => Promise<Signer[]>;
/**
 * Get the current fee data from the blockchain node.
 * This is needed to ensure transaction go through in busy times
 * @returns - the fee data
 */
export declare const getFeeData: () => Promise<FeeData | undefined>;
/**
 * Transfer ownership of a contract (using Ownable from OpenZeppelin)
 * @param contract - the contract to transfer ownership of
 * @param newOwner - the address of the new owner
 * @param quiet - whether to suppress console output
 */
export declare const transferOwnership: <T extends Ownable>(contract: T, newOwner: string, quiet?: boolean) => Promise<void>;
/**
 * Convert bignumberish to hex
 *
 * @param value - bignumberish string
 * @returns hex representation of it
 */
export declare function asHex(value: BigNumberish): string;
export declare function generateMerkleTree(elements: string[][]): StandardMerkleTree<string[]>;
//# sourceMappingURL=utils.d.ts.map