export type Argon2Params = {
    t: number;
    m: number;
    p: number;
    dkLen: number;
};

export type Argon2WorkerRequest = {
    password: Uint8Array;
    salt: Uint8Array;
} & Argon2Params;

export type Argon2WorkerResponse =
    | { ok: true; key: Uint8Array }
    | { ok: false; error: string };
