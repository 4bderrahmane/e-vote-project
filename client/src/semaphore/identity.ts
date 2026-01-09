import {Identity} from "@semaphore-protocol/identity";
import CryptoJS from "crypto-js";
import WordArray from "crypto-js/lib-typedarrays";

function wordArrayToUint8Array(wordArray: WordArray): Uint8Array {
    const words = wordArray.words;
    const sigBytes = wordArray.sigBytes;
    const u8 = new Uint8Array(sigBytes);

    for (let i = 0; i < sigBytes; i++) {
        u8[i] = (words[i >>> 2] >>> (24 - (i % 4) * 8)) & 0xff;
    }
    return u8;
}

function deriveKey(password: string, salt: string): Uint8Array {
    const wordArray = CryptoJS.PBKDF2(password, salt, {
        keySize: 32 / 4,
        iterations: 300000,
        hasher: CryptoJS.algo.SHA256,
    });

    return wordArrayToUint8Array(wordArray);
}

export function generateIdentity(password: string, userId: string): Identity {
    const secretBytes = deriveKey(password, "semaphore-identity:" + userId);

    const secretHex = Array.from(secretBytes)
        .map((b) => b.toString(16).padStart(2, "0"))
        .join("");

    // Semaphore Identity constructor accepts a string seed.
    return new Identity(secretHex);
}

// Note: no top-level code here on purpose. Importing this module must be side-effect free.
