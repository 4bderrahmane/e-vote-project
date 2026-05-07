import assert from "node:assert/strict";
import {describe, it} from "mocha";

import {
    createIdentityVault,
    decryptMasterSecret,
    deriveElectionIdentityFromMasterSecret,
    deriveElectionIdentityFromVault,
    electionKeyFromExternalNullifier,
    type IdentityVault,
} from "../semaphore/identity";
import {
    hasIdentityVault,
    loadIdentityVault,
    saveIdentityVault,
} from "../semaphore/identityVaultStorage";

const TEST_ARGON2_OPTIONS = {memoryKiB: 8 * 1024};

class MemoryStorage implements Storage {
    private readonly data = new Map<string, string>();

    get length(): number {
        return this.data.size;
    }

    clear(): void {
        this.data.clear();
    }

    getItem(key: string): string | null {
        return this.data.get(key) ?? null;
    }

    key(index: number): string | null {
        return Array.from(this.data.keys())[index] ?? null;
    }

    removeItem(key: string): void {
        this.data.delete(key);
    }

    setItem(key: string, value: string): void {
        this.data.set(key, value);
    }
}

function installBrowserStorage(storage: Storage): () => void {
    const previousWindow = Object.getOwnPropertyDescriptor(globalThis, "window");
    const previousLocalStorage = Object.getOwnPropertyDescriptor(globalThis, "localStorage");

    Object.defineProperty(globalThis, "window", {
        configurable: true,
        value: globalThis,
    });
    Object.defineProperty(globalThis, "localStorage", {
        configurable: true,
        value: storage,
    });

    return () => {
        if (previousWindow) {
            Object.defineProperty(globalThis, "window", previousWindow);
        } else {
            delete (globalThis as { window?: unknown }).window;
        }

        if (previousLocalStorage) {
            Object.defineProperty(globalThis, "localStorage", previousLocalStorage);
        } else {
            delete (globalThis as { localStorage?: unknown }).localStorage;
        }
    };
}

describe("semaphore/identity", () => {
    it("creates and decrypts an Argon2id v3 vault", async () => {
        const vault = await createIdentityVault("very-strong-password", TEST_ARGON2_OPTIONS);
        const secret = await decryptMasterSecret("very-strong-password", vault);

        assert.equal(vault.version, 3);
        assert.equal(vault.kdf.name, "ARGON2ID");
        assert.equal(secret.length, 32);
        assert.notDeepEqual(Array.from(secret), new Array(32).fill(0));
    });

    it("rejects short passwords when creating new vaults", async () => {
        await assert.rejects(
            () => createIdentityVault("short-pass"),
            /at least 16 characters/i
        );
    });

    it("derives stable identity for same vault + election key", async () => {
        const password = "very-strong-password";
        const key = electionKeyFromExternalNullifier("00042");
        const vault = await createIdentityVault(password, TEST_ARGON2_OPTIONS);

        const id1 = await deriveElectionIdentityFromVault(password, vault, key);
        const id2 = await deriveElectionIdentityFromVault(password, vault, key);

        assert.equal(id1.commitment, id2.commitment);
    });

    it("derives different identities for different election keys", async () => {
        const password = "very-strong-password";
        const vault = await createIdentityVault(password, TEST_ARGON2_OPTIONS);
        const secret = await decryptMasterSecret(password, vault);

        const id1 = await deriveElectionIdentityFromMasterSecret(
            secret,
            electionKeyFromExternalNullifier(1)
        );
        const id2 = await deriveElectionIdentityFromMasterSecret(
            secret,
            electionKeyFromExternalNullifier(2)
        );

        assert.notEqual(id1.commitment, id2.commitment);
    });

    it("rejects tampered Argon2 iteration count below allowed minimum", async () => {
        const password = "very-strong-password";
        const vault = await createIdentityVault(password, TEST_ARGON2_OPTIONS);
        if (vault.version !== 3 || vault.kdf.name !== "ARGON2ID") {
            throw new Error("Expected a v3 Argon2id identity vault.");
        }

        const tampered = {
            ...vault,
            kdf: {
                ...vault.kdf,
                iterations: 0,
            },
        };

        await assert.rejects(
            () => decryptMasterSecret(password, tampered),
            /out of allowed range/i
        );
    });
});

describe("semaphore/identityVaultStorage", () => {
    it("stores identity vaults per user", () => {
        const storage = new MemoryStorage();
        const restore = installBrowserStorage(storage);
        const userVault: IdentityVault = {
            version: 3,
            cipher: "AES-GCM-256",
            kdf: {
                name: "ARGON2ID",
                iterations: 3,
                memoryKiB: 64 * 1024,
                parallelism: 1,
                saltB64: "AAAAAAAAAAAAAAAAAAAAAA==",
            },
            ivB64: "AAAAAAAAAAAAAAAA",
            ciphertextB64: "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
        };
        const otherVault: IdentityVault = {
            ...userVault,
            ciphertextB64: "BBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB",
        };

        try {
            saveIdentityVault("user-a", userVault);
            saveIdentityVault("user-b", otherVault);

            assert.equal(loadIdentityVault("user-a")?.ciphertextB64, userVault.ciphertextB64);
            assert.equal(loadIdentityVault("user-b")?.ciphertextB64, otherVault.ciphertextB64);
            assert.equal(loadIdentityVault("missing-user"), null);
            assert.equal(hasIdentityVault("user-a"), true);
            assert.equal(hasIdentityVault("missing-user"), false);
        } finally {
            restore();
        }
    });
});
