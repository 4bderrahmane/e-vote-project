import type { Plaintext } from "./types";
/**
 * Hash an array of uint256 values the same way that the EVM does.
 * @param input - the array of values to hash
 * @returns a EVM compatible sha256 hash
 */
export declare const sha256Hash: (input: bigint[]) => bigint;
/**
 * Generate the poseidon hash of the inputs provided
 * @param inputs The inputs to hash
 * @returns the hash of the inputs
 */
export declare const poseidon: (inputs: bigint[]) => bigint;
/**
 * Hash up to 2 elements
 * @param inputs The elements to hash
 * @returns the hash of the elements
 */
export declare const poseidonT3: (inputs: bigint[]) => bigint;
/**
 * Hash up to 3 elements
 * @param inputs The elements to hash
 * @returns the hash of the elements
 */
export declare const poseidonT4: (inputs: bigint[]) => bigint;
/**
 * Hash up to 4 elements
 * @param inputs The elements to hash
 * @returns the hash of the elements
 */
export declare const poseidonT5: (inputs: bigint[]) => bigint;
/**
 * Hash up to 5 elements
 * @param inputs The elements to hash
 * @returns the hash of the elements
 */
export declare const poseidonT6: (inputs: bigint[]) => bigint;
/**
 * Hash two BigInts with the Poseidon hash function
 * @param left The left-hand element to hash
 * @param right The right-hand element to hash
 * @returns The hash of the two elements
 */
export declare const hashLeftRight: (left: bigint, right: bigint) => bigint;
/**
 * Hash up to N elements
 * @param numElements The number of elements to hash
 * @param elements The elements to hash
 * @returns The hash of the elements
 */
export declare const hashN: (numElements: number, elements: Plaintext) => bigint;
export declare const hash2: (elements: Plaintext) => bigint;
export declare const hash3: (elements: Plaintext) => bigint;
export declare const hash4: (elements: Plaintext) => bigint;
export declare const hash5: (elements: Plaintext) => bigint;
/**
 * A convenience function to use Poseidon to hash a Plaintext with
 * no more than 13 elements
 * @param elements The elements to hash
 * @returns The hash of the elements
 */
export declare const hash12: (elements: Plaintext) => bigint;
/**
 * Hash a single BigInt with the Poseidon hash function
 * @param preImage The element to hash
 * @returns The hash of the element
 */
export declare const hashOne: (preImage: bigint) => bigint;
//# sourceMappingURL=hashing.d.ts.map