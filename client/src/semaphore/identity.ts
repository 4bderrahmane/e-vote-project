import { runArgon2id } from "@/crypto/argon2Runner";
import {Identity} from "@semaphore-protocol/identity";

const textEncoder = new TextEncoder();
const CURRENT_VAULT_VERSION = 3 as const;
const CURRENT_KDF = "ARGON2ID" as const;
const CURRENT_CIPHER = "AES-GCM-256" as const;
const CURRENT_ARGON2_ITERATIONS = 3;
const CURRENT_ARGON2_MEMORY_KIB = 64 * 1024;
const CURRENT_ARGON2_PARALLELISM = 1;

const MIN_ALLOWED_ARGON2_ITERATIONS = 1;
const MAX_ALLOWED_ARGON2_ITERATIONS = 10;
const MIN_ALLOWED_ARGON2_MEMORY_KIB = 8 * 1024;
const MAX_ALLOWED_ARGON2_MEMORY_KIB = 1024 * 1024;
const MIN_ALLOWED_ARGON2_PARALLELISM = 1;
const MAX_ALLOWED_ARGON2_PARALLELISM = 8;

const MASTER_SECRET_BYTES = 32;
const KDF_SALT_BYTES = 16;
const AES_GCM_IV_BYTES = 12;
const AES_GCM_TAG_BYTES = 16;
export const IDENTITY_VAULT_MIN_PASSWORD_LENGTH = 16;
const VAULT_AAD_V3_LABEL = "privote-identity-vault-v3";
const BASE64_CANONICAL_PATTERN = /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/;

type IdentityVaultKdf = {
    name: "ARGON2ID";
    iterations: number;
    memoryKiB: number;
    parallelism: number;
    saltB64: string;
};

type IdentityVaultBase = {
    cipher: "AES-GCM-256";
    ivB64: string;
    ciphertextB64: string;
};

export type IdentityVault = IdentityVaultBase & {
    version: typeof CURRENT_VAULT_VERSION;
    kdf: IdentityVaultKdf;
};

export type IdentityVaultOptions = {
    iterations?: number;
    memoryKiB?: number;
    parallelism?: number;
};

export type ElectionKey =
    | { kind: "uuid"; value: string }
    | { kind: "address"; value: string }
    | { kind: "externalNullifier"; value: bigint | number | string }
    | { kind: "raw"; value: string };

function normalizeExternalNullifier(value: bigint | number | string): string {
    if (typeof value === "bigint") {
        if (value < 0n) {
            throw new Error("externalNullifier cannot be negative.");
        }
        return value.toString(10);
    }

    if (typeof value === "number") {
        if (!Number.isSafeInteger(value) || value < 0) {
            throw new Error("externalNullifier number must be a non-negative safe integer.");
        }
        return String(value);
    }

    const trimmed = value.trim();
    if (!/^\d+$/.test(trimmed)) {
        throw new Error(
            "externalNullifier string must be a canonical non-negative decimal string."
        );
    }

    return trimmed.replace(/^0+(?=\d)/, "");
}

export function electionKeyFromExternalNullifier(
    value: bigint | number | string
): ElectionKey {
    return {kind: "externalNullifier", value: normalizeExternalNullifier(value)};
}

function assertWebCrypto(): Crypto {
    const c = globalThis.crypto;
    if (!c?.subtle) {
        throw new Error("Web Crypto API is not available in this environment.");
    }
    return c;
}

function assertPassword(password: unknown, minLength: number): asserts password is string {
    if (typeof password !== "string" || password.length < minLength) {
        throw new Error(
            `Password must be a string with at least ${minLength} characters.`
        );
    }
}

function assertArgon2Iterations(iterations: number): void {
    if (!Number.isInteger(iterations)) {
        throw new TypeError("Argon2 iterations must be an integer.");
    }
    if (
        iterations < MIN_ALLOWED_ARGON2_ITERATIONS ||
        iterations > MAX_ALLOWED_ARGON2_ITERATIONS
    ) {
        throw new Error(
            `Argon2 iterations are out of allowed range: ${iterations}. ` +
            `Allowed range: ${MIN_ALLOWED_ARGON2_ITERATIONS}..${MAX_ALLOWED_ARGON2_ITERATIONS}.`
        );
    }
}

function assertArgon2MemoryKiB(memoryKiB: number): void {
    if (!Number.isInteger(memoryKiB)) {
        throw new TypeError("Argon2 memoryKiB must be an integer.");
    }
    if (
        memoryKiB < MIN_ALLOWED_ARGON2_MEMORY_KIB ||
        memoryKiB > MAX_ALLOWED_ARGON2_MEMORY_KIB
    ) {
        throw new Error(
            `Argon2 memoryKiB is out of allowed range: ${memoryKiB}. ` +
            `Allowed range: ${MIN_ALLOWED_ARGON2_MEMORY_KIB}..${MAX_ALLOWED_ARGON2_MEMORY_KIB}.`
        );
    }
}

function assertArgon2Parallelism(parallelism: number): void {
    if (!Number.isInteger(parallelism)) {
        throw new TypeError("Argon2 parallelism must be an integer.");
    }
    if (
        parallelism < MIN_ALLOWED_ARGON2_PARALLELISM ||
        parallelism > MAX_ALLOWED_ARGON2_PARALLELISM
    ) {
        throw new Error(
            `Argon2 parallelism is out of allowed range: ${parallelism}. ` +
            `Allowed range: ${MIN_ALLOWED_ARGON2_PARALLELISM}..${MAX_ALLOWED_ARGON2_PARALLELISM}.`
        );
    }
}

function assertVaultKdf(kdf: IdentityVault["kdf"]): void {
    if (kdf.name === CURRENT_KDF) {
        assertArgon2Iterations(kdf.iterations);
        assertArgon2MemoryKiB(kdf.memoryKiB);
        assertArgon2Parallelism(kdf.parallelism);
        return;
    }

    throw new Error(`Unsupported KDF: ${(kdf as { name?: unknown }).name}`);
}

function bytesToHex(bytes: Uint8Array): string {
    return Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("");
}

function asBufferSource(bytes: Uint8Array): BufferSource {
    return bytes as unknown as BufferSource;
}

function base64Encode(bytes: Uint8Array): string {
    if (typeof globalThis.btoa === "function") {
        let binary = "";
        for (const b of bytes) binary += String.fromCodePoint(b);
        return globalThis.btoa(binary);
    }

    return Buffer.from(bytes).toString("base64");
}

function base64DecodeStrict(b64: unknown, label: string): Uint8Array {
    if (typeof b64 !== "string" || b64.length === 0) {
        throw new Error(`${label} must be a non-empty base64 string.`);
    }
    if (!BASE64_CANONICAL_PATTERN.test(b64)) {
        throw new Error(`${label} is not canonical base64.`);
    }

    let out: Uint8Array;
    if (typeof globalThis.atob === "function") {
        let binary: string;
        try {
            binary = globalThis.atob(b64);
        } catch {
            throw new Error(`${label} is not valid base64.`);
        }

        out = new Uint8Array(binary.length);
        for (let i = 0; i < binary.length; i++) {
            const codePoint = binary.codePointAt(i);
            if (codePoint === undefined || codePoint > 0xff) {
                throw new Error(`${label} contains invalid binary data.`);
            }
            out[i] = codePoint;
        }
    } else {
        try {
            out = new Uint8Array(Buffer.from(b64, "base64"));
        } catch {
            throw new Error(`${label} is not valid base64.`);
        }
    }

    if (base64Encode(out) !== b64) {
        throw new Error(`${label} is not canonical base64.`);
    }

    return out;
}

// best-effort zeroization for JS
export function wipeBytes(bytes: Uint8Array | undefined | null): void {
    if (!bytes) return;
    bytes.fill(0);
}

function validateVaultShape(vault: IdentityVault): void {
    const version = (vault as { version?: unknown }).version;
    if (version !== CURRENT_VAULT_VERSION) {
        throw new Error(`Unsupported identity vault version: ${String(version)}`);
    }

    if (vault.cipher !== CURRENT_CIPHER) {
        throw new Error(`Unsupported cipher: ${vault.cipher}`);
    }

    if (vault.kdf?.name !== CURRENT_KDF) {
        throw new Error("Identity vault version 3 only supports ARGON2ID.");
    }

    assertVaultKdf(vault.kdf);

    const salt = base64DecodeStrict(vault.kdf.saltB64, "saltB64");
    const iv = base64DecodeStrict(vault.ivB64, "ivB64");
    const ciphertext = base64DecodeStrict(vault.ciphertextB64, "ciphertextB64");

    if (salt.length !== KDF_SALT_BYTES) {
        throw new Error(
            `Invalid salt length: ${salt.length}. Expected ${KDF_SALT_BYTES} bytes.`
        );
    }

    if (iv.length !== AES_GCM_IV_BYTES) {
        throw new Error(
            `Invalid IV length: ${iv.length}. Expected ${AES_GCM_IV_BYTES} bytes.`
        );
    }

    if (ciphertext.length < MASTER_SECRET_BYTES + AES_GCM_TAG_BYTES) {
        throw new Error(
            `Ciphertext is too short: ${ciphertext.length}. ` +
            `Expected at least ${MASTER_SECRET_BYTES + AES_GCM_TAG_BYTES} bytes.`
        );
    }
}

function buildStructuredAad(label: string, fields: Array<readonly [string, string]>): Uint8Array {
    const parts = [label];
    for (const [key, value] of fields) {
        parts.push(`${key.length}:${key}:${value.length}:${value}`);
    }
    return textEncoder.encode(parts.join("|"));
}


function buildVaultAAD(vault: Pick<IdentityVault, "version" | "cipher" | "kdf">): Uint8Array {
    return buildStructuredAad(VAULT_AAD_V3_LABEL, [
        ["version", String(vault.version)],
        ["cipher", vault.cipher],
        ["kdfName", vault.kdf.name],
        ["kdfIterations", String(vault.kdf.iterations)],
        ["kdfMemoryKiB", String(vault.kdf.memoryKiB)],
        ["kdfParallelism", String(vault.kdf.parallelism)],
        ["kdfSaltB64", vault.kdf.saltB64],
    ]);
}

async function deriveAesKeyFromPassword(
    password: string,
    salt: Uint8Array,
    kdf: IdentityVault["kdf"]
): Promise<CryptoKey> {
    const cryptoApi = assertWebCrypto();
    assertVaultKdf(kdf);

    const passwordBytes = textEncoder.encode(password);
    let keyBytes: Uint8Array | undefined;

    try {
        keyBytes = await runArgon2id(passwordBytes, salt, {
            t: kdf.iterations,
            m: kdf.memoryKiB,
            p: kdf.parallelism,
            dkLen: 32,
        });

        return await cryptoApi.subtle.importKey(
            "raw",
            asBufferSource(keyBytes),
            {name: "AES-GCM"},
            false,
            ["encrypt", "decrypt"]
        );
    } finally {
        wipeBytes(keyBytes);
        wipeBytes(passwordBytes);
    }
}

function resolveIdentityVaultOptions(options: IdentityVaultOptions = {}): Required<IdentityVaultOptions> {
    return {
        iterations: options.iterations ?? CURRENT_ARGON2_ITERATIONS,
        memoryKiB: options.memoryKiB ?? CURRENT_ARGON2_MEMORY_KIB,
        parallelism: options.parallelism ?? CURRENT_ARGON2_PARALLELISM,
    };
}

async function encryptMasterSecret(
    password: string,
    masterSecret: Uint8Array,
    options: IdentityVaultOptions = {}
): Promise<IdentityVault> {
    if (masterSecret.length !== MASTER_SECRET_BYTES) {
        throw new Error(`Invalid master secret length: ${masterSecret.length}`);
    }

    const cryptoApi = assertWebCrypto();
    const resolvedOptions = resolveIdentityVaultOptions(options);
    const salt = cryptoApi.getRandomValues(new Uint8Array(KDF_SALT_BYTES));
    const iv = cryptoApi.getRandomValues(new Uint8Array(AES_GCM_IV_BYTES));

    const vaultBase = {
        version: CURRENT_VAULT_VERSION,
        cipher: CURRENT_CIPHER,
        kdf: {
            name: CURRENT_KDF,
            iterations: resolvedOptions.iterations,
            memoryKiB: resolvedOptions.memoryKiB,
            parallelism: resolvedOptions.parallelism,
            saltB64: base64Encode(salt),
        },
    } as const;

    assertVaultKdf(vaultBase.kdf);

    const aad = buildVaultAAD(vaultBase);
    const aesKey = await deriveAesKeyFromPassword(password, salt, vaultBase.kdf);

    try {
        const ciphertext = await cryptoApi.subtle.encrypt(
            {
                name: "AES-GCM",
                iv: asBufferSource(iv),
                additionalData: asBufferSource(aad),
            },
            aesKey,
            asBufferSource(masterSecret)
        );

        return {
            ...vaultBase,
            ivB64: base64Encode(iv),
            ciphertextB64: base64Encode(new Uint8Array(ciphertext)),
        };
    } finally {
        wipeBytes(salt);
        wipeBytes(iv);
    }
}

function normalizeElectionKey(key: ElectionKey): string {
    switch (key.kind) {
        case "uuid": {
            const normalized = key.value.trim().toLowerCase();
            const uuidPattern =
                /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/;

            if (!uuidPattern.test(normalized)) {
                throw new Error(`Invalid UUID election key: ${key.value}`);
            }

            return `uuid:${normalized}`;
        }

        case "address": {
            const normalized = key.value.trim().toLowerCase();
            const addressPattern = /^0x[0-9a-f]{40}$/;

            if (!addressPattern.test(normalized)) {
                throw new Error(`Invalid address election key: ${key.value}`);
            }

            return `address:${normalized}`;
        }

        case "externalNullifier": {
            const dec = normalizeExternalNullifier(key.value);
            return `externalNullifier:${dec}`;
        }

        case "raw": {
            const normalized = key.value.trim();
            if (!normalized) {
                throw new Error("Raw election key cannot be empty.");
            }
            return `raw:${normalized}`;
        }
    }
}

async function deriveElectionSeed(
    masterSecret: Uint8Array,
    electionKey: ElectionKey
): Promise<Uint8Array> {
    const cryptoApi = assertWebCrypto();

    const normalized = normalizeElectionKey(electionKey);
    const info = textEncoder.encode(`semaphore-election:${normalized}`);

    const hmacKey = await cryptoApi.subtle.importKey(
        "raw",
        asBufferSource(masterSecret),
        {
            name: "HMAC",
            hash: "SHA-256",
        },
        false,
        ["sign"]
    );

    const mac = await cryptoApi.subtle.sign("HMAC", hmacKey, asBufferSource(info));
    return new Uint8Array(mac); // 32 bytes
}

export async function createIdentityVault(
    password: string,
    options: IdentityVaultOptions = {}
): Promise<IdentityVault> {
    assertPassword(password, IDENTITY_VAULT_MIN_PASSWORD_LENGTH);

    const cryptoApi = assertWebCrypto();
    const masterSecret = cryptoApi.getRandomValues(
        new Uint8Array(MASTER_SECRET_BYTES)
    );

    try {
        return await encryptMasterSecret(password, masterSecret, options);
    } finally {
        wipeBytes(masterSecret);
    }
}

export async function decryptMasterSecret(
    password: string,
    vault: IdentityVault
): Promise<Uint8Array> {
    assertPassword(password, IDENTITY_VAULT_MIN_PASSWORD_LENGTH);
    validateVaultShape(vault);

    const cryptoApi = assertWebCrypto();

    const salt = base64DecodeStrict(vault.kdf.saltB64, "saltB64");
    const iv = base64DecodeStrict(vault.ivB64, "ivB64");
    const ciphertext = base64DecodeStrict(vault.ciphertextB64, "ciphertextB64");

    const aad = buildVaultAAD({
        version: vault.version,
        cipher: vault.cipher,
        kdf: vault.kdf,
    });

    const aesKey = await deriveAesKeyFromPassword(
        password,
        salt,
        vault.kdf
    );

    let plaintext: ArrayBuffer;
    try {
        plaintext = await cryptoApi.subtle.decrypt(
            {
                name: "AES-GCM",
                iv: asBufferSource(iv),
                additionalData: asBufferSource(aad),
            },
            aesKey,
            asBufferSource(ciphertext)
        );
    } catch {
        throw new Error("Failed to decrypt identity vault. Wrong password or tampered/corrupted vault.");
    }

    const masterSecret = new Uint8Array(plaintext);

    if (masterSecret.length !== MASTER_SECRET_BYTES) {
        wipeBytes(masterSecret);
        throw new Error(`Invalid master secret length: ${masterSecret.length}`);
    }

    return masterSecret;
}

export function needsVaultUpgrade(vault: IdentityVault): boolean {
    try {
        validateVaultShape(vault);
    } catch {
        return true;
    }

    if (vault.version !== CURRENT_VAULT_VERSION || vault.kdf.name !== CURRENT_KDF) {
        return true;
    }

    return (
        vault.cipher !== CURRENT_CIPHER ||
        vault.kdf.iterations < CURRENT_ARGON2_ITERATIONS ||
        vault.kdf.memoryKiB < CURRENT_ARGON2_MEMORY_KIB ||
        vault.kdf.parallelism < CURRENT_ARGON2_PARALLELISM
    );
}

export async function upgradeIdentityVault(
    password: string,
    vault: IdentityVault,
    options: IdentityVaultOptions = {}
): Promise<IdentityVault> {
    assertPassword(password, IDENTITY_VAULT_MIN_PASSWORD_LENGTH);

    const masterSecret = await decryptMasterSecret(password, vault);

    try {
        return await encryptMasterSecret(password, masterSecret, options);
    } finally {
        wipeBytes(masterSecret);
    }
}

export async function deriveElectionIdentityFromMasterSecret(
    masterSecret: Uint8Array,
    electionKey: ElectionKey
): Promise<Identity> {
    if (masterSecret.length !== MASTER_SECRET_BYTES) {
        throw new Error(`Invalid master secret length: ${masterSecret.length}`);
    }

    const seedBytes = await deriveElectionSeed(masterSecret, electionKey);

    try {
        const seedHex = bytesToHex(seedBytes);
        return new Identity(seedHex);
    } finally {
        wipeBytes(seedBytes);
    }
}

export async function deriveElectionIdentityFromVault(
    password: string,
    vault: IdentityVault,
    electionKey: ElectionKey
): Promise<Identity> {
    const masterSecret = await decryptMasterSecret(password, vault);

    try {
        return await deriveElectionIdentityFromMasterSecret(masterSecret, electionKey);
    } finally {
        wipeBytes(masterSecret);
    }
}

export async function createVaultAndElectionIdentity(
    password: string,
    electionKey: ElectionKey,
    options: IdentityVaultOptions = {}
): Promise<{ vault: IdentityVault; identity: Identity }> {
    const vault = await createIdentityVault(password, options);
    const identity = await deriveElectionIdentityFromVault(password, vault, electionKey);

    return {vault, identity};
}
