"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.bigInt2Buffer = exports.shiftRight = exports.deepCopyBigIntArray = exports.stringifyBigInts = exports.fromRprLE = exports.fromString = exports.unstringifyBigInts = void 0;
/**
 * Given an input containing string values, convert them
 * to bigint
 * @param input - The input to convert
 * @returns the input with string values converted to bigint
 */
const unstringifyBigInts = (input) => {
    if (typeof input === "string" && /^[0-9]+$/.test(input)) {
        return BigInt(input);
    }
    if (typeof input === "string" && /^0x[0-9a-fA-F]+$/.test(input)) {
        return BigInt(input);
    }
    if (Array.isArray(input)) {
        return input.map(exports.unstringifyBigInts);
    }
    if (input === null) {
        return null;
    }
    if (typeof input === "object") {
        return Object.entries(input).reduce((acc, [key, value]) => {
            acc[key] = (0, exports.unstringifyBigInts)(value);
            return acc;
        }, {});
    }
    return input;
};
exports.unstringifyBigInts = unstringifyBigInts;
/**
 * Converts a string to a bigint using the given radix
 * @param str - The string to convert
 * @param radix - The radix to use
 * @returns The converted string as a bigint
 */
const fromString = (str, radix) => {
    if (!radix || radix === 10) {
        return BigInt(str);
    }
    if (radix === 16) {
        if (str.startsWith("0x")) {
            return BigInt(str);
        }
        return BigInt(`0x${str}`);
    }
    return BigInt(str);
};
exports.fromString = fromString;
/**
 * Parses a buffer with Little Endian Representation
 * @param buff - The buffer to parse
 * @param o - The offset to start from
 * @param n8 - The byte length
 * @returns The parsed buffer as a string
 */
const fromRprLE = (buff, o = 0, n8 = buff.byteLength) => {
    const v = new Uint32Array(buff.buffer, buff.byteOffset + o, n8 / 4);
    const a = new Array(n8 / 4);
    v.forEach((ch, i) => {
        a[a.length - i - 1] = ch.toString(16).padStart(8, "0");
    });
    return (0, exports.fromString)(a.join(""), 16).toString();
};
exports.fromRprLE = fromRprLE;
/**
 * Given an input of bigint values, convert them to their string representations
 * @param input - The input to convert
 * @returns The input with bigint values converted to string
 */
const stringifyBigInts = (input) => {
    if (typeof input === "bigint") {
        return input.toString();
    }
    if (input instanceof Uint8Array) {
        return (0, exports.fromRprLE)(input, 0);
    }
    if (Array.isArray(input)) {
        return input.map(exports.stringifyBigInts);
    }
    if (input === null) {
        return null;
    }
    if (typeof input === "object") {
        return Object.entries(input).reduce((acc, [key, value]) => {
            acc[key] = (0, exports.stringifyBigInts)(value);
            return acc;
        }, {});
    }
    return input;
};
exports.stringifyBigInts = stringifyBigInts;
/**
 * Create a copy of a bigint array
 * @param arr - the array of bigints to copy
 * @returns a deep copy of the array
 */
const deepCopyBigIntArray = (arr) => arr.map((x) => BigInt(x.toString()));
exports.deepCopyBigIntArray = deepCopyBigIntArray;
/**
 * Sihft a left by n bits
 * @param a - The first bigint
 * @param n - The second bigint
 * @returns The result of shifting a right by n
 */
const shiftRight = (a, n) => 
// eslint-disable-next-line no-bitwise
a >> n;
exports.shiftRight = shiftRight;
/**
 * Convert a BigInt to a Buffer
 * @param i - the bigint to convert
 * @returns the buffer
 */
const bigInt2Buffer = (i) => {
    let hex = i.toString(16);
    // Ensure even length.
    if (hex.length % 2 !== 0) {
        hex = `0${hex}`;
    }
    return Buffer.from(hex, "hex");
};
exports.bigInt2Buffer = bigInt2Buffer;
//# sourceMappingURL=bigIntUtils.js.map