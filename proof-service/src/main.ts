import { migrate } from "./infrastructure/db.js"
import { env, electionAddresses } from "./config/env.js"
import { runIndexerLoop, bootstrapElectionState } from "./indexer"
import { buildServer } from "./app/server.js"
import type { ElectionGroupState } from "./domain/state.js"

async function main() {
    await migrate()

    const states = new Map<string, ElectionGroupState>()

    for (const addr of electionAddresses) {
        const state = await bootstrapElectionState(addr)
        states.set(addr.toLowerCase(), state)

        void runIndexerLoop(state).catch((err) => {
            console.error(`[indexer] ${addr} crashed`, err)
        })
    }

    const app = buildServer(states)
    await app.listen({ port: env.PORT, host: "0.0.0.0" })
    app.log.info(`proof-service listening on ${env.PORT}`)
}

main().catch((err) => {
    console.error(err)
    process.exit(1)
})
