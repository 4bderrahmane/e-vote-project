import {Identity} from "@semaphore-protocol/identity"
import type {MerkleProof} from "@semaphore-protocol/group"
import {generateProof, type SemaphoreProof} from "@semaphore-protocol/proof"
import type {SnarkArtifacts} from "@zk-kit/artifacts"
import {isAddress} from "viem"

import {fetchElectionMerkleProof, toMerkleProof} from "./group"

export type CreateSemaphoreProofParams = {
    identity: Identity
    merkleProof: MerkleProof
    merkleDepth: number
    /** Your vote payload (e.g., candidateId). */
    message: string | number | bigint | Uint8Array
    scope: string | number | bigint | Uint8Array
    snarkArtifacts?: SnarkArtifacts
    /** Extra safety checks (recommended on). */
    strictLeafCheck?: boolean
}

/**
 * Pure proof generator: no HTTP, just takes an Identity + MerkleProof + depth.
 */
export async function createSemaphoreProof(params: CreateSemaphoreProofParams): Promise<SemaphoreProof> {
    const {
        identity,
        merkleProof,
        merkleDepth,
        message,
        scope,
        snarkArtifacts,
        strictLeafCheck = true
    } = params

    if (strictLeafCheck && merkleProof.leaf !== identity.commitment) {
        throw new Error(
            `Merkle proof leaf mismatch. Got leaf=${merkleProof.leaf.toString()} ` +
            `but identity.commitment=${identity.commitment.toString()}`
        )
    }

    return generateProof(identity, merkleProof, message, scope, merkleDepth, snarkArtifacts)
}

export type CreateSemaphoreProofViaFastifyParams = {
    fastifyBaseUrl: string
    electionAddress: string
    identity: Identity
    /** Your vote payload (e.g., candidateId). */
    message: string | number | bigint | Uint8Array
    scope: string | number | bigint | Uint8Array
    snarkArtifacts?: SnarkArtifacts
    headers?: Record<string, string>
    signal?: AbortSignal
    /** Extra safety checks (recommended on). */
    strictLeafCheck?: boolean
    strictDepthCheck?: boolean
}

/**
 * Convenience helper: fetch Merkle proof from Fastify, then generate Semaphore proof.
 */
export async function createSemaphoreProofViaFastify(params: CreateSemaphoreProofViaFastifyParams): Promise<SemaphoreProof> {
    const {
        fastifyBaseUrl,
        electionAddress,
        identity,
        message,
        scope,
        snarkArtifacts,
        headers,
        signal,
        strictLeafCheck = true,
        strictDepthCheck = true
    } = params

    if (!isAddress(electionAddress)) {
        throw new Error(`Invalid electionAddress: ${electionAddress}`)
    }

    const commitmentDec = identity.commitment.toString() // server expects /^\d+$/ (decimal)

    const dto = await fetchElectionMerkleProof({
        fastifyBaseUrl,
        electionAddress,
        commitmentDec,
        headers,
        signal
    })

    const merkleProof = toMerkleProof(dto)

    if (strictDepthCheck && dto.expectedDepth !== merkleProof.siblings.length) {
        // siblings length is the merkle depth for binary IMT proofs
        throw new Error(
            `Merkle proof depth mismatch. expectedDepth=${dto.expectedDepth} but siblings.length=${merkleProof.siblings.length}`
        )
    }

    // Fastify already checks onChainRoot === proof.root and returns 409 if mismatch.
    return createSemaphoreProof({
        identity,
        merkleProof,
        merkleDepth: dto.expectedDepth,
        message,
        scope,
        snarkArtifacts,
        strictLeafCheck
    })
}