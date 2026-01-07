import { ElectionGroupState as ElectionGroupStateImpl } from "../domain/state"
import { electionContract } from "../domain/chain"
import { loadMembers } from "../infrastructure/db"

export type BootstrappedElection = {
    state: ElectionGroupStateImpl
    members: { leafIndex: number; commitment: bigint }[]
}

async function bootstrapElectionInternal(
    electionAddress: `0x${string}`
): Promise<BootstrappedElection> {
    const c = electionContract(electionAddress)

    const groupId = await c.read.externalNullifier()
    const depth = Number(await c.read.getMerkleTreeDepth([groupId]))

    const state = new ElectionGroupStateImpl(electionAddress)
    state.init(groupId, depth)

    const rows = await loadMembers(electionAddress)

    const members = rows.map((r: any) => ({
        leafIndex: Number(BigInt(r.leaf_index)),
        commitment: BigInt(r.identity_commitment)
    }))

    state.rebuildFromMembers(members)

    return { state, members }
}

export async function bootstrapElectionState(
    electionAddress: `0x${string}`
): Promise<ElectionGroupStateImpl> {
    const { state } = await bootstrapElectionInternal(electionAddress)
    return state
}

export async function bootstrapElectionSnapshot(
    electionAddress: `0x${string}`
): Promise<BootstrappedElection> {
    return bootstrapElectionInternal(electionAddress)
}
