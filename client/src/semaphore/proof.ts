// src/semaphore/proof.ts
import type {Identity} from "@semaphore-protocol/identity";
import {generateProof, packToSolidityProof} from "@semaphore-protocol/proof";

export type ProofArtifacts = {
    wasmUrl: string; // put files in /public and reference by URL
    zkeyUrl: string;
};

// function toBigInt(s: string) {
//     return BigInt(s);
// }

export async function generateSemaphoreProof(params: {
    identity: Identity;
    merkleProof: { root: string; leaf: string; siblings: string[]; pathIndices: number[] };
    externalNullifier: string; // election id hashed/encoded as field element string
    signal: string;            // your payload (ideally ciphertext/commitment), string is ok
    artifacts: ProofArtifacts;
}) {
    const {identity, merkleProof, externalNullifier, signal, artifacts} = params;

    // Fetch artifacts once; cache in memory in real code
    const [wasm, zkey] = await Promise.all([
        fetch(artifacts.wasmUrl).then(r => r.arrayBuffer()),
        fetch(artifacts.zkeyUrl).then(r => r.arrayBuffer()),
    ]);

    const fullProof = await generateProof(
        identity,
        {
            root: BigInt(merkleProof.root),
            leaf: BigInt(merkleProof.leaf),
            siblings: merkleProof.siblings.map(BigInt),
            pathIndices: merkleProof.pathIndices,
        },
        BigInt(externalNullifier),
        signal,
        {wasmFile: new Uint8Array(wasm), zkeyFile: new Uint8Array(zkey)}
    );

    return {
        fullProof,
        solidityProof: packToSolidityProof((fullProof as any).proof),
        publicSignals: (fullProof as any).publicSignals,
    };
}
