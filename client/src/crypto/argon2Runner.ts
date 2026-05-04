import type { Argon2Params, Argon2WorkerRequest, Argon2WorkerResponse } from "./argon2.types";

export async function runArgon2id(
    password: Uint8Array,
    salt: Uint8Array,
    params: Argon2Params
): Promise<Uint8Array> {
    if (typeof Worker === "undefined") {
        const { argon2id } = await import("@noble/hashes/argon2");
        return argon2id(password, salt, params);
    }

    const worker = new Worker(new URL("./argon2.worker.ts", import.meta.url), {
        type: "module",
    });

    try {
        return await new Promise<Uint8Array>((resolve, reject) => {
            worker.onmessage = (event: MessageEvent<Argon2WorkerResponse>) => {
                if (event.data.ok) {
                    resolve(event.data.key);
                } else {
                    reject(new Error(event.data.error));
                }
            };
            worker.onerror = (event) => {
                reject(event.error ?? new Error("Argon2 worker failed."));
            };
            const passwordCopy = new Uint8Array(password);
            const saltCopy = new Uint8Array(salt);
            const request: Argon2WorkerRequest = { password: passwordCopy, salt: saltCopy, ...params };
            worker.postMessage(
                request,
                { transfer: [passwordCopy.buffer, saltCopy.buffer] }
            );
        });
    } finally {
        worker.terminate();
    }
}
