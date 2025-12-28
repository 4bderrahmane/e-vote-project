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

export { type SupportedType, isArray, isBigInt, isBigNumber, isBigNumberish, isBuffer, isDefined, isFunction, isHexadecimal, isNumber, isObject, isString, isStringifiedBigInt, isSupportedType, isType, isUint8Array, supportedTypes };
