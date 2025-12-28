"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.hashOne = exports.hash12 = exports.hash5 = exports.hash4 = exports.hash3 = exports.hash2 = exports.hashN = exports.hashLeftRight = exports.poseidonT6 = exports.poseidonT5 = exports.poseidonT4 = exports.poseidonT3 = exports.poseidon = exports.sha256Hash = void 0;
const poseidon_cipher_1 = require("@zk-kit/poseidon-cipher");
const ethers_1 = require("ethers");
const assert_1 = __importDefault(require("assert"));
const constants_1 = require("./constants");
/**
 * Hash an array of uint256 values the same way that the EVM does.
 * @param input - the array of values to hash
 * @returns a EVM compatible sha256 hash
 */
const sha256Hash = (input) => {
    const types = [];
    input.forEach(() => {
        types.push("uint256");
    });
    return (BigInt((0, ethers_1.solidityPackedSha256)(types, input.map((x) => x.toString()))) % constants_1.SNARK_FIELD_SIZE);
};
exports.sha256Hash = sha256Hash;
/**
 * Generate the poseidon hash of the inputs provided
 * @param inputs The inputs to hash
 * @returns the hash of the inputs
 */
const poseidon = (inputs) => (0, poseidon_cipher_1.poseidonPerm)([BigInt(0), ...inputs.map((x) => BigInt(x))])[0];
exports.poseidon = poseidon;
/**
 * Hash up to 2 elements
 * @param inputs The elements to hash
 * @returns the hash of the elements
 */
const poseidonT3 = (inputs) => {
    (0, assert_1.default)(inputs.length === 2);
    return (0, exports.poseidon)(inputs);
};
exports.poseidonT3 = poseidonT3;
/**
 * Hash up to 3 elements
 * @param inputs The elements to hash
 * @returns the hash of the elements
 */
const poseidonT4 = (inputs) => {
    (0, assert_1.default)(inputs.length === 3);
    return (0, exports.poseidon)(inputs);
};
exports.poseidonT4 = poseidonT4;
/**
 * Hash up to 4 elements
 * @param inputs The elements to hash
 * @returns the hash of the elements
 */
const poseidonT5 = (inputs) => {
    (0, assert_1.default)(inputs.length === 4);
    return (0, exports.poseidon)(inputs);
};
exports.poseidonT5 = poseidonT5;
/**
 * Hash up to 5 elements
 * @param inputs The elements to hash
 * @returns the hash of the elements
 */
const poseidonT6 = (inputs) => {
    (0, assert_1.default)(inputs.length === 5);
    return (0, exports.poseidon)(inputs);
};
exports.poseidonT6 = poseidonT6;
/**
 * Hash two BigInts with the Poseidon hash function
 * @param left The left-hand element to hash
 * @param right The right-hand element to hash
 * @returns The hash of the two elements
 */
const hashLeftRight = (left, right) => (0, exports.poseidonT3)([left, right]);
exports.hashLeftRight = hashLeftRight;
// hash functions
const funcs = {
    2: exports.poseidonT3,
    3: exports.poseidonT4,
    4: exports.poseidonT5,
    5: exports.poseidonT6,
};
/**
 * Hash up to N elements
 * @param numElements The number of elements to hash
 * @param elements The elements to hash
 * @returns The hash of the elements
 */
const hashN = (numElements, elements) => {
    const elementLength = elements.length;
    if (elements.length > numElements) {
        throw new TypeError(`the length of the elements array should be at most ${numElements}; got ${elements.length}`);
    }
    const elementsPadded = elements.slice();
    if (elementLength < numElements) {
        for (let i = elementLength; i < numElements; i += 1) {
            elementsPadded.push(BigInt(0));
        }
    }
    return funcs[numElements](elementsPadded);
};
exports.hashN = hashN;
// hash functions
const hash2 = (elements) => (0, exports.hashN)(2, elements);
exports.hash2 = hash2;
const hash3 = (elements) => (0, exports.hashN)(3, elements);
exports.hash3 = hash3;
const hash4 = (elements) => (0, exports.hashN)(4, elements);
exports.hash4 = hash4;
const hash5 = (elements) => (0, exports.hashN)(5, elements);
exports.hash5 = hash5;
/**
 * A convenience function to use Poseidon to hash a Plaintext with
 * no more than 13 elements
 * @param elements The elements to hash
 * @returns The hash of the elements
 */
const hash12 = (elements) => {
    const max = 12;
    const elementLength = elements.length;
    if (elementLength > max) {
        throw new TypeError(`the length of the elements array should be at most ${max}; got ${elements.length}`);
    }
    const elementsPadded = elements.slice();
    if (elementLength < max) {
        for (let i = elementLength; i < max; i += 1) {
            elementsPadded.push(BigInt(0));
        }
    }
    return (0, exports.poseidonT5)([
        (0, exports.poseidonT6)(elementsPadded.slice(0, 5)),
        (0, exports.poseidonT6)(elementsPadded.slice(5, 10)),
        elementsPadded[10],
        elementsPadded[11],
    ]);
};
exports.hash12 = hash12;
/**
 * Hash a single BigInt with the Poseidon hash function
 * @param preImage The element to hash
 * @returns The hash of the element
 */
const hashOne = (preImage) => (0, exports.poseidonT3)([preImage, BigInt(0)]);
exports.hashOne = hashOne;
//# sourceMappingURL=hashing.js.map