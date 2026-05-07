import assert from "node:assert/strict";
import { describe, it } from "mocha";
import { Group } from "@semaphore-protocol/group";
import { Identity } from "@semaphore-protocol/identity";
import { keccak256 } from "viem";

import vectors from "./fixtures/cross-stack-vectors.json";
import { hashCiphertextToField } from "../semaphore/proof";

function toBytes32Hex(value: bigint): `0x${string}` {
    return `0x${value.toString(16).padStart(64, "0")}`;
}

function hashFieldToSemaphoreSignal(value: bigint): bigint {
    return BigInt(keccak256(toBytes32Hex(value))) >> 8n;
}

describe("cross-stack vectors", () => {
    it("matches installed Semaphore identity derivation", () => {
        assert.equal(vectors.schema, "privote-cross-stack-vectors-v1");

        for (const vector of vectors.identityVectors) {
            const identity = new Identity(vector.seedHex);

            assert.equal(identity.secretScalar.toString(), vector.secretScalar);
            assert.deepEqual(
                identity.publicKey.map((value) => value.toString()),
                vector.publicKey
            );
            assert.equal(identity.commitment.toString(), vector.commitment);
        }
    });

    it("matches deterministic proof inputs and public signals", () => {
        for (const vector of vectors.proofVectors) {
            const group = new Group(vector.group.memberCommitments);
            const merkleProof = group.generateMerkleProof(vector.group.memberIndex);
            const ciphertextMessage = hashCiphertextToField(
                vector.ballot.ciphertextHex as `0x${string}`
            );
            const messageHash = hashFieldToSemaphoreSignal(
                BigInt(vector.semaphoreProofDto.message)
            );
            const scopeHash = hashFieldToSemaphoreSignal(
                BigInt(vector.semaphoreProofDto.scope)
            );

            assert.equal(group.root.toString(), vector.group.root);
            assert.equal(merkleProof.root.toString(), vector.merkleProof.root);
            assert.equal(merkleProof.leaf.toString(), vector.merkleProof.leaf);
            assert.equal(merkleProof.index, vector.merkleProof.index);
            assert.deepEqual(
                merkleProof.siblings.map((value) => value.toString()),
                vector.merkleProof.siblings
            );

            assert.equal(
                ciphertextMessage.toString(),
                vector.ballot.ciphertextMessage
            );
            assert.equal(vector.semaphoreProofDto.message, vector.ballot.ciphertextMessage);
            assert.equal(messageHash.toString(), vector.proofPublicSignals.messageHash);
            assert.equal(scopeHash.toString(), vector.proofPublicSignals.scopeHash);
            assert.equal(vector.witnessInputs.message, vector.proofPublicSignals.messageHash);
            assert.equal(vector.witnessInputs.scope, vector.proofPublicSignals.scopeHash);
            assert.deepEqual(vector.proofPublicSignals.orderedForGroth16Verifier, [
                vector.semaphoreProofDto.merkleTreeRoot,
                vector.semaphoreProofDto.nullifier,
                vector.proofPublicSignals.messageHash,
                vector.proofPublicSignals.scopeHash,
            ]);
        }
    });
});
