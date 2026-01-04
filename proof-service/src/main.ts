import {migrate} from "./db.js"
import {env, electionAddresses} from "./config.js"
import {bootstrapElectionState, runIndexerLoop} from "./indexer.js"
import {buildHttpServer} from "./http.js"

async function main() {
    await migrate()

    const states = new Map<string, any>()

    // bootstrap all elections and start indexers
    for (const addr of electionAddresses) {
        const state = await bootstrapElectionState(addr)
        states.set(addr.toLowerCase(), state)

        // fire-and-forget loop
        runIndexerLoop(state)
    }

    const app = buildHttpServer(states)
    await app.listen({port: env.PORT, host: "0.0.0.0"})
    app.log.info(`proof-service listening on ${env.PORT}`)
}

main().catch(err => {
    console.error(err)
    process.exit(1)
})
