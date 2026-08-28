# Development

The supported local environment is the shared Compose model plus the development overlay:

```text
compose.yaml + compose.dev.yaml + .env
```

Use `just dev` as the normal entry point. The recipe selects both files explicitly; Docker Compose
does not infer `compose.dev.yaml` from its filename.

## Prerequisites

The complete containerized stack requires:

- Docker Engine with the Compose v2 plugin (`docker compose version`);
- Git;
- [`just`](https://just.systems/) for the short project commands; and
- network access the first time images and locked dependencies are downloaded.

`just` is a language-neutral command runner. It does not compile the application and it is not tied
to C or C++; the recipes delegate orchestration to Docker Compose.

You do not need host installations of Maven, Java, Node.js, Python, or Foundry merely to start the
containerized stack. The image builds compile the Keycloak provider, backend, client, proof service,
and contracts, while a one-shot container generates the first-boot realm file.

Host-native component work additionally needs the relevant toolchain:

- Java 25 and Maven Wrapper support for `server/`;
- Node.js 24 and npm for `client/`;
- Node.js 24 plus Corepack/pnpm 10 for `proof-service/`;
  (the Node major is pinned in `.nvmrc` and in each package's `engines` field, and matches the
  `node:24-alpine` base image the Dockerfiles build from -- `nvm use` in the repository root picks
  it up. Regenerating `client/package-lock.json` on a different major produces a lockfile that
  differs from the one the image build resolves.)
- Foundry (`forge`, `cast`, and `anvil`) for `foundry/`;
- Rust/Cargo for `mopro-semaphore/`; and
- Android Studio/SDK, plus the NDK for native bindings, for `mobile_client/`.

## First start

### 1. Create the development environment

```bash
cp .env.example .env
chmod 600 .env
```

Replace every `<...>` placeholder:

```bash
rg '<[^>]+>' .env
```

The command must return no matches. For machine-generated passwords and shared secrets, generate a
different value for each field:

```bash
openssl rand -hex 32
```

That produces 256 random bits in a dotenv-, URL-, and SQL-friendly representation. Base64 is not
weaker when generated from the same number of random bytes, but reserved characters may need
encoding when a password is embedded in `DATABASE_URL`.

The local chain uses deterministic, publicly known development accounts. Use a funded Anvil key for
`RELAYER_PRIVATE_KEY`; never fund or reuse that key on a public network.

Changing `.env` later does not automatically rotate credentials stored in PostgreSQL or Keycloak.
Read [Credential persistence and rotation](configuration.md#credential-persistence-and-rotation)
before changing an initialized environment.

### 2. Validate and start

```bash
just dev-config
just dev
```

Both recipes run `deploy/check-env.sh .env` first. They stop before Compose if the file is unreadable
or any assignment still contains a `<...>` template placeholder. `dev-down` and `dev-logs` omit this
preflight deliberately so an operator can inspect or stop an existing stack while repairing `.env`.

The first build can take several minutes because it downloads images and builds every local image.
Startup performs these dependency-ordered operations:

1. PostgreSQL starts and initializes the three databases on an empty data directory.
2. `keycloak-realm-generate` creates secret-bearing first-boot JSON in a Docker-managed import
   volume; no generated realm file is written to the repository.
3. The custom Keycloak image builds and installs the `citizen-sync` provider before Keycloak's
   optimized build.
4. Keycloak imports the generated realm only if that realm does not already exist.
5. `keycloak-realm-config` verifies the provider and merges the required listeners into the realm.
6. Anvil starts with persistent development state.
7. `contracts-deploy` verifies or deploys the local verifier and factory, then exits.
8. The backend, proof service, and Vite client start after their dependencies are ready.

Inspect all states, including completed jobs, from another terminal:

```bash
docker compose --env-file .env \
  -f compose.yaml -f compose.dev.yaml ps -a
```

`keycloak-realm-generate`, `keycloak-realm-config`, and `contracts-deploy` should show
`Exited (0)`. That is success for these one-shot jobs, not a crash.

## Development endpoints

Unless `.env` overrides a host port or `PRIVOTE_HTTP_BIND_ADDRESS`, development ports are published
only on host loopback:

| Component | Host endpoint | Notes |
| --- | --- | --- |
| Web client | `http://localhost:5173` | Vite development server |
| Backend | `http://localhost:9090` | Application routes are under `/api` |
| Keycloak | `http://localhost:8080` | Admin console is under `/admin/` |
| Proof service | `http://localhost:4010` | `GET /health` is public |
| Anvil | `http://127.0.0.1:8545` | Development chain ID `31337` by default |
| PostgreSQL | `127.0.0.1:5432` | Three databases with separate owner roles |

The Keycloak bootstrap administrator belongs to the `master` realm and manages Keycloak. The
`DEV_ADMIN_*` account belongs to the Privote realm and signs into the application. They are
different users even if both usernames are `admin`.

## Compose without `just`

The recipes are convenience wrappers around explicit commands:

```bash
# Validate the merged model.
docker compose --env-file .env \
  -f compose.yaml -f compose.dev.yaml config --quiet

# Start in the foreground and build local images.
docker compose --env-file .env \
  -f compose.yaml -f compose.dev.yaml \
  up --build --remove-orphans

# Stop and remove development containers and the project network.
docker compose --env-file .env \
  -f compose.yaml -f compose.dev.yaml \
  down --remove-orphans
```

Compose merges files from left to right. Paths in every merged file are resolved relative to the
first Compose file. A bare `docker compose up` loads `compose.yaml` but not the environment overlay,
so it is not the supported project command.

## Common tasks

### Follow logs

```bash
just dev-logs
```

Or select services:

```bash
docker compose --env-file .env \
  -f compose.yaml -f compose.dev.yaml \
  logs -f keycloak server proof-service
```

### Rebuild one image

```bash
docker compose --env-file .env \
  -f compose.yaml -f compose.dev.yaml \
  up -d --build --force-recreate --no-deps server
```

The Keycloak provider is part of the custom Keycloak image. After changing
`keycloak-synchronizer/`, rebuild and recreate Keycloak, then rerun the configuration job:

```bash
docker compose --env-file .env \
  -f compose.yaml -f compose.dev.yaml \
  up -d --build --force-recreate keycloak

docker compose --env-file .env \
  -f compose.yaml -f compose.dev.yaml \
  run --rm --no-deps keycloak-realm-config
```

After changing Solidity source or its locked dependencies, rebuild and rerun the deployment job:

```bash
docker compose --env-file .env \
  -f compose.yaml -f compose.dev.yaml \
  build contracts-deploy

docker compose --env-file .env \
  -f compose.yaml -f compose.dev.yaml \
  run --rm --no-deps contracts-deploy
```

### Run the backend from an IDE

Keep infrastructure in Compose and make the Keycloak listener call the host backend. Set this before
starting Keycloak:

```dotenv
KEYCLOAK_SYNC_BACKEND_URL=http://host.docker.internal:9090
```

`host.docker.internal` is created automatically only by Docker Desktop. Native Linux `dockerd` does
not define it, so `compose.dev.yaml` maps it explicitly for the Keycloak service:

```yaml
extra_hosts:
  - "host.docker.internal:host-gateway"
```

`host-gateway` resolves on every engine, so the same override works on Linux, macOS and Windows and
no per-platform value is needed. If the name still does not resolve, the host firewall is the usual
cause: the Docker bridge has to be able to reach port `9090` on the host, and Spring has to be
listening on all interfaces rather than only on `127.0.0.1`.

Confirm the path end to end before relying on it -- a broken listener call is silent, because the
synchroniser logs the failure inside the Keycloak container and the profile update still succeeds:

```bash
docker compose --env-file .env -f compose.yaml -f compose.dev.yaml \
  exec keycloak sh -c 'getent hosts host.docker.internal'
```

Then edit a user in the Keycloak console and watch for the sync attempt:

```bash
docker compose --env-file .env -f compose.yaml -f compose.dev.yaml \
  logs --follow keycloak | grep Keycloak-Sync
```

A successful run logs
`[Keycloak-Sync] Sending sync for user <id> to http://host.docker.internal:9090/api/internal/sync from <trigger>`
followed by no error line.

Then start the infrastructure and run Spring on the host:

```bash
docker compose --env-file .env \
  -f compose.yaml -f compose.dev.yaml \
  up -d postgres keycloak keycloak-realm-config anvil contracts-deploy proof-service

cd server
set -a
. ../.env
set +a
./mvnw spring-boot:run
```

Root `.env` contains host-facing `APP_DB_URL` and `KC_JWK_SET_URI`; Compose replaces them with
service-network URLs for the containerized backend. A local, ignored `server/.env` symlink may be
convenient on one checkout, but the documented command exports the canonical root file and does not
depend on that untracked symlink.

### Run the web client on the host

```bash
cd client
npm ci --legacy-peer-deps
npm run dev
```

Vite proxies `/api` to `VITE_API_PROXY_TARGET` (normally `http://localhost:9090`). Keycloak and proof
service URLs execute in the browser and therefore cannot use Compose-only DNS names.

### Run the proof service on the host

Copy the checked-in component template, then install and start:

```bash
cp proof-service/.env.example proof-service/.env
chmod 600 proof-service/.env

cd proof-service
corepack enable
pnpm install --frozen-lockfile
pnpm dev
```

## Test matrix

### Checks that need no Docker, network, or toolchain

These run in about a second and cover the parts of the system where a mistake fails silently rather
than loudly. Run them before every commit:

```bash
just check
```

That is three recipes, each usable on its own:

- `just test-realm` generates the realm in both production and development modes and asserts its
  security posture, plus the cross-language citizen attribute alignment. A rename in the backend's
  `KeycloakUserAttributes`, the synchronizer's `CitizenAttributes`, or the generator's own
  declarations fails here rather than at runtime, where a mismatch merely produces citizens with
  missing fields;
- `just test-nginx` renders both Nginx templates the way the image renders them, checks that each
  configuration parses, and fails if any `log_format` can emit a query string;
- `just test-shell` syntax-checks every deployment script.

They need `python3`, `nginx`, `envsubst` and `openssl` on the host -- no Docker and no network.

### Per-component checks

Run the relevant checks for each changed component:

```bash
# Spring backend (includes BaselineMigrationTest, which needs a reachable Docker daemon;
# without one those tests are skipped rather than failed)
cd server && ./mvnw test

# Keycloak provider
mvn -f keycloak-synchronizer/pom.xml test

# Web client
cd client && npm run lint && npm run typecheck && npm test && npm run build

# Proof service
cd proof-service && corepack enable && pnpm test && pnpm build

# Contracts
cd foundry && forge fmt --check && forge build --sizes && forge test

# Rust proof bridge
cd mopro-semaphore && cargo test

# Android unit tests
cd mobile_client && ./gradlew test
```

CI runs the same commands as per-component workflows in `.github/workflows/`, each triggered by the
paths it covers, so a component's workflow is the authoritative list of what must pass for it. The
backend workflow runs `./mvnw verify` rather than `./mvnw test`.

These checks do not replace an end-to-end login, synchronization, election, proof, and vote smoke
test. See [Troubleshooting](troubleshooting.md) when a dependency job blocks startup.

## Resetting development state

`just dev-down` removes containers and the project network, but it preserves the development bind
mounts. A complete reset destroys database roles and data, Keycloak users and realm state, proof
indexes, and the local chain history. Do not use a destructive reset merely to apply a password or
realm change.

The durable development sources are `server/data/postgres/`, `server/data/keycloak/`, and
`foundry/anvil-state.json`. PostgreSQL mounts the parent `/var/lib/postgresql` directory and sets
`PGDATA` to preserve the existing PostgreSQL 18 layout; do not replace that target with the older
`/var/lib/postgresql/data` convention without migrating the cluster.

Back up first and follow the scoped procedure in [Operations](operations.md#development-resets).
