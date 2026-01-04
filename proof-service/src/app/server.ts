import Fastify, {type FastifyInstance} from "fastify"
import {registerRoutes} from "./routes.js"
import type {ElectionGroupState} from "../domain/state.js"

export function buildServer(states: Map<string, ElectionGroupState>): FastifyInstance {
    const app = Fastify({logger: true})

    registerRoutes(app, states)

    return app
}
