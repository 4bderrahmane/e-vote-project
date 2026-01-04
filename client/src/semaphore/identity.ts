import {Identity} from "@semaphore-protocol/identity";
import CryptoJS from "crypto-js";
import WordArray from "crypto-js/lib-typedarrays";
import {poseidon2} from "poseidon-lite/poseidon2"

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


    const identity = new Identity(secretHex);

    console.log("Generated Secure Identity");
    console.log("Commitment:", identity.commitment.toString());

    return identity;
}

const identity: Identity = generateIdentity("password123", "1gdg,gafafgafgfd,fg");
const pk = identity.publicKey;
const computed = poseidon2([pk[0], pk[1]])

console.log(computed.toString())
console.log(computed === identity.commitment)
