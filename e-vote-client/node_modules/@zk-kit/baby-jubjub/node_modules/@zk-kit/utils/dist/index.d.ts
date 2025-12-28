import { Buffer as Buffer$1 } from 'buffer';
export { Buffer } from 'buffer';
import { NumericString, Groth16Proof } from 'snarkjs';

type BigNumber = bigint | string;
type BigNumberish = BigNumber | number | Buffer$1 | Uint8Array;
type PackedGroth16Proof = [
    NumericString,
    NumericString,
    NumericString,
    NumericString,
    NumericString,
    NumericString,
    NumericString,
    NumericString
];

/**
 * @module Conversions
 * This module provides a collection of utility functions for converting
 * between different numerical formats, particularly focusing on
 * conversions involving bigints, hexadecimals and buffers.
 * The module is structured with clear function naming to indicate
 * the conversion direction (e.g., `bigIntToHexadecimal` for BigInt
 * to hexadecimal, `bufferToBigInt` for buffer to bigint) and employs
 * type checks to ensure the correct handling of various input types.
 * It also includes variations for both big-endian (`be`) and little-endian
 * (`le`) conversions. It is important to note that when there is no prefix,
 * the order of bytes is always big-endian.
 */

/**
 * Converts a bigint to a hexadecimal string.
 * @param value The bigint value to convert.
 * @returns The hexadecimal representation of the bigint.
 */
declare function bigIntToHexadecimal(value: bigint): string;
/**
 * Converts a hexadecimal string to a bigint. The input is interpreted as hexadecimal
 * with or without a '0x' prefix. It uses big-endian byte order.
 * @param value The hexadecimal string to convert.
 * @returns The bigint representation of the hexadecimal string.
 */
declare function hexadecimalToBigInt(value: string): bigint;
/**
 * Converts a buffer of bytes to a bigint using big-endian byte order.
 * It accepts 'Buffer' or 'Uint8Array'.
 * @param value The buffer to convert.
 * @returns The bigint representation of the buffer's contents.
 */
declare function beBufferToBigInt(value: Buffer$1 | Uint8Array): bigint;
/**
 * Converts a buffer to a bigint using little-endian byte order.
 * It accepts 'Buffer' or 'Uint8Array'.
 * @param value The buffer to convert.
 * @returns The bigint representation of the buffer's contents in little-endian.
 */
declare function leBufferToBigInt(value: Buffer$1 | Uint8Array): bigint;
/**
 * Converts a buffer to a bigint. Alias for beBufferToBigInt.
 * @param value The buffer to convert.
 * @returns The bigint representation of the buffer's contents.
 */
declare function bufferToBigInt(value: Buffer$1 | Uint8Array): bigint;
/**
 * Converts a bigint to a buffer and fills with zeros if a valid
 * size (i.e. number of bytes) is specified. If the size is not defined,
 * it gets the size from the given bigint. If the specified size is smaller than
 * the size of the bigint (i.e. `minSize`), an error is thrown.
 * It uses big-endian byte order.
 * @param value The bigint to convert.
 * @param size The number of bytes of the buffer to return.
 * @returns The buffer representation of the bigint.
 */
declare function beBigIntToBuffer(value: bigint, size?: number): Buffer$1;
/**
 * Converts a bigint to a buffer and fills with zeros if a valid
 * size (i.e. number of bytes) is specified. If the size is not defined,
 * it gets the size from the given bigint. If the specified size is smaller than
 * the size of the bigint (i.e. `minSize`), an error is thrown.
 * It uses little-endian byte order.
 * @param value The bigint to convert.
 * @param size The number of bytes of the buffer to return.
 * @returns The buffer representation of the bigint in little-endian.
 */
declare function leBigIntToBuffer(value: bigint, size?: number): Buffer$1;
/**
 * Converts a bigint to a buffer. Alias for beBigIntToBuffer.
 * @param value The bigint to convert.
 * @returns The buffer representation of the bigint.
 */
declare function bigIntToBuffer(value: bigint): Buffer$1;
/**
 * Converts a BigNumberish type to a bigint. If the input is already a bigint,
 * the return value will be the bigint itself, otherwise it will be converted
 * to a bigint using big-endian byte order.
 * @param value The BigNumberish value to convert.
 * @returns The bigint representation of the BigNumberish value.
 */
declare function bigNumberishToBigInt(value: BigNumberish): bigint;
/**
 * Converts a BigNumberish type to a buffer. If the input is already a buffer,
 * the return value will be the buffer itself, otherwise it will be converted
 * to a buffer using big-endian byte order.
 * @param value The BigNumberish value to convert.
 * @returns The buffer representation of the BigNumberish value.
 */
declare function bigNumberishToBuffer(value: BigNumberish): Buffer$1;
/**
 * Converts an hexadecimal string to a buffer. The hexadecimal string
 * should not start with '0x' or '0X'. It keeps the bytes in the same order.
 * @param value The hexadecimal string to convert.
 * @returns The buffer representation of the hexadecimal string.
 */
declare function hexadecimalToBuffer(value: string): Buffer$1;
/**
 * Converts a buffer to a hexadecimal string. It accepts 'Buffer' or 'Uint8Array'.
 * The hexadecimal string will not start with '0x' or '0X'. It keeps the bytes in the same order.
 * @param value The buffer to convert.
 * @returns The converted hexadecimal string.
 */
declare function bufferToHexadecimal(value: Buffer$1 | Uint8Array): string;
/**
 * Converts bytes to a base64 string. It accepts 'Buffer' or 'Uint8Array'.
 * @param value The bytes to convert.
 * @returns The converted base64 string.
 */
declare function bufferToBase64(value: Buffer$1 | Uint8Array): string;
/**
 * Converts a base64 string to bytes (i.e. a buffer). This function does not check
 * if the input value is a valid base64 string. If there are unsupported characters
 * they will be ignored.
 * @param value The base64 string to convert.
 * @returns The converted buffer.
 */
declare function base64ToBuffer(value: string): Buffer$1;
/**
 * Converts text (utf8) to a base64 string.
 * @param value The text to convert.
 * @returns The converted base64 string.
 */
declare function textToBase64(value: string): string;
/**
 * Converts a base64 string to text (utf8). This function does not check
 * if the input value is a valid base64 string. If there are unsupported characters
 * they could be ignored and the result may be unexpected.
 * @param value The base64 string to convert.
 * @returns The converted text.
 */
declare function base64ToText(value: string): string;

declare const conversions_base64ToBuffer: typeof base64ToBuffer;
declare const conversions_base64ToText: typeof base64ToText;
declare const conversions_beBigIntToBuffer: typeof beBigIntToBuffer;
declare const conversions_beBufferToBigInt: typeof beBufferToBigInt;
declare const conversions_bigIntToBuffer: typeof bigIntToBuffer;
declare const conversions_bigIntToHexadecimal: typeof bigIntToHexadecimal;
declare const conversions_bigNumberishToBigInt: typeof bigNumberishToBigInt;
declare const conversions_bigNumberishToBuffer: typeof bigNumberishToBuffer;
declare const conversions_bufferToBase64: typeof bufferToBase64;
declare const conversions_bufferToBigInt: typeof bufferToBigInt;
declare const conversions_bufferToHexadecimal: typeof bufferToHexadecimal;
declare const conversions_hexadecimalToBigInt: typeof hexadecimalToBigInt;
declare const conversions_hexadecimalToBuffer: typeof hexadecimalToBuffer;
declare const conversions_leBigIntToBuffer: typeof leBigIntToBuffer;
declare const conversions_leBufferToBigInt: typeof leBufferToBigInt;
declare const conversions_textToBase64: typeof textToBase64;
declare namespace conversions {
  export { conversions_base64ToBuffer as base64ToBuffer, conversions_base64ToText as base64ToText, conversions_beBigIntToBuffer as beBigIntToBuffer, conversions_beBufferToBigInt as beBufferToBigInt, conversions_bigIntToBuffer as bigIntToBuffer, conversions_bigIntToHexadecimal as bigIntToHexadecimal, conversions_bigNumberishToBigInt as bigNumberishToBigInt, conversions_bigNumberishToBuffer as bigNumberishToBuffer, conversions_bufferToBase64 as bufferToBase64, conversions_bufferToBigInt as bufferToBigInt, conversions_bufferToHexadecimal as bufferToHexadecimal, conversions_hexadecimalToBigInt as hexadecimalToBigInt, conversions_hexadecimalToBuffer as hexadecimalToBuffer, conversions_leBigIntToBuffer as leBigIntToBuffer, conversions_leBufferToBigInt as leBufferToBigInt, conversions_textToBase64 as textToBase64 };
}

/**
 * Generates a random sequence of bytes securely using Node.js's crypto module.
 * @param size The number of bytes to generate.
 * @returns A Uint8Array containing the generated random bytes.
 */
declare function getRandomValues(size: number): Uint8Array;

declare const crypto_node_getRandomValues: typeof getRandomValues;
declare namespace crypto_node {
  export { crypto_node_getRandomValues as getRandomValues };
}

/**
 * @module TypeChecks
 * This module provides utility functions to check data types.
 * It defines a set of supported types and includes functions to check if
 * a value is defined and if it matches a supported type. These functions
 * are useful for type checking and validation in the other libraries,
 * enhancing code robustness and reliability.
 */
/** @internal */
declare const supportedTypes: readonly ["number", "string", "function", "Array", "Uint8Array", "Buffer", "object", "bigint", "stringified-bigint", "hexadecimal", "bignumber", "bignumberish"];
type SupportedType = (typeof supportedTypes)[number];
/**
 * Returns true if the value is defined, false otherwise.
 * @param value The value to be checked.
 */
declare function isDefined(value: any): boolean;
/**
 * Returns true if the value is a number, false otherwise.
 * @param value The value to be checked.
 */
declare function isNumber(value: any): boolean;
/**
 * Returns true if the value is a string, false otherwise.
 * @param value The value to be checked.
 */
declare function isString(value: any): boolean;
/**
 * Returns true if the value is a function, false otherwise.
 * @param value The value to be checked.
 */
declare function isFunction(value: any): boolean;
/**
 * Returns true if the value is an object, false otherwise.
 * Please, note that arrays are also objects in JavaScript.
 * @param value The value to be checked.
 */
declare function isObject(value: any): boolean;
/**
 * Returns true if the value is an Array instance, false otherwise.
 * @param value The value to be checked.
 */
declare function isArray(value: any): boolean;
/**
 * Returns true if the value is a Uint8Array instance, false otherwise.
 * @param value The value to be checked.
 */
declare function isUint8Array(value: any): boolean;
/**
 * Returns true if the value is a Buffer instance, false otherwise.
 * @param value The value to be checked.
 */
declare function isBuffer(value: any): boolean;
/**
 * Returns true if the value is a bigint, false otherwise.
 * @param value The value to be checked.
 */
declare function isBigInt(value: any): boolean;
/**
 * Checks if the given value is a string that represents a valid bigint.
 * @param value The value to be checked if it's a stringified bigint.
 */
declare function isStringifiedBigInt(value: any): boolean;
/**
 * Checks if a string is a valid hexadecimal string representation.
 * If 'prefix' is 'true', the string must start with '0x' or '0X' followed by one or more
 * hexadecimal digits (0-9, a-f, A-F), otherwise no prefix is expected. 'prefix' is optional and
 * if its value it is not explicitly defined it will be set to 'true' by default.
 * @param value The string to be tested.
 * @param prefix A boolean to include or not a '0x' or '0X' prefix.
 */
declare function isHexadecimal(value: any, prefix?: boolean): boolean;
/**
 * Checks if the given value can be considered as BigNumber.
 * A value is considered a BigNumber if it is a bigint or a string
 * that can be converted to a bigint (via `Bigint(s)`).
 * @param value The value to check.
 */
declare function isBigNumber(value: any): boolean;
/**
 * Checks if the given value can be considered as BigNumberish.
 * A value is considered BigNumberish if it meets
 * any of the following conditions: it's a number, a bigint, a string
 * that can be converted to a bigint, a hexadecimal
 * string, or a Buffer object.
 * @param value The value to check.
 */
declare function isBigNumberish(value: any): boolean;
/**
 * Returns true if the value type is the same as the type passed
 * as the second parameter, false otherwise.
 * @param value
 * @param type The expected type.
 */
declare function isType(value: any, type: SupportedType): boolean;
/**
 * Returns true if the type is being supported by this utility
 * functions, false otherwise.
 * @param type The type to be checked.
 */
declare function isSupportedType(type: string): type is SupportedType;

type typeChecks_SupportedType = SupportedType;
declare const typeChecks_isArray: typeof isArray;
declare const typeChecks_isBigInt: typeof isBigInt;
declare const typeChecks_isBigNumber: typeof isBigNumber;
declare const typeChecks_isBigNumberish: typeof isBigNumberish;
declare const typeChecks_isBuffer: typeof isBuffer;
declare const typeChecks_isDefined: typeof isDefined;
declare const typeChecks_isFunction: typeof isFunction;
declare const typeChecks_isHexadecimal: typeof isHexadecimal;
declare const typeChecks_isNumber: typeof isNumber;
declare const typeChecks_isObject: typeof isObject;
declare const typeChecks_isString: typeof isString;
declare const typeChecks_isStringifiedBigInt: typeof isStringifiedBigInt;
declare const typeChecks_isSupportedType: typeof isSupportedType;
declare const typeChecks_isType: typeof isType;
declare const typeChecks_isUint8Array: typeof isUint8Array;
declare const typeChecks_supportedTypes: typeof supportedTypes;
declare namespace typeChecks {
  export { type typeChecks_SupportedType as SupportedType, typeChecks_isArray as isArray, typeChecks_isBigInt as isBigInt, typeChecks_isBigNumber as isBigNumber, typeChecks_isBigNumberish as isBigNumberish, typeChecks_isBuffer as isBuffer, typeChecks_isDefined as isDefined, typeChecks_isFunction as isFunction, typeChecks_isHexadecimal as isHexadecimal, typeChecks_isNumber as isNumber, typeChecks_isObject as isObject, typeChecks_isString as isString, typeChecks_isStringifiedBigInt as isStringifiedBigInt, typeChecks_isSupportedType as isSupportedType, typeChecks_isType as isType, typeChecks_isUint8Array as isUint8Array, typeChecks_supportedTypes as supportedTypes };
}

/**
 * @module ErrorHandlers
 * This module is designed to provide utility functions for validating
 * function parameters. It includes functions that throw type errors if
 * the parameters do not meet specified criteria, such as being defined,
 * a number, a string, a function, or an array. This module helps ensure
 * that functions receive the correct types of inputs, enhancing code
 * reliability and reducing runtime errors.
 */

/**
 * @throws Throws a type error if the parameter value has not been defined.
 * @param parameterValue The parameter value.
 * @param parameterName The parameter name.
 */
declare function requireDefined(parameterValue: any, parameterName: string): void;
/**
 * @throws Throws a type error if the parameter value is not a number.
 * @param parameterValue The parameter value.
 * @param parameterName The parameter name.
 */
declare function requireNumber(parameterValue: number, parameterName: string): void;
/**
 * @throws Throws a type error if the parameter value is not a string.
 * @param parameterValue The parameter value.
 * @param parameterName The parameter name.
 */
declare function requireString(parameterValue: string, parameterName: string): void;
/**
 * @throws Throws a type error if the parameter value is not a function.
 * @param parameterValue The parameter value.
 * @param parameterName The parameter name.
 */
declare function requireFunction(parameterValue: Function, parameterName: string): void;
/**
 * @throws Throws a type error if the parameter value is not an Array.
 * @param parameterValue The parameter value.
 * @param parameterName The parameter name.
 */
declare function requireArray(parameterValue: any[], parameterName: string): void;
/**
 * @throws Throws a type error if the parameter value is not a Uint8Array.
 * @param parameterValue The parameter value.
 * @param parameterName The parameter name.
 */
declare function requireUint8Array(parameterValue: Uint8Array, parameterName: string): void;
/**
 * @throws Throws a type error if the parameter value is not a Buffer.
 * @param parameterValue The parameter value.
 * @param parameterName The parameter name.
 */
declare function requireBuffer(parameterValue: Buffer, parameterName: string): void;
/**
 * @throws Throws a type error if the parameter value is not an object.
 * Please, note that arrays are also objects in JavaScript.
 * @param parameterValue The parameter value.
 * @param parameterName The parameter name.
 */
declare function requireObject(parameterValue: object, parameterName: string): void;
/**
 * @throws Throws a type error if the parameter value is not a bigint.
 * @param parameterValue The parameter value.
 * @param parameterName The parameter name.
 */
declare function requireBigInt(parameterValue: bigint, parameterName: string): void;
/**
 * @throws Throws a type error if the parameter value is not a stringified bigint.
 * @param parameterValue The parameter value.
 * @param parameterName The parameter name.
 */
declare function requireStringifiedBigInt(parameterValue: string, parameterName: string): void;
/**
 * @throws Throws a type error if the parameter value is not a hexadecimal string.
 * If 'prefix' is 'true', the string must start with '0x' or '0X' followed by one or more
 * hexadecimal digits (0-9, a-f, A-F), otherwise no prefix is expected. 'prefix' is optional and
 * if its value it is not explicitly defined it will be set to 'true' by default.
 * @param parameterValue The parameter value.
 * @param parameterName The parameter name.
 * @param prefix A boolean to include or not a '0x' or '0X' prefix.
 */
declare function requireHexadecimal(parameterValue: string, parameterName: string, prefix?: boolean): void;
/**
 * @throws Throws a type error if the parameter value is not a bignumber.
 * @param parameterValue The parameter value.
 * @param parameterName The parameter name.
 */
declare function requireBigNumber(parameterValue: any, parameterName: string): void;
/**
 * @throws Throws a type error if the parameter value is not a bignumber-ish.
 * @param parameterValue The parameter value.
 * @param parameterName The parameter name.
 */
declare function requireBigNumberish(parameterValue: any, parameterName: string): void;
/**
 * @throws Throws a type error if the parameter value type is not part of the list of types.
 * @param parameterValue The parameter value.
 * @param parameterName The parameter name.
 */
declare function requireTypes(parameterValue: any, parameterName: string, types: SupportedType[]): void;

declare const errorHandlers_requireArray: typeof requireArray;
declare const errorHandlers_requireBigInt: typeof requireBigInt;
declare const errorHandlers_requireBigNumber: typeof requireBigNumber;
declare const errorHandlers_requireBigNumberish: typeof requireBigNumberish;
declare const errorHandlers_requireBuffer: typeof requireBuffer;
declare const errorHandlers_requireDefined: typeof requireDefined;
declare const errorHandlers_requireFunction: typeof requireFunction;
declare const errorHandlers_requireHexadecimal: typeof requireHexadecimal;
declare const errorHandlers_requireNumber: typeof requireNumber;
declare const errorHandlers_requireObject: typeof requireObject;
declare const errorHandlers_requireString: typeof requireString;
declare const errorHandlers_requireStringifiedBigInt: typeof requireStringifiedBigInt;
declare const errorHandlers_requireTypes: typeof requireTypes;
declare const errorHandlers_requireUint8Array: typeof requireUint8Array;
declare namespace errorHandlers {
  export { errorHandlers_requireArray as requireArray, errorHandlers_requireBigInt as requireBigInt, errorHandlers_requireBigNumber as requireBigNumber, errorHandlers_requireBigNumberish as requireBigNumberish, errorHandlers_requireBuffer as requireBuffer, errorHandlers_requireDefined as requireDefined, errorHandlers_requireFunction as requireFunction, errorHandlers_requireHexadecimal as requireHexadecimal, errorHandlers_requireNumber as requireNumber, errorHandlers_requireObject as requireObject, errorHandlers_requireString as requireString, errorHandlers_requireStringifiedBigInt as requireStringifiedBigInt, errorHandlers_requireTypes as requireTypes, errorHandlers_requireUint8Array as requireUint8Array };
}

/**
 * @class F1Field
 * Represents a finite field of order 'order' providing arithmetic operations under modulus.
 * This class includes operations such as addition, subtraction, multiplication, division,
 * and inversion, all performed modulo the field's order. It's designed to work with bigints,
 * supporting large numbers for cryptographic purposes and other applications requiring
 * modular arithmetic.
 * Note that the outputs of the functions will always be within the field if and only if
 * the input values are within the field. Devs need to make sure of that.
 *
 * @property one Represents the scalar value 1 in the field.
 * @property zero Represents the scalar value 0 in the field.
 * @property _order The order of the finite field (i.e., the modulus).
 * @property _half Half the order of the field, used for certain comparisons.
 * @property _negone The scalar value -1 in the field, represented positively.
 */
declare class F1Field {
    one: bigint;
    zero: bigint;
    _order: bigint;
    _half: bigint;
    _negone: bigint;
    constructor(order: bigint);
    /**
     * Ensures a given result falls within the field by applying modular reduction.
     * This method also handles negative inputs, correctly mapping them into the field.
     * @param res The result to be normalized to the field.
     * @returns The equivalent value within the field.
     */
    e(res: bigint): bigint;
    /**
     * Performs modular multiplication of two bigint values within the field.
     * @param a The first value.
     * @param b The second value.
     * @returns The product of 'a' and 'b' modulo the field's order.
     */
    mul(a: bigint, b: bigint): bigint;
    /**
     * Subtracts one bigint from another under modulus.
     * It ensures the result is within the field if and only if the input values are within the field.
     * @param a The value from which to subtract.
     * @param b The value to be subtracted.
     * @returns The difference of 'a' and 'b' modulo the field's order.
     */
    sub(a: bigint, b: bigint): bigint;
    /**
     * Adds two bigint values together under modulus.
     * It ensures the result is within the field if and only if the input values are within the field.
     * @param a The first value.
     * @param b The second value.
     * @returns The sum of 'a' and 'b' modulo the field's order.
     */
    add(a: bigint, b: bigint): bigint;
    /**
     * Computes the multiplicative inverse of a given value within the field.
     * This method uses the Extended Euclidean Algorithm to find the inverse,
     * ensuring the result is always a positive value less than the field's order.
     * If the input value is zero, which has no inverse, an error is thrown.
     * @param a The value for which to compute the inverse.
     * @returns The multiplicative inverse of 'a' modulo the field's order.
     * @throws if 'a' is zero.
     */
    inv(a: bigint): bigint;
    /**
     * Divides one bigint by another within the field by multiplying the first value
     * by the multiplicative inverse of the second.
     * @param a The dividend.
     * @param b The divisor.
     * @returns The result of the division of 'a' by 'b' modulo the field's order.
     */
    div(a: bigint, b: bigint): bigint;
    /**
     * Checks if two bigint values are equal within the context of the field.
     * It ensures the result is within the field if and only if the input values are within the field.
     * @param a The first value to compare.
     * @param b The second value to compare.
     * @returns True if 'a' equals 'b', false otherwise.
     */
    eq(a: bigint, b: bigint): boolean;
    /**
     * Squares a bigint value within the field.
     * This is a specific case of multiplication where the value is multiplied by itself,
     * optimized for performance where applicable.
     * It ensures the result is within the field if and only if the input values are within the field.
     * @param a The value to square.
     * @returns The square of 'a' modulo the field's order.
     */
    square(a: bigint): bigint;
    /**
     * Compares two bigint values to determine if the first is less than the second,
     * taking into account the field's order for modular comparison.
     * It ensures the result is within the field if and only if the input values are within the field.
     * @param a The first value to compare.
     * @param b The second value to compare.
     * @returns True if 'a' is less than 'b', false otherwise.
     */
    lt(a: bigint, b: bigint): boolean;
    /**
     * Compares two bigint values to determine if the first is greater than or equal to the second,
     * considering the field's modular context.
     * It ensures the result is within the field if and only if the input values are within the field.
     * @param a The first value to compare.
     * @param b The second value to compare.
     * @returns True if 'a' is greater than or equal to 'b', false otherwise.
     */
    geq(a: bigint, b: bigint): boolean;
    /**
     * Computes the negation of a bigint value within the field.
     * The result is the modular additive inverse that, when added to the original value,
     * yields zero in the field's modulus.
     * It ensures the result is within the field if and only if the input values are within the field.
     * @param a The value to negate.
     * @returns The negation of 'a' modulo the field's order.
     */
    neg(a: bigint): bigint;
    /**
     * Checks if a bigint value is zero within the context of the field.
     * @param a The value to check.
     * @returns True if 'a' is zero, false otherwise.
     */
    isZero(a: bigint): boolean;
    /**
     * Raises a base to an exponent within the field, efficiently computing
     * scalar exponentiation using the square-and-multiply algorithm.
     * Supports both positive and negative exponents through the use of the `inv` method for negatives.
     * @param base The base to be exponentiated.
     * @param e The exponent.
     * @returns The result of raising 'base' to the power 'e' modulo the field's order.
     */
    pow(base: bigint, e: bigint): bigint;
}

/**
 * @module ProofPacking
 *
 * This module provides utility functions to pack and unpack
 * various types of objects, making it easier to export or use
 * them externally.
 */

/**
 * Packs a Snarkjs Groth16 proof into a single list usable as calldata in Solidity (public signals are not included).
 * @param proof The Groth16 proof generated with SnarkJS.
 * @returns Solidity calldata.
 */
declare function packGroth16Proof(proof: Groth16Proof): PackedGroth16Proof;
/**
 * Unpacks a PackedGroth16Proof Solidity calldata into its original form which is a SnarkJS Groth16 proof.
 * @param proof Solidity calldata.
 * @returns The Groth16 proof compatible with SnarkJS.
 */
declare function unpackGroth16Proof(proof: PackedGroth16Proof): Groth16Proof;

declare const proofPacking_packGroth16Proof: typeof packGroth16Proof;
declare const proofPacking_unpackGroth16Proof: typeof unpackGroth16Proof;
declare namespace proofPacking {
  export { proofPacking_packGroth16Proof as packGroth16Proof, proofPacking_unpackGroth16Proof as unpackGroth16Proof };
}

/**
 * @module Scalar
 * This module provides utility functions for performing scalar operations
 * within a field, especially designed to handle operations on bigints.
 * The operations include scalar inversion (`inv`), scalar exponentiation (`pow`),
 * and modular reduction. Functions are carefully implemented to ensure
 * mathematical correctness and efficiency, supporting both positive and
 * negative bigint values. The module aims to provide robust tools for
 * cryptographic calculations and other applications requiring high-precision
 * arithmetic in fields.
 */
/**
 * Checks if a bigint scalar value is zero.
 * @param a The bigint scalar value to check.
 * @returns True if 'a' is zero, false otherwise.
 */
declare function isZero(a: bigint): boolean;
/**
 * Determines whether a bigint scalar value is odd.
 * @param a The bigint scalar value to check.
 * @returns True if 'a' is odd, false if it is even.
 */
declare function isOdd(a: bigint): boolean;
/**
 * Performs a bitwise right shift on a bigint scalar value.
 * This operation is equivalent to dividing by 2^n, but it operates directly
 * on the binary representation, making it efficient for certain types of calculations.
 * @param a The bigint scalar value to shift.
 * @param n The number of bits to shift 'a' by.
 * @returns The result of shifting 'a' right by 'n' bits.
 */
declare function shiftRight(a: bigint, n: bigint): bigint;
/**
 * Multiplies two bigint scalar values.
 * @param a The first bigint scalar value.
 * @param b The second bigint scalar value.
 * @returns The product of 'a' and 'b'.
 */
declare function mul(a: bigint, b: bigint): bigint;
/**
 * Compares two bigint scalar values to determine if the first is greater than the second.
 * @param a The first bigint scalar value to compare.
 * @param b The second bigint scalar value to compare.
 * @returns True if 'a' is greater than 'b', false otherwise.
 */
declare function gt(a: bigint, b: bigint): boolean;
/**
 * Converts a bigint scalar value into an array of bits, represented as numbers.
 * This function is particularly useful for examining the binary structure of bigints,
 * which can be necessary for bit manipulation and understanding the representation
 * of numbers at a lower level.
 * @param n The bigint scalar value to convert into bits.
 * @returns An array of numbers representing the bits of 'n', starting from the least significant bit.
 */
declare function bits(n: bigint): number[];

declare const scalar_bits: typeof bits;
declare const scalar_gt: typeof gt;
declare const scalar_isOdd: typeof isOdd;
declare const scalar_isZero: typeof isZero;
declare const scalar_mul: typeof mul;
declare const scalar_shiftRight: typeof shiftRight;
declare namespace scalar {
  export { scalar_bits as bits, scalar_gt as gt, scalar_isOdd as isOdd, scalar_isZero as isZero, scalar_mul as mul, scalar_shiftRight as shiftRight };
}

export { type BigNumber, type BigNumberish, F1Field, type PackedGroth16Proof, type SupportedType, base64ToBuffer, base64ToText, beBigIntToBuffer, beBufferToBigInt, bigIntToBuffer, bigIntToHexadecimal, bigNumberishToBigInt, bigNumberishToBuffer, bufferToBase64, bufferToBigInt, bufferToHexadecimal, conversions, crypto_node as crypto, errorHandlers, hexadecimalToBigInt, hexadecimalToBuffer, isArray, isBigInt, isBigNumber, isBigNumberish, isBuffer, isDefined, isFunction, isHexadecimal, isNumber, isObject, isString, isStringifiedBigInt, isSupportedType, isType, isUint8Array, leBigIntToBuffer, leBufferToBigInt, packGroth16Proof, proofPacking as packing, requireArray, requireBigInt, requireBigNumber, requireBigNumberish, requireBuffer, requireDefined, requireFunction, requireHexadecimal, requireNumber, requireObject, requireString, requireStringifiedBigInt, requireTypes, requireUint8Array, scalar, supportedTypes, textToBase64, typeChecks, unpackGroth16Proof };
