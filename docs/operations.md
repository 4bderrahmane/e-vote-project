# Operations

This runbook covers the current single-host Docker Compose workflow. Use the development file set
for local work and the production file set only after completing the requirements in
[Production](production.md).

## Command families

Development commands always select:

```bash
docker compose --env-file .env -f compose.yaml -f compose.dev.yaml ...
```

Production commands default to:

```bash
docker compose --env-file /etc/privote/prod.env \
  -f compose.yaml -f compose.prod.yaml ...
```

Do not use a bare `docker compose ...` command and assume an environment overlay will be inferred.
The `justfile` wraps the common forms.

Start, validation, deployment, and certificate recipes run `deploy/check-env.sh` before Compose.
The preflight rejects unreadable files, unresolved `<...>` placeholders, and—in production—group or
other permission bits. `prod-down` and `prod-logs` deliberately skip the preflight so they remain
usable while repairing a bad secret file; they still need enough configuration for Compose to
identify the intended project.

The one-time TLS bootstrap is:

```bash
just prod-cert-init /etc/privote/prod.env
```

## Start, stop, and recreate development

Start and stream logs:

```bash
just dev
```

Stop and remove containers and the Compose network:

```bash
just dev-down
```

Recreate everything explicitly:

```bash
docker compose --env-file .env \
  -f compose.yaml -f compose.dev.yaml \
  down --remove-orphans

docker compose --env-file .env \
  -f compose.yaml -f compose.dev.yaml \
  up --build --force-recreate --remove-orphans
```

After `down`, `--force-recreate` is redundant because the containers no longer exist; it is shown to
make the intent explicit. `--build` rebuilds locally built images. Neither flag controls network
exposure—the merged `ports:` entries do.

Do not add `-v` casually. It removes Compose-managed named volumes, including production database,
Keycloak, certificate, and other state owned by that Compose project. Development bind mounts are
not removed by `down -v`, which makes a mixed-storage reset especially easy to misunderstand.

Recreate one service without its dependencies:

```bash
docker compose --env-file .env \
  -f compose.yaml -f compose.dev.yaml \
  up -d --build --force-recreate --no-deps server
```

Use `--no-deps` only when the dependency state is already healthy.

## Inspect status and logs

Include stopped one-shot jobs:

```bash
docker compose --env-file .env \
  -f compose.yaml -f compose.dev.yaml ps -a
```

Expected special states:

- `keycloak-realm-generate`: `Exited (0)` after writing first-boot realm input;
- `keycloak-realm-config`: `Exited (0)` after ensuring realm listeners;
- `contracts-deploy`: `Exited (0)` after verifying or deploying the factory.

Follow all logs with `just dev-logs`, or select services:

```bash
docker compose --env-file .env \
  -f compose.yaml -f compose.dev.yaml \
  logs --tail=200 -f keycloak keycloak-realm-config server proof-service
```

Inspect the resolved configuration rather than guessing what an override did:

```bash
just dev-config
```

For values that must stay secret, prefer targeted inspection over saving the complete resolved
Compose output to a file.

## What request logs may contain

Request logs are a privacy control here, not just an operational convenience. Two query strings in
this system are sensitive, and the defaults of every component involved would have recorded both:

- `GET /proof/elections/<address>/proof?commitment=<semaphore commitment>` -- logged next to the
  client address, this ties a voter's network identity to their anonymous Semaphore credential.
  That is the single association the protocol exists to prevent, and no amount of later analysis
  can undo it once written.
- Keycloak's OIDC endpoints carry `code`, `state`, `session_state` and `login_hint`. An
  authorization code is short-lived, but a log file usually is not.

The configured behaviour:

| Component | Setting | Effect |
|---|---|---|
| Nginx edge | `log_format privote_redacted` in `deploy/nginx/*.conf.template` | Logs `$request_method $uri`, never `$request`/`$args`; the referer has its query stripped by a `map` |
| Client Nginx | same format in `client/nginx.conf` | Same, for the container behind the edge |
| Proof service | `redactedRequestSerializer` in `proof-service/src/app/logging.ts` | Fastify logs method, path and matched route; the query never reaches the serializer's output |
| Keycloak | `http-access-log-enabled=false` in `server/docker/keycloak/keycloak.conf` | No HTTP access log at all |

Two consequences worth knowing before changing any of them:

- Nginx's `$uri` is the path *after* internal rewrites, so proof-service requests appear under the
  stripped path (`/elections/<address>/proof`) rather than the public `/proof/...` prefix.
- Turning Keycloak's access log on requires a pattern using `%U` (path) rather than `%r` (request
  line), or it reintroduces the OIDC leak the flag exists to prevent.

Both controls are enforced by tests rather than by review:

```bash
just test-nginx
cd proof-service && pnpm test
```

`just test-nginx` fails if any `log_format` references `$request`, `$request_uri`, `$query_string`,
`$args` or `$http_referer`. The proof-service suite asserts on the bytes the logger actually writes
for a successful proof request, a rejected one, and an OIDC-shaped query.

### Retention

Container logs use the `json-file` driver capped at `10m` per file with `3` files kept, declared as
`x-logging` in both `compose.yaml` and `compose.prod.yaml` (Compose does not carry YAML anchors
across files, so the production overlay repeats it). That bounds disk use at roughly 30 MB per
service and gives a rolling window rather than an indefinite archive.

The cap covers every service in the shared and production models. The two development-only services
declared in `compose.dev.yaml`, `anvil` and `contracts-deploy`, do not set `logging:` and therefore
use the Docker daemon's default; on a long-lived development machine `anvil` is the one to watch.

Anything that ships these logs elsewhere -- a log collector, a support bundle, an
`docker compose logs > file.txt` redirect -- leaves that window and becomes a new copy with its own
retention. Treat such a copy as containing personal data: it holds client addresses, usernames and
Keycloak event details even with the query strings removed.

### A residual worth recording

Redaction stops the commitment reaching *our* logs. It stays in the request URL itself, so it is
still visible to anything that terminates or observes TLS between the browser and the edge. Moving
the commitment into a POST body would remove that exposure as well; it is deliberately not done
here, because it changes the proof API and belongs with the threat-model work rather than with a
logging fix.

## Verify host port bindings

`docker compose ps` shows the published host addresses. For an exact inspection, resolve the
container through the Compose service instead of depending on a fixed container name:

```bash
keycloak_container=$(docker compose --env-file .env \
  -f compose.yaml -f compose.dev.yaml ps -q keycloak)

docker inspect \
  --format '{{json .HostConfig.PortBindings}}' \
  "$keycloak_container"
```

A loopback-only mapping contains a host IP such as `127.0.0.1`. An empty host IP or `0.0.0.0` means
all host interfaces.

Do not test LAN exposure with `curl http://0.0.0.0:8080`. On Linux, a local client connection to
`0.0.0.0` may route through loopback. Test the machine's actual LAN address from another device:

```bash
curl -v http://<server-lan-address>:8080
```

That request should fail when the port is published only on `127.0.0.1`. A process listening on
`0.0.0.0` inside a container is normal; host publication is the security boundary being checked.

## Health checks

Basic development probes:

```bash
curl --fail http://127.0.0.1:4010/health
curl --fail http://127.0.0.1:8080/realms/privote/.well-known/openid-configuration
curl --fail -X POST http://127.0.0.1:8545 \
  -H 'content-type: application/json' \
  --data '{"jsonrpc":"2.0","method":"eth_chainId","params":[],"id":1}'
```

Compose health checks are readiness gates, not complete end-to-end tests. Follow them with an OIDC
login, authenticated API request, citizen-sync event, and chain/proof smoke test.

## One-shot setup jobs

### Keycloak realm generation

`keycloak-realm-generate` runs automatically before Keycloak. It writes a fresh JSON document to a
Docker import volume, exits, and is safe to run again. Keycloak imports it only when the target realm
does not already exist, so rerunning the generator is not a way to migrate or rotate a persisted
realm.

### Keycloak realm configuration

With Keycloak healthy, run the headless job again:

```bash
docker compose --env-file .env \
  -f compose.yaml -f compose.dev.yaml \
  run --rm --no-deps keycloak-realm-config
```

The job authenticates against the `master` realm and targets the configured Privote realm. It
preserves unrelated event listeners while ensuring `jboss-logging` and `citizen-sync` are present.
Failure here is commonly an incorrect persisted bootstrap-admin credential, a missing target realm,
or an unavailable Keycloak service.

The listener executes inside `keycloak`. Confirm provider events there:

```bash
docker compose --env-file .env \
  -f compose.yaml -f compose.dev.yaml logs keycloak | rg 'Keycloak-Sync|citizen-sync'
```

This event path has no durable retry queue. Re-saving a user profile retriggers a supported update
event after the backend is available.

### Local contract deployment

With Anvil healthy, run the job again:

```bash
docker compose --env-file .env \
  -f compose.yaml -f compose.dev.yaml \
  run --rm --no-deps contracts-deploy
```

The job first checks the configured address for an `ElectionFactory`-specific `verifier()` call. It
skips a valid existing factory and deploys only when the configured address has no code. It fails
instead of accepting unrelated bytecode or silently using an unexpected address.

Verify manually from the Foundry container:

```bash
docker compose --env-file .env \
  -f compose.yaml -f compose.dev.yaml \
  run --rm --no-deps contracts-deploy \
  sh -lc 'cast call "$ELECTION_FACTORY_ADDRESS" "verifier()(address)" \
    --rpc-url http://anvil:8545'
```

See [Smart contracts](smart-contracts.md) before changing chain state or the factory address.

## Production certificate operations

The first certificate and later renewals are different operations:

```bash
# Once, after both DNS names resolve and port 80 is reachable.
just prod-cert-init /etc/privote/prod.env

# Safe manual renewal check plus immediate Nginx reload.
just prod-cert-renew /etc/privote/prod.env
```

The normal production stack runs `certbot-renew` continuously and periodically reloads Nginx. Check
both logs and inspect the certificate dates from outside the server:

```bash
docker compose --env-file /etc/privote/prod.env \
  -f compose.yaml -f compose.prod.yaml \
  logs --tail=200 certbot-renew nginx

openssl s_client -connect vote.example.com:443 \
  -servername vote.example.com </dev/null 2>/dev/null \
  | openssl x509 -noout -subject -issuer -dates
```

Replace the example domain. Keep TCP port `80` reachable for HTTP-01 renewal even though normal
application requests redirect to HTTPS. A successful Nginx reload does not prove renewal occurred;
monitor certificate expiry independently.

## Backup and restore

### What must be backed up

For a useful development snapshot:

- the `privote`, `keycloak`, and `proofdb` databases;
- PostgreSQL global roles, if restoring into a fresh cluster;
- `foundry/anvil-state.json`, if database records must continue to match the local chain; and
- the external secret source and any user-held election vault files, stored separately and securely.

The generated Keycloak realm JSON is configuration input, not a complete backup. It omits evolving
runtime state and startup import skips existing realms. The Keycloak PostgreSQL database is the
authoritative runtime store.

### PostgreSQL logical backup

Create a private destination outside the repository for production. This development example writes
three custom-format archives plus global roles:

```bash
backup_dir="backups/$(date -u +%Y%m%dT%H%M%SZ)"
mkdir -p "$backup_dir"
chmod 700 "$backup_dir"

docker compose --env-file .env \
  -f compose.yaml -f compose.dev.yaml \
  exec -T postgres sh -lc \
  'pg_dump -U "$POSTGRES_USER" -Fc "$APP_DB_NAME"' \
  > "$backup_dir/privote.dump"

docker compose --env-file .env \
  -f compose.yaml -f compose.dev.yaml \
  exec -T postgres sh -lc \
  'pg_dump -U "$POSTGRES_USER" -Fc "$KEYCLOAK_DB_NAME"' \
  > "$backup_dir/keycloak.dump"

docker compose --env-file .env \
  -f compose.yaml -f compose.dev.yaml \
  exec -T postgres sh -lc \
  'pg_dump -U "$POSTGRES_USER" -Fc "$PROOF_DB_NAME"' \
  > "$backup_dir/proofdb.dump"

docker compose --env-file .env \
  -f compose.yaml -f compose.dev.yaml \
  exec -T postgres sh -lc \
  'pg_dumpall -U "$POSTGRES_USER" --globals-only' \
  > "$backup_dir/globals.sql"
```

Check that every command succeeded and every archive is non-empty. Test restoration periodically;
an untested backup is only a hypothesis.

Each `pg_dump` is internally consistent, but separate database dumps are not one atomic snapshot
across all three databases and the chain. For production recovery objectives, add volume snapshots
or PostgreSQL physical backups/WAL archiving and a documented point-in-time recovery procedure.

### Local-chain snapshot

Stop chain writers before copying the bind-mounted state:

```bash
docker compose --env-file .env \
  -f compose.yaml -f compose.dev.yaml stop server proof-service anvil

cp --preserve=mode,timestamps foundry/anvil-state.json \
  "$backup_dir/anvil-state.json"
```

Restart with `just dev` after the snapshot. Anvil is not a production blockchain strategy.

### Restore warning and outline

Restoration overwrites state. Confirm the exact target, stop Keycloak/backend/proof service, and keep
PostgreSQL running. Provision the expected roles/databases first, then restore each archive with the
matching owner. For example, restoring the application database into a deliberately prepared target:

```bash
docker compose --env-file .env \
  -f compose.yaml -f compose.dev.yaml \
  exec -T postgres sh -lc \
  'pg_restore -U "$POSTGRES_USER" --clean --if-exists --no-owner \
     --role="$APP_DB_USER" -d "$APP_DB_NAME"' \
  < "$backup_dir/privote.dump"
```

Repeat with the Keycloak and proof database variables. `--clean` deletes objects in the destination;
do not run it against an unverified database. Restore `globals.sql` only when rebuilding a cluster
and after reviewing the roles it will create/change.

After restore:

1. restore the matching Anvil state when this is a development-chain snapshot;
2. start Keycloak and run `keycloak-realm-config`;
3. start the backend and proof service;
4. verify the factory code, Keycloak issuer, user login, proof root, and an authenticated API call.

## Schema migrations at deployment

The backend migrates its own schema on startup: Flyway runs before Hibernate builds the entity
manager, and the application refuses to start if the result does not match the entities. There is no
separate migration step to run by hand.

What a normal deployment logs:

```
Migrating schema "public" to version "1 - baseline schema"
Successfully applied 1 migration to schema "public"
Started PrivoteApplication in 7.751 seconds
```

Check what a database is currently at:

```bash
docker compose --env-file /etc/privote/prod.env \
  -f compose.yaml -f compose.prod.yaml \
  exec -T postgres sh -lc \
  'psql -U "$APP_DB_USER" -d "$APP_DB_NAME" -c \
     "SELECT version, description, type, success, installed_on
        FROM flyway_schema_history ORDER BY installed_rank;"'
```

Three failure modes worth recognising:

| Symptom | Cause | Action |
|---|---|---|
| `Found non-empty schema(s) "public" but no schema history table` | A database whose schema was created outside Flyway | Do not set `baseline-on-migrate` in production to make this go away. Establish where the schema came from first |
| `Validate failed: Migration checksum mismatch` | A released migration file was edited | Restore the file. A correction is a new version, never an edit |
| `Schema validation: missing column [x] in table [y]` | Flyway succeeded but the migration does not match the entities | The deployed image and the migration disagree; roll back to the previous image and fix forward |

A failed migration leaves the application refusing to start, which is the intended outcome: it stops
a mismatched build from serving requests. Because there are no down migrations, rolling back an
application version does **not** roll back the schema -- see
[Configuration: adding a migration](configuration.md#adding-a-migration) for why changes should be
expand/contract shaped, and restore from backup for anything destructive.

## Development resets

A full reset destroys database users, application data, Keycloak users/realm state, proof indexes,
and local-chain history. Development data is bind-mounted, so `down` alone intentionally preserves
it. Prefer a recoverable move of each configured bind source over immediate deletion:

```bash
just dev-down

reset_tag=$(date -u +%Y%m%dT%H%M%SZ)
mv server/data/postgres "server/data/postgres.before-$reset_tag"
mv server/data/keycloak "server/data/keycloak.before-$reset_tag"
mv foundry/anvil-state.json "foundry/anvil-state.before-$reset_tag.json"
```

Then run `just dev`; the realm-generation job runs automatically. Remove the saved copies only after
the replacement environment has passed an end-to-end test.

Resetting only `proofdb` is normally recoverable from chain logs; resetting the chain while keeping
the application database is not, because stored contract addresses and transaction receipts point
to the old history.

## Updating a single-server deployment

Before a production update:

1. back up and test that the backup is readable;
2. validate the merged model with `just prod-config`;
3. build and test immutable images in CI;
4. record the currently deployed image digests and rollback command;
5. deploy with `just deploy-prod`;
6. check the setup jobs (`keycloak-realm-generate`, `keycloak-realm-config`, `chain-preflight`,
   `certificate-check`), health, authentication, external contract connectivity, and proof roots;
   and
7. roll back if the documented trigger is met.

Do not use `latest` as the only rollback reference. Production procedures and current blockers are
listed in [Production](production.md).
