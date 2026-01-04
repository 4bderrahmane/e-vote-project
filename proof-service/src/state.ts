import {Group} from "@semaphore-protocol/group"


export type MerkleProofDTO = {
    root: string
    leafIndex: number
    siblings: string[]
    pathIndices: number[]
}

export class ElectionGroupState {
    public readonly election: `0x${string}`
    public groupId!: bigint
    public depth!: number
    private group!: Group
    private commitmentToIndex = new Map<string, number>()

    constructor(election: `0x${string}`) {
        this.election = election
    }

    init(groupId: bigint, depth: number) {
        this.groupId = groupId
        this.depth = depth
        this.group = new Group(depth)
        this.commitmentToIndex.clear()
    }

    rebuildFromMembers(members: { leafIndex: number; commitment: bigint }[]) {
        this.group = new Group(this.depth)
        this.commitmentToIndex.clear()

        for (const m of members) {
            // insertion order must match leafIndex order
            this.group.addMember(m.commitment)
            this.commitmentToIndex.set(m.commitment.toString(), m.leafIndex)
        }
    }

    addMember(commitment: bigint, leafIndex: number) {
        // guard against duplicates/replays
        if (this.commitmentToIndex.has(commitment.toString())) return

        // IMPORTANT: must insert in exact order. If you ever receive out-of-order,
        // you should rebuild rather than insert incorrectly.
        this.group.addMember(commitment)
        this.commitmentToIndex.set(commitment.toString(), leafIndex)
    }

    getRoot(): bigint {
        // @semaphore-protocol/group exposes group.root as bigint-like
        // Depending on version: root may be bigint or string. Normalize.
        const r: any = (this.group as any).root
        return typeof r === "bigint" ? r : BigInt(r)
    }

    getProofByCommitment(commitment: bigint): MerkleProofDTO {
        const idx = this.commitmentToIndex.get(commitment.toString())
        if (idx === undefined) {
            throw new Error("Commitment not found in group")
        }
        const proof: any = (this.group as any).generateMerkleProof(idx)
        const root = typeof proof.root === "bigint" ? proof.root : BigInt(proof.root)

        return {
            root: root.toString(),
            leafIndex: idx,
            siblings: proof.siblings.map((x: any) => (typeof x === "bigint" ? x : BigInt(x)).toString()),
            pathIndices: proof.pathIndices.map((n: any) => Number(n))
        }
    }
}
