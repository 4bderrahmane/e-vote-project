import type {MerkleProof} from "@semaphore-protocol/group"
import {getAddress, isAddress} from "viem"
import {z} from "zod"

export const FastifyMerkleProofResponseSchema = z
    .object({
        groupId: z.string().min(1),
        expectedDepth: z.number().int().positive(),
        root: z.string().min(1),
        leaf: z.string().min(1),
        siblings: z.array(z.string()),
        index: z.number().int().nonnegative()
    })
    .superRefine((v, ctx) => {
        // optional consistency check
        if (v.siblings.length !== v.expectedDepth) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: `siblings length (${v.siblings.length}) must equal expectedDepth (${v.expectedDepth})`
            })
        }
    })

export type FastifyMerkleProofResponse = z.infer<typeof FastifyMerkleProofResponseSchema>

export type FetchElectionMerkleProofParams = {
    fastifyBaseUrl: string
    electionAddress: string
    commitmentDec: string
    headers?: Record<string, string>
    signal?: AbortSignal
}

export async function fetchElectionMerkleProof(params: FetchElectionMerkleProofParams): Promise<FastifyMerkleProofResponse> {
    const { fastifyBaseUrl, electionAddress, commitmentDec, headers, signal } = params

    if (!isAddress(electionAddress)) {
        throw new Error(`Invalid electionAddress: ${electionAddress}`)
    }

    const base = fastifyBaseUrl.replace(/\/+$/, "")
    const url = new URL(`${base}/elections/${encodeURIComponent(normalizeAddress(electionAddress))}/proof`)
    url.searchParams.set("commitment", commitmentDec)

    const res = await fetch(url.toString(), {
        method: "GET",
        headers: { Accept: "application/json", ...headers },
        signal
    })

    if (!res.ok) {
        const text = await safeReadText(res)
        throw new Error(`Fastify /elections/:address/proof failed (${res.status}): ${text}`)
    }

    const json: unknown = await res.json()
    return FastifyMerkleProofResponseSchema.parse(json)
}

/** Convert Fastify DTO into the Semaphore MerkleProof type expected by @semaphore-protocol/proof. */
export function toMerkleProof(dto: FastifyMerkleProofResponse): MerkleProof {
    return {
        root: parseBigIntLike(dto.root),
        leaf: parseBigIntLike(dto.leaf),
        index: dto.index,
        siblings: dto.siblings.map(parseBigIntLike)
    }
}

/* ----------------------------- utils ----------------------------- */

async function safeReadText(res: Response): Promise<string> {
    try {
        return await res.text()
    } catch {
        return "<unreadable>"
    }
}

function parseBigIntLike(x: string | number | bigint): bigint {
    if (typeof x === "bigint") return x
    if (typeof x === "number") {
        if (!Number.isInteger(x)) throw new TypeError(`Expected integer number, got ${x}`)
        return BigInt(x)
    }
    const s = x.trim()
    if (s.length === 0) throw new TypeError("Empty bigint string")
    return BigInt(s) // supports "0x..." and decimal
}

function normalizeAddress(address: string): string {
    return getAddress(address).toLowerCase()
}
