import { Buffer } from 'buffer';

type BigNumber = bigint | string;
type BigNumberish = BigNumber | number | Buffer | Uint8Array;

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
declare function beBufferToBigInt(value: Buffer | Uint8Array): bigint;
/**
 * Converts a buffer to a bigint using little-endian byte order.
 * It accepts 'Buffer' or 'Uint8Array'.
 * @param value The buffer to convert.
 * @returns The bigint representation of the buffer's contents in little-endian.
 */
declare function leBufferToBigInt(value: Buffer | Uint8Array): bigint;
/**
 * Converts a buffer to a bigint. Alias for beBufferToBigInt.
 * @param value The buffer to convert.
 * @returns The bigint representation of the buffer's contents.
 */
declare function bufferToBigInt(value: Buffer | Uint8Array): bigint;
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
declare function beBigIntToBuffer(value: bigint, size?: number): Buffer;
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
declare function leBigIntToBuffer(value: bigint, size?: number): Buffer;
/**
 * Converts a bigint to a buffer. Alias for beBigIntToBuffer.
 * @param value The bigint to convert.
 * @returns The buffer representation of the bigint.
 */
declare function bigIntToBuffer(value: bigint): Buffer;
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
declare function bigNumberishToBuffer(value: BigNumberish): Buffer;
/**
 * Converts an hexadecimal string to a buffer. The hexadecimal string
 * should not start with '0x' or '0X'. It keeps the bytes in the same order.
 * @param value The hexadecimal string to convert.
 * @returns The buffer representation of the hexadecimal string.
 */
declare function hexadecimalToBuffer(value: string): Buffer;
/**
 * Converts a buffer to a hexadecimal string. It accepts 'Buffer' or 'Uint8Array'.
 * The hexadecimal string will not start with '0x' or '0X'. It keeps the bytes in the same order.
 * @param value The buffer to convert.
 * @returns The converted hexadecimal string.
 */
declare function bufferToHexadecimal(value: Buffer | Uint8Array): string;
/**
 * Converts bytes to a base64 string. It accepts 'Buffer' or 'Uint8Array'.
 * @param value The bytes to convert.
 * @returns The converted base64 string.
 */
declare function bufferToBase64(value: Buffer | Uint8Array): string;
/**
 * Converts a base64 string to bytes (i.e. a buffer). This function does not check
 * if the input value is a valid base64 string. If there are unsupported characters
 * they will be ignored.
 * @param value The base64 string to convert.
 * @returns The converted buffer.
 */
declare function base64ToBuffer(value: string): Buffer;
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

export { base64ToBuffer, base64ToText, beBigIntToBuffer, beBufferToBigInt, bigIntToBuffer, bigIntToHexadecimal, bigNumberishToBigInt, bigNumberishToBuffer, bufferToBase64, bufferToBigInt, bufferToHexadecimal, hexadecimalToBigInt, hexadecimalToBuffer, leBigIntToBuffer, leBufferToBigInt, textToBase64 };
