# Configuration

Privote configuration spans Compose, Spring Boot, Keycloak, Vite, the proof service, and generated
realm data. The important distinction is whether a value is read on every process start or stored
once in a database.

## Configuration layers

From lowest to highest precedence in the containerized workflow:

1. `compose.yaml` defines shared service topology and relationships.
2. `compose.dev.yaml` or `compose.prod.yaml` changes environment-specific behavior.
3. `.env` (development) or `/etc/privote/prod.env` (production default) supplies Compose
   interpolation values.
4. Each service's `environment:` block becomes its process environment.
5. Framework-specific environment variables override file defaults.

For Spring Boot, `application.yaml` is shared, then `application-dev.yaml` or
`application-prod.yaml` is activated with `SPRING_PROFILES_ACTIVE`. Compose also supplies internal
container URLs. For Keycloak, `server/docker/keycloak/keycloak.conf` supplies shared options while
`KC_*` environment variables and the selected startup command provide environment-specific values.

The checked-in `keycloak.conf` is intentionally small. It enables health and metrics because both
environments need them. It does not try to copy every commented option from
`/opt/keycloak/conf/keycloak.conf`; that file is a reference template, not a list of mandatory
settings. Development selects `start-dev`, a localhost hostname, and relaxed hostname checking in
`compose.dev.yaml`. Production selects `start --optimized`, a fixed HTTPS hostname, and trusted
reverse-proxy settings in `compose.prod.yaml`. Keeping environment-specific values in the overlays
prevents a development hostname or proxy assumption leaking into production.

`compose.dev.yaml` and `compose.prod.yaml` are never discovered by their names. The `justfile` or
explicit `-f compose.yaml -f compose.<environment>.yaml` arguments select them. Always inspect the
effective model before deployment:

```bash
just dev-config
just prod-config
```

## Environment files are not container `env_file` directives

Compose reads the selected `--env-file` while parsing `${VARIABLE}` expressions. A service-level
`env_file:` directive would inject values into a container, but it does not provide interpolation
values to the Compose parser. Privote's commands therefore pass the environment file explicitly.

Development setup:

```bash
cp .env.example .env
chmod 600 .env
```

The repository ignores `.env`, generated realm imports, database data, and private chain state.
Never force-add them.

Production setup starts from `.env.prod.example`, but the real file lives outside the checkout:

```bash
sudo install -d -o "$(id -un)" -g "$(id -gn)" -m 700 /etc/privote
sudo install -o "$(id -un)" -g "$(id -gn)" -m 600 \
  .env.prod.example /etc/privote/prod.env
"${EDITOR:-vi}" /etc/privote/prod.env
```

The account running the deployment must own and read the file. Keep mode `600`; do not weaken
permissions merely to make an incorrectly owned file readable.

`deploy/check-env.sh` is the shared recipe preflight. It rejects unreadable files and unresolved
`<...>` values. In production mode it also rejects any group or other permission bits; mode `600`
is the recommended writable setting. Development start/config recipes and production
start/config/certificate recipes run this check automatically. Stop and log recipes intentionally
remain available without it so a broken environment can still be diagnosed or shut down.

## Variable reference

The checked-in `.env.example` and `.env.prod.example` are the development and production templates.
The tables below explain lifecycle and consumers rather than duplicating every comment from them.

### Project, profile, and image selection

| Variable | Purpose | Lifecycle |
| --- | --- | --- |
| `SPRING_PROFILES_ACTIVE` | Selects `application-dev.yaml` or `application-prod.yaml`; required by the merged model | Backend startup; the overlays also set it per environment |
| `POSTGRES_IMAGE` | Pinned PostgreSQL image; must stay on major version 18 | Read when Compose creates the container |
| `FOUNDRY_IMAGE` | Foundry image used by development `anvil`/`contracts-deploy` and production `chain-preflight` | Read when Compose creates those containers |
| `KEYCLOAK_IMAGE`, `SERVER_IMAGE`, `CLIENT_IMAGE`, `CLIENT_DEV_IMAGE`, `PROOF_SERVICE_IMAGE`, `CONTRACTS_IMAGE` | Override the locally built image tags; default to `privote-*:local` | Image resolution only |

`COMPOSE_PROJECT_NAME` and `RESTART_POLICY` apply to every service and are described under
[production host, proxy, and certificates](#production-host-proxy-and-certificates); development sets
them to `privote-dev` and `no`.

### PostgreSQL

| Variable | Purpose | Lifecycle |
| --- | --- | --- |
| `POSTGRES_SUPERUSER` | Cluster owner used by initialization and administration | Created on the first empty-cluster start |
| `POSTGRES_SUPERPASS` | Cluster-owner password | Stored in PostgreSQL after initialization |
| `APP_DB_NAME`, `APP_DB_USER`, `APP_DB_PASSWORD` | Spring database and owner role | Database/role created only by first-boot init |
| `KEYCLOAK_DB_NAME`, `KEYCLOAK_DB_USER`, `KEYCLOAK_DB_PASSWORD` | Keycloak database and owner role | Database/role created only by first-boot init |
| `PROOF_DB_NAME`, `PROOF_DB_USER`, `PROOF_DB_PASSWORD` | Proof-index database and owner role | Database/role created only by first-boot init |
| `APP_DB_URL` | JDBC URL for a backend started on the host | Read at backend startup; Compose overrides it internally |
| `POSTGRES_HOST_PORT` | Optional development host port when `5432` is occupied | Read when Compose creates the container |

The image is pinned to PostgreSQL major version 18. Development bind-mounts
`./server/data/postgres` at `/var/lib/postgresql` and uses the existing PostgreSQL 18 `PGDATA`
layout. Production mounts a named volume at `/var/lib/postgresql` and sets `PGDATA` to the official
`/var/lib/postgresql/18/docker` path inside it. The initialization scripts in
`server/docker/postgres/init/` run only when the selected cluster is empty. Changing a database
name, user, or password in an environment file does not re-run those scripts. Never change the
image to a new PostgreSQL major version or change the mount layout without a dump/restore or
supported `pg_upgrade` plan.

### Keycloak, OIDC, and citizen sync

| Variable | Purpose | Lifecycle |
| --- | --- | --- |
| `KC_BOOTSTRAP_ADMIN_USERNAME`, `KC_BOOTSTRAP_ADMIN_PASSWORD` | Initial `master` realm administrator; also used by the realm-configuration job | Bootstrap creation only; the job reads them on each run |
| `KC_REALM` | Target Privote realm | Runtime selection |
| `KC_ISSUER_URI` | Exact issuer expected in access tokens | Read by the backend; must equal Keycloak's public issuer |
| `KC_JWK_SET_URI` | Host-native backend URL for downloading signing keys | Read by backend; Compose replaces it with the internal Keycloak URL |
| `KC_CLIENT_ID` | Client whose roles the backend expects | Runtime backend setting |
| `KEYCLOAK_PUBLIC_URL` | Development Keycloak hostname used to construct public URLs | Keycloak startup; normally localhost |
| `PRIVOTE_BACKEND_CLIENT_SECRET` | Secret embedded in a newly generated backend-client realm import | Generation/import only |
| `PRIVOTE_ADMIN_CLIENT_ID` | Service-account client used by backend administrative operations | Backend runtime setting |
| `PRIVOTE_ADMIN_CLIENT_SECRET` | Backend service-account client secret | Generated/imported once and read by the backend on every start |
| `DEV_ADMIN_USERNAME`, `DEV_ADMIN_PASSWORD`, `DEV_ADMIN_EMAIL` | Development user placed in a generated realm import | Generation/import only |
| `SYNC_SECRET` | HMAC key shared by the Keycloak provider and backend | Read by both processes on every start |
| `SYNC_MAX_SKEW_SECONDS`, `SYNC_REPLAY_WINDOW_SECONDS` | Timestamp and replay limits for signed sync events | Backend runtime policy |
| `CORS_ALLOWED_ORIGINS` | Exact browser origins allowed by the backend | Backend runtime policy |
| `KEYCLOAK_SYNC_BACKEND_URL` | Optional listener destination for a backend running on the host | Read by Keycloak on start |
| `KEYCLOAK_BACKEND_CLIENT_URL` | Exact backend client URL written into a fresh realm | Generation/import only |
| `KEYCLOAK_FRONTEND_URL` | Exact web redirect origin written into a fresh realm | Generation/import only |
| `KEYCLOAK_MOBILE_REDIRECT_URI` | Mobile OIDC callback written into a fresh realm | Generation/import only |
| `KEYCLOAK_CREATE_DEV_ADMIN` | Controls creation of the seed application user | Generation/import only; false in production |
| `KEYCLOAK_FRONTEND_DIRECT_ACCESS_GRANTS` | Controls password/direct grants for the public web client | Generation/import only; false in production |
| `KEYCLOAK_REGISTRATION_ALLOWED` | Controls public self-registration in the realm | Generation/import only; false in production |
| `KEYCLOAK_VERIFY_EMAIL` | Requires email verification before a session is usable | Generation/import only; true in production |
| `KEYCLOAK_ALLOW_USER_IDENTITY_EDIT` | Controls whether a user may edit their own identity attributes (`cin`, `birthDate`, `birthPlace`) | Generation/import only; false in production |
| `KEYCLOAK_DEFAULT_CITIZEN_ROLE` | Controls whether the realm's default roles include `CITIZEN`, granting it on registration | Generation/import only; false in production |

The last four are the realm's security posture. The development overlay turns all of them the
permissive way and production turns them the strict way, so a value left at a development default is
a deliberate production weakening. `just test-realm` asserts the locked-down posture in production
mode and the opt-in conveniences in development mode, so a default that drifts fails the check
rather than the election.

`KC_BOOTSTRAP_ADMIN_*` does not describe the application login. The bootstrap administrator belongs
to Keycloak's `master` realm. The generated `DEV_ADMIN_*` account belongs to `privote`.

### Chain and contract deployment

| Variable | Purpose | Lifecycle |
| --- | --- | --- |
| `RELAYER_PRIVATE_KEY` | Backend transaction signer/coordinator | Read by Spring on startup; must be funded and authorized for the selected chain |
| `CHAIN_ID` | Expected EVM chain identifier | Backend, Anvil in development, and deployment records |
| `COMPOSE_CHAIN_RPC_URL` | RPC URL from inside the Compose network | `http://anvil:8545` in development; external HTTP(S) endpoint in production |
| `RPC_URL` | Host-facing RPC used by host-native Foundry/proof tooling | Development convenience |
| `ELECTION_FACTORY_ADDRESS` | Factory expected by backend, proof service, and deployment verification | Read on startup by all chain consumers |
| `ANVIL_DEPLOYER_PRIVATE_KEY` | Optional local deployment signer override | Development deployment job only |
| `FACTORY_START_BLOCK` | First block scanned for factory events | Proof-service persisted cursor starts here |
| `CONFIRMATIONS` | Blocks held back before indexing | Proof-service runtime policy |
| `WEB3J_LISTENER_ENABLED` | Enables backend chain-event polling | Backend runtime policy |
| `WEB3J_POLL_INTERVAL_MS` | Backend event-poll interval | Backend runtime tuning |
| `LOG_BATCH_SIZE` | Maximum range per log query | Proof-service runtime tuning |
| `PROOF_ELECTION_ADDRESSES` | Optional comma-separated seed election contracts | Proof-service bootstrap input |
| `ANVIL_STATE_INTERVAL_SECONDS` | How often Anvil flushes state to `foundry/anvil-state.json`; default 60 | Development chain only |
| `RPC_READY_TIMEOUT_SECONDS`, `RPC_READY_INTERVAL_SECONDS` | Bounded readiness wait used by `contracts-deploy` before it broadcasts | Development deployment job only |

The configured chain ID, RPC, factory address, and start block are a cross-service invariant.
Changing one without deliberately updating the others can split the backend and proof service onto
different histories. Production supplies an external RPC and a separately deployed factory; it
does not include Anvil or the automatic deployment job.

### Web client

| Variable | Purpose | Context |
| --- | --- | --- |
| `VITE_KEYCLOAK_URL` | Browser-facing Keycloak base URL | Must resolve from the user's browser |
| `VITE_KEYCLOAK_REALM` | Browser OIDC realm | Normally matches `KC_REALM` |
| `VITE_KEYCLOAK_CLIENT` | Public OIDC client ID | Must exist in the realm |
| `VITE_PROOF_SERVICE_BASE_URL` | Browser-facing proof-service URL | Must resolve from the user's browser |
| `VITE_API_PROXY_TARGET` | Vite server's upstream for `/api` | Container/host process context, not browser context |

Vite exposes `VITE_*` values to browser code. They are configuration, never secrets. In a production
static build, those values are usually compiled into the assets; changing a container environment
variable after the build does not necessarily rewrite the bundle.

### Docker host behavior

| Variable | Purpose |
| --- | --- |
| `PRIVOTE_HTTP_BIND_ADDRESS` | Host address used for deliberately published development HTTP ports; default `127.0.0.1` |

Container processes such as Vite and Anvil listen on `0.0.0.0` inside their network namespace so
other containers and Docker's forwarding path can reach them. Host publication is a separate value.

### Production host, proxy, and certificates

| Variable | Purpose |
| --- | --- |
| `COMPOSE_PROJECT_NAME` | Namespaces production containers, networks, and named volumes; use `privote-prod` |
| `RESTART_POLICY` | Restart policy for long-running services; production uses `unless-stopped` |
| `APP_DOMAIN` | Public web/API/proof hostname and Let's Encrypt certificate name |
| `AUTH_DOMAIN` | Public Keycloak hostname included as a certificate SAN |
| `ACME_EMAIL` | Let's Encrypt registration and expiry-notice address |
| `BACKEND_SUBNET` | Private Compose subnet and Keycloak's trusted reverse-proxy range |
| `CERTBOT_RENEW_INTERVAL_SECONDS` | Delay between renewal checks; default 43,200 seconds |
| `NGINX_IMAGE`, `CERTBOT_IMAGE` | Pinned production edge image versions |

Only Nginx publishes production host ports. The certificate is stored in the `letsencrypt` named
volume, not in the checkout or environment file. `APP_DOMAIN`, `AUTH_DOMAIN`, Keycloak's public
hostname/issuer, the generated realm URLs, CORS origins, and the client build arguments must change
together.

## URL selection: host, container, or public

Use the URL from the consumer's point of view:

| Consumer | Backend | Keycloak | Chain | Proof service |
| --- | --- | --- | --- | --- |
| Browser on Docker host | `/api` through Vite | `http://localhost:8080` | Normally none | `http://localhost:4010` |
| Process on Docker host | `http://localhost:9090` | `http://localhost:8080` | `http://127.0.0.1:8545` | `http://127.0.0.1:4010` |
| Compose service | `http://server:9090` | `http://keycloak:8080` | `http://anvil:8545` | `http://proof-service:4010` |
| Production client | Deployment public URL | Deployment HTTPS issuer | Not normally direct | Deployment public/proxied URL |

Issuer matching is exact. If Keycloak stamps
`https://auth.example.test/realms/privote`, the backend cannot validate tokens as if they came from
`http://keycloak:8080/realms/privote`. The backend may fetch JWKS over an internal URL, but
`KC_ISSUER_URI` must remain the browser-facing issuer in the token.

## Database schema lifecycle

Flyway owns the application schema in every environment. Hibernate never creates or alters it:
`spring.jpa.hibernate.ddl-auto` is `validate` everywhere, so its only role is to refuse to start when
the migrated schema and the entity classes disagree.

The migrations live in `server/src/main/resources/db/migration`. There is currently one:

| File | Contents |
|---|---|
| `V1__baseline_schema.sql` | The whole schema as of the first versioned release |

The baseline was not transcribed by hand. It was produced by letting Hibernate create the schema
from the entities on a real PostgreSQL 18, dumping the result, and reorganising it for readability,
so its types and nullability match what `validate` expects by construction. Foreign keys were then
given deliberate names, because Hibernate's generated ones (`fk1j6jest94j6t117m8b99d3933`) are
useless in an incident.

### Settings that differ by environment

| Setting | Development | Production | Why |
|---|---|---|---|
| `spring.flyway.baseline-on-migrate` | `true` | `false` | Developer databases predate migrations and have no history table; baselining adopts them at V1. In production an unexplained existing schema must stop the deployment, not be adopted |
| `spring.flyway.clean-disabled` | `true` | `true` | `flyway clean` drops every object in the schema. There is no situation in this project where that should be reachable from application configuration |
| `spring.jpa.hibernate.ddl-auto` | `validate` | `validate` | Identical on purpose: a schema change that works in development because Hibernate silently altered a table is exactly the change that fails in production |

Tests are the exception: the unit suite runs on H2 with `create-drop` and `spring.flyway.enabled=false`,
because the baseline is PostgreSQL-specific (`bytea`, `numeric(78,0)`, identity columns). It is
exercised against a real PostgreSQL 18 by `BaselineMigrationTest` instead.

### Adding a migration

1. Change the entity.
2. Add `V<n>__<description>.sql` alongside the baseline. Never edit a released file: Flyway records
   a checksum per migration, and altering an applied one makes every deployed database fail
   validation on the next start.
3. Run `cd server && ./mvnw test`. `BaselineMigrationTest` migrates a throwaway PostgreSQL 18 and
   lets Hibernate validate the result, so a migration that does not match the entities fails there
   with the offending table and column named.

Two things that are easy to get wrong:

- **Enum columns carry CHECK constraints.** Adding a constant to `ElectionPhase`, `CandidateStatus`,
  `GuardianStatus`, `ParticipationStatus`, `CommitmentStatus` or `SystemLogOutcome` requires a
  migration that widens the matching constraint. Hibernate's `validate` does not inspect check
  constraints, so a missing widening does not fail at startup -- it fails on the first INSERT that
  uses the new value.
- **Forward-fix only.** There are no down migrations. A bad migration is corrected by a new version,
  not by editing or reverting the old one. A change that cannot be corrected forward -- a dropped
  column, a narrowed type -- is only recoverable from backup, so treat destructive migrations as a
  separate, rehearsed release rather than part of a routine deployment. Prefer the expand/contract
  shape: add the new shape, migrate the data and the code, and drop the old shape in a later release
  once nothing reads it.

### Iterating before the migration is written

Development uses `validate` like production, so adding an entity field without a migration stops the
application. To explore a schema change first, override for a single run:

```bash
cd server
SPRING_JPA_HIBERNATE_DDL_AUTO=update ./mvnw spring-boot:run
```

Write the migration before committing, and reset the development database
(see [Operations: development resets](operations.md#development-resets)) so the next start exercises
the migration rather than Hibernate's guess.

## Keycloak realm lifecycle

`server/docker/keycloak/generate-realm.py` generates a complete first-boot realm definition.
Compose runs it as `keycloak-realm-generate` and writes the output into the private
`keycloak_realm_import` Docker volume. The JSON contains client secrets and, in development, a seed
password; it is never a tracked repository artifact.

The job reads the selected environment file. The development overlay enables a seed user and direct
access grants and supplies localhost redirect origins. The production overlay disables both and
supplies exact HTTPS origins.

Keycloak's `--import-realm` imports the generated file only when `KC_REALM` does not already exist.
It intentionally skips an existing realm to preserve users and runtime state. The generator may run
again on every Compose start; that does not make its output a continuous realm reconciler.

The `keycloak-realm-config` job addresses one specific piece of drift: it authenticates headlessly
against `master`, reads the current event-listener configuration, ensures `citizen-sync` and
`jboss-logging` are present without deleting unrelated listeners, writes only when necessary, and
exits. It does not reconcile clients, redirect URIs, roles, user-profile declarations, client
secrets, or development users.

Consequences:

- changing `generate-realm.py` does not update a persisted realm;
- regenerating the JSON does not update a persisted realm;
- changing a generated client secret in `.env` does not rotate Keycloak's stored secret; and
- enabling `citizen-sync` does not replay existing users.

Apply changes to existing realms through versioned Admin REST/`kcadm` migrations or an explicit,
reviewed import procedure. Do not delete the Keycloak database just to apply routine configuration
changes.

## Credential persistence and rotation

### Password generation

Both commands can generate strong material:

```bash
openssl rand -hex 32
openssl rand -base64 32
```

Each uses 32 random bytes (256 bits). Hex is longer on screen but easier to pass unchanged through
dotenv, shells, SQL, JDBC, and URLs. If a raw password is inserted into a URI such as
`postgres://user:password@host/database`, reserved characters must be percent-encoded in the URI
only; the stored database role password remains the original raw value.

### What an environment edit changes

| Credential | Is changing the environment file enough? | Required action |
| --- | --- | --- |
| PostgreSQL role password | No | Change the stored role password and recreate consumers with the matching environment |
| Keycloak bootstrap-admin password | No after first bootstrap | Change the `master` realm user's credential, then update the job environment |
| Keycloak client secret | No after realm import | Rotate the client's stored secret, then update its consumer |
| Development realm user password | No after realm import | Reset that realm user's credential |
| `SYNC_SECRET` | Yes, if both processes change together | Update the secret source and recreate both Keycloak and backend |
| Relayer/deployer private key | It changes the signer, not an existing credential | Fund/authorize the new address before switching |

### PostgreSQL role rotation

Back up first. Open an administrative `psql` session without putting the new password in the command
line:

```bash
docker compose --env-file .env \
  -f compose.yaml -f compose.dev.yaml \
  exec postgres sh -lc 'psql -U "$POSTGRES_USER" -d "$POSTGRES_DB"'
```

Then use psql's interactive password command for the exact role:

```text
\password <role-name>
```

Update the matching environment value and recreate the consumers. For example, after rotating the
application role:

```bash
docker compose --env-file .env \
  -f compose.yaml -f compose.dev.yaml up -d --force-recreate server
```

Rotate the Keycloak and proof roles the same way, recreating `keycloak`/`keycloak-realm-config` or
`proof-service` respectively. Changing a database name or owner is a data migration, not a password
rotation.

### Keycloak credential rotation

Use Keycloak's Admin REST API or `kcadm.sh`; no GUI is required. Treat rotations as two coordinated
changes: update the credential stored in the realm, then update the external secret consumed by the
client/job. Verify a new session before invalidating your recovery path.

Do not use the generated realm file as a password-rotation mechanism for a persisted realm. It will
be skipped during startup.

## DataGrip and other host database clients

With the development overlay and default port:

| Database | Host | Port | User |
| --- | --- | --- | --- |
| Application | `127.0.0.1` | `5432` | `APP_DB_USER` |
| Keycloak | `127.0.0.1` | `5432` | `KEYCLOAK_DB_USER` |
| Proof index | `127.0.0.1` | `5432` | `PROOF_DB_USER` |

Use the matching raw password. Do not use the service name `postgres` from a host application; that
name exists only on the Compose network. If `POSTGRES_HOST_PORT` changes, use that host port instead.

Authentication failures after editing `.env` usually mean the database role still has its old
stored password. Connection failures usually mean the container is unhealthy, the host port differs,
or PostgreSQL is not published by the selected overlay. See [Troubleshooting](troubleshooting.md).
