# Privote

Privote is a privacy-preserving voting platform that separates verified eligibility from anonymous ballot casting. Keycloak authenticates citizens, clients derive election-specific identities, Semaphore proofs establish membership without revealing the voter, and EVM contracts enforce lifecycle and nullifier rules.

The repository contains a working development stack and a single-server production deployment interface. The production interface is deliberately stricter than development, but it is not a substitute for completing the [production checklist](docs/production.md) for a real election.

## Quick start

Prerequisites: Docker Engine with Compose v2, Git, and [Just](https://just.systems/).

```bash
cp .env.example .env
chmod 600 .env
```

Replace every `<...>` value in `.env`, then validate and start:

```bash
just dev-config
just dev
```

The development endpoints are published on host loopback only:

| Service | URL |
| --- | --- |
| Web client | `http://localhost:5173` |
| Keycloak | `http://localhost:8080` |
| Spring API | `http://localhost:9090` |
| Proof service | `http://localhost:4010` |
| Anvil JSON-RPC | `http://localhost:8545` |
| PostgreSQL | `localhost:5432` |

Use `just dev-up` for detached startup, `just dev-logs` for logs, and `just dev-down` to remove the development containers without deleting persisted data. See [Development](docs/development.md) for first-run behavior, host-native workflows, LAN testing, and credential persistence.

## How the stack fits together

| Component | Responsibility |
| --- | --- |
| `client/` | React/Vite web UI, OIDC login, local identity vault, ballot encryption, and browser proof generation |
| `mobile_client/` | Android client and device-local identity/proof workflow |
| `mopro-semaphore/` | Rust/UniFFI bridge for native Semaphore proof generation |
| `server/` | Spring Boot API, authorization, election state, relayed transactions, receipts, and chain reconciliation |
| `keycloak-synchronizer/` | Keycloak event-listener provider that signs citizen updates sent to the backend |
| `proof-service/` | Factory/election event indexer, Merkle reconstruction, root checking, and membership-proof API |
| `foundry/` | Solidity contracts, tests, local Anvil workflow, and deployment verification scripts |
| PostgreSQL | Separate `privote`, `keycloak`, and `proofdb` databases in one development/host instance |

The local Compose topology uses three one-shot jobs:

- `keycloak-realm-generate` creates the secret-bearing realm import inside a Docker volume.
- `keycloak-realm-config` idempotently enables the `citizen-sync` listener for new or persisted realms.
- `contracts-deploy` verifies or deploys the local factory, then exits before the API services start.

An `Exited (0)` state is expected for these jobs. The listener runs inside Keycloak, and deployed contracts live in Anvil—not in the stopped job containers.

## Development and production selection

Docker Compose does not infer `dev` or `prod` from filenames. Privote explicitly combines the shared model with one overlay:

```text
compose.yaml + compose.dev.yaml   -> development
compose.yaml + compose.prod.yaml  -> single-server production
```

The Just recipes are the supported interface:

```bash
just dev
just dev-down
just dev-config

just prod-config
just prod-cert-init
just deploy-prod
just prod-down
```

Development reads `.env`. Production defaults to `/etc/privote/prod.env`, uses PostgreSQL 18 named volumes, expects an external EVM RPC and an already-deployed factory, disables public Keycloak enrollment by default, and publishes only Nginx on ports 80 and 443. Nginx terminates TLS; Certbot obtains and renews certificates.

Read [Production](docs/production.md) before using those commands. The application schema is migrated by Flyway on startup, but deployment-specific backup/restore validation and an independently reviewed contract release remain outstanding before this should be treated as election-grade production infrastructure.

## Documentation

The detailed project manual lives in [`docs/`](docs/index.md):

- [Architecture](docs/architecture.md) — trust boundaries, data flows, persistence, and one-shot jobs.
- [Development](docs/development.md) — setup, daily commands, host workflows, and LAN access.
- [Configuration](docs/configuration.md) — environment layers, Keycloak lifecycle, passwords, and rotation.
- [Operations](docs/operations.md) — recreation, logs, backup/restore, and safe resets.
- [Troubleshooting](docs/troubleshooting.md) — networking, DataGrip, Keycloak, chain, and startup failures.
- [Production](docs/production.md) — Nginx/Certbot deployment, external RPC, secrets, hardening, and rollback.
- [Smart contracts](docs/smart-contracts.md) — contract roles, Foundry workflows, deployment, and verification.

The README stays intentionally short; operational details belong in the manual so there is one maintained source for each procedure.

## Validation

Run the checks relevant to a change before committing:

```bash
# Fast checks: realm posture, Nginx log redaction, shell syntax. No Docker, no network.
just check

# Effective Compose models
just dev-config
just prod-config /secure/path/prod.env

# Web client
cd client
npm run lint
npm run typecheck
npm test
npm run build

# Backend
cd ../server
./mvnw test

# Proof service
cd ../proof-service
pnpm test
pnpm build

# Contracts
cd ../foundry
forge build
forge test
```

The same checks run in CI as per-component workflows under [`.github/workflows/`](.github/workflows).
More component-specific commands and expected one-shot states are documented under [`docs/`](docs/index.md).

## Security boundaries

- Development credentials and deterministic Anvil keys are not production secrets.
- Changing `.env` does not rotate passwords already stored in PostgreSQL or Keycloak.
- Production public registration, default citizen assignment, direct password grants, and user editing of identity fields are disabled unless deliberately overridden.
- The citizen listener authenticates backend synchronization with a shared HMAC secret, but it is not a bulk reconciliation queue.
- A valid Compose file proves configuration shape, not election security, operational readiness, or correctness of a deployed contract.

Report security-sensitive findings privately rather than attaching resolved Compose output, environment files, tokens, or database dumps to a public issue.
