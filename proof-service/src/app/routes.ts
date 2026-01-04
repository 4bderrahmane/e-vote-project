import type {FastifyInstance} from "fastify"
import {z} from "zod"
import type {ElectionGroupState} from "../domain/state.js"
import {electionContract} from "../domain/chain.js"

const AddressSchema = z.string().regex(/^0x[a-fA-F0-9]{40}$/)
const CommitmentSchema = z.string().regex(/^\d+$/)

function normalizeAddress(address: string): string {
    return address.toLowerCase()
}

export function registerRoutes(app: FastifyInstance, states: Map<string, ElectionGroupState>) {
    app.get("/health", async () => ({ok: true}))

    app.get<{ Params: { address: string } }>("/elections/:address/root", async (req, reply) => {
        const parsed = AddressSchema.safeParse(req.params.address)
        if (!parsed.success) return reply.code(400).send({error: "Invalid address"})

        const address = normalizeAddress(parsed.data)
        const state = states.get(address)
        if (!state) return reply.code(404).send({error: "Unknown election"})

        const c = electionContract(state.election)
        const onChainRoot = await c.read.getMerkleTreeRoot([state.groupId])
        const offChainRoot = state.getRoot()

        return {
            groupId: state.groupId.toString(),
            depth: state.depth,
            onChainRoot: onChainRoot.toString(),
            offChainRoot: offChainRoot.toString(),
            match: onChainRoot === offChainRoot
        }
    })

    app.get<{ Params: { address: string }, Querystring: { commitment?: string } }>(
        "/elections/:address/proof",
        async (req, reply) => {
            const addrParsed = AddressSchema.safeParse(req.params.address)
            if (!addrParsed.success) return reply.code(400).send({error: "Invalid address"})

            const commitmentParsed = CommitmentSchema.safeParse(req.query.commitment)
            if (!commitmentParsed.success) return reply.code(400).send({error: "Invalid commitment"})

            const address = normalizeAddress(addrParsed.data)
            const state = states.get(address)
            if (!state) return reply.code(404).send({error: "Unknown election"})

            const proof = state.getProofByCommitment(BigInt(commitmentParsed.data))

            const c = electionContract(state.election)
            const onChainRoot = await c.read.getMerkleTreeRoot([state.groupId])

            if (BigInt(proof.root) !== onChainRoot) {
                return reply.code(409).send({
                    error: "Indexer out of sync (root mismatch)",
                    expected: onChainRoot.toString(),
                    got: proof.root
                })
            }

            return {
                groupId: state.groupId.toString(),
                depth: state.depth,
                ...proof
            }
        }
    )
}
