import type { IdentityVault } from "./identity";

const STORAGE_PREFIX = "privote:voter-identity-vault:";

function assertStorage(): Storage {
    if (globalThis.window === undefined || !globalThis.localStorage) {
        throw new Error("Persistent browser storage is not available in this environment.");
    }

    return globalThis.localStorage;
}

function normalizeUserId(userId: string): string {
    const normalized = userId.trim();
    if (!normalized) {
        throw new Error("User id is required for identity vault storage.");
    }
    return normalized;
}

function storageKey(userId: string): string {
    return `${STORAGE_PREFIX}${normalizeUserId(userId)}`;
}

function parseVault(raw: string): IdentityVault {
    return JSON.parse(raw) as IdentityVault;
}

export function loadIdentityVault(userId: string): IdentityVault | null {
    const raw = assertStorage().getItem(storageKey(userId));
    if (!raw) {
        return null;
    }

    return parseVault(raw);
}

export function saveIdentityVault(userId: string, vault: IdentityVault): void {
    assertStorage().setItem(storageKey(userId), JSON.stringify(vault));
}

export function deleteIdentityVault(userId: string): void {
    assertStorage().removeItem(storageKey(userId));
}

export function hasIdentityVault(userId: string): boolean {
    return loadIdentityVault(userId) !== null;
}
