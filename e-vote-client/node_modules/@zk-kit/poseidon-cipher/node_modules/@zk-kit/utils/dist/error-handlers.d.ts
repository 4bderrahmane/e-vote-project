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

export { requireArray, requireBigInt, requireBigNumber, requireBigNumberish, requireBuffer, requireDefined, requireFunction, requireHexadecimal, requireNumber, requireObject, requireString, requireStringifiedBigInt, requireTypes, requireUint8Array };
