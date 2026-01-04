import 'dotenv/config'
import {z} from "zod"

const schema = z.object({
    RPC_URL: z.string().url(),
    DATABASE_URL: z.string().min(1),
    // comma-separated list of Election contract addresses for v1
    ELECTION_ADDRESSES: z.string().min(1),
    PORT: z.coerce.number().default(4010),
    // how many confirmations to wait before finalizing logs
    CONFIRMATIONS: z.coerce.number().default(5),
    // max block range per getLogs query (avoid RPC limits)
    LOG_BATCH_SIZE: z.coerce.number().default(50_000)
})

export const env = schema.parse(process.env)

export const electionAddresses = env.ELECTION_ADDRESSES
    .split(",")
    .map(s => s.trim())
    .filter(Boolean) as `0x${string}`[]
