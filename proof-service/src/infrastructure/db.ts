import pg from "pg"
import { env } from "../config/env"

export const pool = new pg.Pool({
    connectionString: env.DATABASE_URL
})

export async function migrate() {
    await pool.query(`
        CREATE TABLE IF NOT EXISTS sync_state (
                                                  election_address TEXT PRIMARY KEY,
                                                  last_processed_block BIGINT NOT NULL DEFAULT 0
        );

        CREATE TABLE IF NOT EXISTS members (
                                               election_address TEXT NOT NULL,
                                               group_id TEXT NOT NULL,
                                               leaf_index BIGINT NOT NULL,
                                               identity_commitment TEXT NOT NULL,
                                               block_number BIGINT NOT NULL,
                                               log_index BIGINT NOT NULL,
                                               PRIMARY KEY (election_address, leaf_index)
            );

        CREATE INDEX IF NOT EXISTS members_commitment_idx
            ON members (election_address, identity_commitment);
    `)
}

export async function getLastProcessedBlock(election: string): Promise<bigint> {
    const r = await pool.query(
        `SELECT last_processed_block FROM sync_state WHERE election_address=$1`,
        [election]
    )
    if (r.rowCount === 0) return 0n
    return BigInt(r.rows[0].last_processed_block)
}

export async function setLastProcessedBlock(election: string, block: bigint) {
    await pool.query(
        `
            INSERT INTO sync_state (election_address, last_processed_block)
            VALUES ($1, $2)
                ON CONFLICT (election_address)
    DO UPDATE SET last_processed_block = EXCLUDED.last_processed_block
        `,
        [election, block.toString()]
    )
}

export type MemberRow = {
    leaf_index: string
    identity_commitment: string
}

export async function loadMembers(election: string): Promise<MemberRow[]> {
    const r = await pool.query(
        `SELECT leaf_index, identity_commitment
         FROM members
         WHERE election_address=$1
         ORDER BY leaf_index ASC`,
        [election]
    )
    return r.rows
}

export async function upsertMember(params: {
    election: string
    groupId: string
    leafIndex: bigint
    commitment: string
    blockNumber: bigint
    logIndex: bigint
}) {
    await pool.query(
        `
            INSERT INTO members (
                election_address, group_id, leaf_index, identity_commitment, block_number, log_index
            ) VALUES ($1,$2,$3,$4,$5,$6)
                ON CONFLICT (election_address, leaf_index) DO NOTHING
        `,
        [
            params.election,
            params.groupId,
            params.leafIndex.toString(),
            params.commitment,
            params.blockNumber.toString(),
            params.logIndex.toString()
        ]
    )
}
