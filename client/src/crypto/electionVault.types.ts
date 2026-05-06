export type VaultSecretMode = "PASSWORD_ONLY" | "PASSWORD_PLUS_CUSTODY_SECRET";

export type VaultCustodyOptions = {

    // Warning: Ive removed the possibility of custodySecret being a string, because it's not safe.
    custodySecret?: Uint8Array;
};

export type ElectionPayloadContext = {
    electionId: string;
    publicKeyFingerprint: string;
    protocolDomain?: string;
};

export type ElectionVaultKdf =
    | {
        name: "PBKDF2-SHA256";
        iterations: number;
        saltB64: string;
        secretMode?: VaultSecretMode;
    }
    | {
        name: "ARGON2ID";
        iterations: number;
        memoryKiB: number;
        parallelism: number;
        saltB64: string;
        secretMode?: VaultSecretMode;
    };

export type ElectionKeyVault = {
    version: 1 | 2;
    privateKeyAlgorithm: "X25519-PKCS8";
    publicKeyRawB64: string;
    wrapping: {
        cipher: "AES-GCM-256";
        kdf: ElectionVaultKdf;
        ivB64: string;
        ciphertextB64: string;
    };
};

export type StoredElectionKeyVault = {
    electionPublicId: string;
    electionTitle?: string;
    createdAt: string;
    publicKeyHex: string;
    vault: ElectionKeyVault;
};
