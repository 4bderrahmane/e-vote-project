import {argon2id} from "@noble/hashes/argon2";
import type {Argon2WorkerRequest, Argon2WorkerResponse} from "./argon2.types";

type WorkerScope = {
    onmessage: ((event: MessageEvent<Argon2WorkerRequest>) => void) | null;
    postMessage: (data: Argon2WorkerResponse, options?: { transfer?: Transferable[] }) => void;
};

const scope = globalThis as unknown as WorkerScope;

scope.onmessage = (event: MessageEvent<Argon2WorkerRequest>) => {
    const {password, salt, t, m, p, dkLen} = event.data;

    try {
        const key = argon2id(password, salt, {t, m, p, dkLen});
        const response: Argon2WorkerResponse = {ok: true, key};
        scope.postMessage(response, {transfer: [key.buffer]});
    } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        const response: Argon2WorkerResponse = {ok: false, error: message};
        scope.postMessage(response);
    } finally {
        password.fill(0);
        salt.fill(0);
    }
};
