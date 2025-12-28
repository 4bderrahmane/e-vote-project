import { BigNumber } from '@zk-kit/utils';

type CipherText<N = BigNumber> = N[];
type PlainText<N = BigNumber> = N[];
type EncryptionKey<N = BigNumber> = [N, N];
type Nonce<N = BigNumber> = N;
type StringifiedInput = string | string[] | string[][] | string[][][] | {
    [key: string]: StringifiedInput;
} | null;
type BigIntOutput = BigIntOutput[] | StringifiedInput | bigint | bigint[] | bigint[][] | bigint[][][] | {
    [key: string]: bigint;
} | null;

/**
 * Given an input containing string values, convert them
 * to bigint
 * @param input the input to convert
 * @returns the input with string values converted to bigint
 */
declare const unstringifyBigInts: (input: StringifiedInput) => BigIntOutput;
declare const C: bigint[][];
declare const M: bigint[][][];
/**
 * Given a bigint a, returns a^5.
 * @param a the value to exponentiate
 * @returns the result of a^5
 */
declare const pow5: (a: bigint) => bigint;
/**
 * Given a bigint a, returns a normalized value of a.
 * @dev r is 'r' is the alt_bn128 prime order, so we can use it to normalize values
 * @param a the value to normalize
 * @returns the normalized value of a
 */
declare const normalize: (a: bigint) => bigint;
/**
 * Apply the Poseidon permutation to the given inputs
 * @param inputs - the inputs to the permutation
 * @returns an array of bigint representing the output of the permutation
 */
declare const poseidonPerm: (inputs: bigint[]) => bigint[];
/**
 * Check if two field values are equal
 * @param a the first value
 * @param b the second value
 * @param error the error to throw if the values are not equal
 */
declare const checkEqual: (a: bigint, b: bigint, error: string) => void;
/**
 * Validate that the nonce is less than 2 ^ 128 (sqrt of the field size)
 * @param nonce the nonce to validate
 */
declare const validateNonce: (nonce: Nonce<bigint>) => void;

/**
 * Encrypt some plaintext using poseidon encryption
 * @param msg - the message to encrypt
 * @param key - the key to encrypt with
 * @param nonce - the nonce to avoid replay attacks
 * @returns the ciphertext
 */
declare const poseidonEncrypt: (msg: PlainText<bigint>, key: EncryptionKey<bigint>, nonce: Nonce<bigint>) => CipherText<bigint>;
/**
 * Decrypt some ciphertext using poseidon encryption
 * @param ciphertext the ciphertext to decrypt
 * @param key the key to decrypt with
 * @param nonce the nonce used to encrypt
 * @param length the length of the plaintext
 * @returns the plaintext
 */
declare const poseidonDecrypt: (ciphertext: CipherText<bigint>, key: EncryptionKey<bigint>, nonce: Nonce<bigint>, length: number) => PlainText<bigint>;
/**
 * Decrypt some ciphertext using poseidon encryption
 * @dev Do not throw if the plaintext is invalid
 * @param ciphertext the ciphertext to decrypt
 * @param key the key to decrypt with
 * @param nonce the nonce used to encrypt
 * @param length the length of the plaintext
 * @returns the plaintext
 */
declare const poseidonDecryptWithoutCheck: (ciphertext: CipherText<bigint>, key: EncryptionKey<bigint>, nonce: Nonce<bigint>, length: number) => PlainText<bigint>;

export { type BigIntOutput, C, type CipherText, type EncryptionKey, M, type Nonce, type PlainText, type StringifiedInput, checkEqual, normalize, poseidonDecrypt, poseidonDecryptWithoutCheck, poseidonEncrypt, poseidonPerm, pow5, unstringifyBigInts, validateNonce };
