import type { BigIntVariants, StringifiedBigInts } from "./types";
/**
 * Given an input containing string values, convert them
 * to bigint
 * @param input - The input to convert
 * @returns the input with string values converted to bigint
 */
export declare const unstringifyBigInts: (input: StringifiedBigInts) => BigIntVariants;
/**
 * Converts a string to a bigint using the given radix
 * @param str - The string to convert
 * @param radix - The radix to use
 * @returns The converted string as a bigint
 */
export declare const fromString: (str: string, radix: number) => bigint;
/**
 * Parses a buffer with Little Endian Representation
 * @param buff - The buffer to parse
 * @param o - The offset to start from
 * @param n8 - The byte length
 * @returns The parsed buffer as a string
 */
export declare const fromRprLE: (buff: ArrayBufferView, o?: number, n8?: number) => string;
/**
 * Given an input of bigint values, convert them to their string representations
 * @param input - The input to convert
 * @returns The input with bigint values converted to string
 */
export declare const stringifyBigInts: (input: BigIntVariants) => StringifiedBigInts;
/**
 * Create a copy of a bigint array
 * @param arr - the array of bigints to copy
 * @returns a deep copy of the array
 */
export declare const deepCopyBigIntArray: (arr: bigint[]) => bigint[];
/**
 * Sihft a left by n bits
 * @param a - The first bigint
 * @param n - The second bigint
 * @returns The result of shifting a right by n
 */
export declare const shiftRight: (a: bigint, n: bigint) => bigint;
/**
 * Convert a BigInt to a Buffer
 * @param i - the bigint to convert
 * @returns the buffer
 */
export declare const bigInt2Buffer: (i: bigint) => Buffer;
//# sourceMappingURL=bigIntUtils.d.ts.map