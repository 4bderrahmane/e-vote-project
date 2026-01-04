import {client, electionContract} from "./chain.js"
import {env} from "./config.js"
import {getLastProcessedBlock, loadMembers, setLastProcessedBlock, upsertMember} from "./db.js"
import {ElectionGroupState} from "./state.js"

function minBigInt(a: bigint, b: bigint) {
    return a < b ? a : b
}

export async function bootstrapElectionState(election: `0x${string}`) {
    const c = electionContract(election)

    const groupId = await c.read.externalNullifier()
    const depth = Number(await c.read.getMerkleTreeDepth([groupId]))

    const state = new ElectionGroupState(election)
    state.init(groupId, depth)

    // load persisted members
    const rows = await loadMembers(election)
    const members = rows.map(r => ({
        leafIndex: Number(BigInt(r.leaf_index)),
        commitment: BigInt(r.identity_commitment)
    }))

    state.rebuildFromMembers(members)
    return state
}

export async function runIndexerLoop(state: ElectionGroupState) {
    const c = electionContract(state.election)

    while (true) {
        try {
            const head = await client.getBlockNumber()
            const toBlock = head > BigInt(env.CONFIRMATIONS) ? head - BigInt(env.CONFIRMATIONS) : 0n

            let fromBlock = (await getLastProcessedBlock(state.election)) + 1n
            if (fromBlock === 1n && toBlock === 0n) {
                await sleep(2000)
                continue
            }

            // batch getLogs to avoid provider limits
            while (fromBlock <= toBlock) {
                const batchTo = minBigInt(toBlock, fromBlock + BigInt(env.LOG_BATCH_SIZE))

                const logs = await c.getEvents.MemberAdded({
                    fromBlock,
                    toBlock: batchTo
                })

                // guaranteed order is not always safe across RPCs, so sort
                logs.sort((a, b) =>
                    a.blockNumber === b.blockNumber
                        ? Number(a.logIndex - b.logIndex)
                        : Number(a.blockNumber - b.blockNumber)
                )

                for (const log of logs) {
                    const {groupId, index, identityCommitment} = log.args

                    // You can assert groupId === state.groupId if you want strictness
                    const leafIndex = BigInt(index)
                    const commitment = BigInt(identityCommitment)

                    await upsertMember({
                        election: state.election,
                        groupId: groupId.toString(),
                        leafIndex,
                        commitment: commitment.toString(),
                        blockNumber: log.blockNumber,
                        logIndex: log.logIndex
                    })

                    // If your indexer can receive out-of-order inserts, rebuild instead.
                    // For v1, we assume events are appended in order.
                    state.addMember(commitment, Number(leafIndex))
                }

                await setLastProcessedBlock(state.election, batchTo)
                fromBlock = batchTo + 1n
            }
        } catch (e) {
            // backoff on errors
            console.error(`[indexer] ${state.election} error`, e)
        }

        await sleep(2000)
    }
}

function sleep(ms: number) {
    return new Promise(res => setTimeout(res, ms))
}
