import Fastify from "fastify"
import {z} from "zod"
import type {ElectionGroupState} from "./state.js"
import {electionContract} from "./chain.js"

export function buildHttpServer(states: Map<string, ElectionGroupState>) {
    const app = Fastify({logger: true})

    app.get("/health", async () => ({ok: true}))

    app.get("/elections/:address/root", async (req, reply) => {
        const address = (req.params as any).address as string
        const state = states.get(address.toLowerCase())
        if (!state) return reply.code(404).send({error: "Unknown election"})

        // return BOTH off-chain root and on-chain root for sanity
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

    app.get("/elections/:address/proof", async (req, reply) => {
        const address = (req.params as any).address as string
        const state = states.get(address.toLowerCase())
        if (!state) return reply.code(404).send({error: "Unknown election"})

        const querySchema = z.object({
            commitment: z.string().regex(/^\d+$/)
        })
        const {commitment} = querySchema.parse(req.query)

        const proof = state.getProofByCommitment(BigInt(commitment))

        // sanity check root matches chain (optional but recommended)
        const c = electionContract(state.election)
        const onchainRoot = await c.read.getMerkleTreeRoot([state.groupId])
        if (BigInt(proof.root) !== onchainRoot) {
            return reply.code(409).send({
                error: "Indexer out of sync (root mismatch)",
                expected: onchainRoot.toString(),
                got: proof.root
            })
        }

        return {
            groupId: state.groupId.toString(),
            depth: state.depth,
            ...proof
        }
    })

    return app
}
