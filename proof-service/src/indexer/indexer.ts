import {env} from "../config/env"
import {client, electionContract} from "../domain/chain"
import type {ElectionGroupState} from "../domain/state"
import {getLastProcessedBlock, setLastProcessedBlock, upsertMember} from "../infrastructure/db"

const DEFAULT_POLL_MS = 2000

function sleep(ms: number) {
    return new Promise((res) => setTimeout(res, ms))
}

function minBigInt(a: bigint, b: bigint) {
    return a < b ? a : b
}

/**
 * Continuously indexes MemberAdded logs for one election and keeps:
 *  - DB up to date (members + lastProcessedBlock)
 *  - in-memory ElectionGroupState updated (so /proof is instant)
 */
export async function runIndexerLoop(state: ElectionGroupState): Promise<void> {
    const c = electionContract(state.election)

    const confirmations = BigInt(env.CONFIRMATIONS ?? 0)
    const batchSize = BigInt(env.LOG_BATCH_SIZE ?? 50_000)

    while (true) {
        try {
            const head = await client.getBlockNumber()
            const finalizedTo = head > confirmations ? head - confirmations : 0n

            const last = await getLastProcessedBlock(state.election)

            // Don't skip block 0 on fresh start.
            let from = last === 0n ? 0n : last + 1n

            if (from > finalizedTo) {
                await sleep(DEFAULT_POLL_MS)
                continue
            }

            while (from <= finalizedTo) {
                const to = minBigInt(finalizedTo, from + batchSize)

                const logs = await c.getEvents.MemberAdded({
                    fromBlock: from,
                    toBlock: to
                })

                // Always sort by canonical order
                logs.sort((a, b) => {
                    if (a.blockNumber === b.blockNumber) {
                        return Number(a.logIndex - b.logIndex)
                    }
                    return Number(a.blockNumber - b.blockNumber)
                })

                for (const log of logs) {
                    const {groupId, index, identityCommitment} = log.args

                    // You can enforce groupId match if you want strictness:
                    // if (BigInt(groupId) !== state.groupId) continue

                    const leafIndex = BigInt(index)
                    const commitment = BigInt(identityCommitment)

                    // Persist first (idempotent insert recommended)
                    await upsertMember({
                        election: state.election,
                        groupId: groupId.toString(),
                        leafIndex,
                        commitment: commitment.toString(),
                        blockNumber: log.blockNumber,
                        logIndex: log.logIndex
                    })

                    // Update memory tree (assumes logs arrive in correct sequential order)
                    state.addMember(commitment, Number(leafIndex))
                }

                // After processing the batch, advance the cursor
                await setLastProcessedBlock(state.election, to)
                from = to + 1n
            }
        } catch (err) {
            // Don’t crash the service; backoff and retry
            console.error(`[indexer] ${state.election} error`, err)
            await sleep(3000)
        }
    }
}
