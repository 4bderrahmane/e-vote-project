# Troubleshooting

Diagnose from the dependency that failed first. A backend error may be caused by a failed contract
job; a missing citizen may be a Keycloak provider error; a proof mismatch may be stale chain state.

Start with:

```bash
just dev-config

docker compose --env-file .env \
  -f compose.yaml -f compose.dev.yaml ps -a

docker compose --env-file .env \
  -f compose.yaml -f compose.dev.yaml logs --tail=200
```

Do not paste complete resolved configuration or unreviewed logs into a public issue. They can contain
URLs, account data, tokens, client secrets, or database credentials.

## Compose does not see a service or override

Symptom:

```text
no such service: ...
```

Cause: `compose.dev.yaml` and `compose.prod.yaml` are not automatically selected. Confirm the merged
service list:

```bash
docker compose --env-file .env \
  -f compose.yaml -f compose.dev.yaml config --services
```

Use `just dev`/`just dev-config`, or always pass both `-f` flags. A bare `docker compose up` only uses
Compose's conventional default filenames and is not the project interface.

## Missing or invalid environment values

Check for template placeholders:

```bash
rg '<[^>]+>' .env
```

Replace every result. Validate without starting containers:

```bash
just dev-config
```

The Just recipe runs `deploy/check-env.sh`, which reports the name of any assignment that still has a
`<...>` value. Production recipes also require owner-only file permissions; repair them with
`chmod 600 /etc/privote/prod.env`. `prod-logs` and `prod-down` remain available without the preflight
for recovery work.

If `. ./.env` fails with a shell parsing error, a placeholder was left in place or a value contains
unquoted shell syntax. URL-safe hexadecimal secrets avoid the common cases. Do not "fix" a secret by
silently changing only `.env` after a database/realm already exists; see
[credential persistence](configuration.md#credential-persistence-and-rotation).

## A container still appears exposed on `0.0.0.0`

First distinguish the process bind from the host publication:

- `0.0.0.0:8080` inside a container means the process accepts traffic arriving through its container
  interfaces.
- `127.0.0.1:8080:8080` in Docker's host port mapping means only host loopback is published.

Inspect the actual container selected by the development project:

```bash
service_container=$(docker compose --env-file .env \
  -f compose.yaml -f compose.dev.yaml ps -q keycloak)

docker inspect \
  --format '{{json .HostConfig.PortBindings}}' \
  "$service_container"
```

If the host IP is still empty/`0.0.0.0`, verify the merged `ports:` value and make sure you recreated
the same Compose project you are inspecting. List all projects/containers to find an older stack:

```bash
docker compose ls
docker ps --format 'table {{.Names}}\t{{.Ports}}\t{{.Labels}}'
```

Then use `just dev-down` followed by `just dev`. `--build` alone does not change a running
container's port mapping.

`curl http://0.0.0.0:8080` from the Docker host is not an exposure test: Linux may route that local
destination through loopback. Test the host's real LAN address from another machine.

## PostgreSQL connection failures

### Connection refused or timeout

Check health and the host port:

```bash
docker compose --env-file .env \
  -f compose.yaml -f compose.dev.yaml ps postgres

docker compose --env-file .env \
  -f compose.yaml -f compose.dev.yaml port postgres 5432
```

From DataGrip or another host process use `127.0.0.1` plus `POSTGRES_HOST_PORT`; do not use the
Compose-only hostname `postgres`.

### Password authentication failed

Use the role that owns the selected database:

| Database | Expected role |
| --- | --- |
| `APP_DB_NAME` | `APP_DB_USER` |
| `KEYCLOAK_DB_NAME` | `KEYCLOAK_DB_USER` |
| `PROOF_DB_NAME` | `PROOF_DB_USER` |

If the connection worked before `.env` changed, PostgreSQL probably still stores the old password.
The first-boot init script does not run again for a non-empty `server/data/postgres/`. Either use the
old password or rotate the stored role deliberately.

The proof service embeds `PROOF_DB_PASSWORD` in a PostgreSQL URL. Use URL-safe raw values such as
hex, or percent-encode reserved characters in the URL representation while keeping the database
role's actual password unchanged.

### Initialization failed

Read the first PostgreSQL logs, not only the latest restart:

```bash
docker compose --env-file .env \
  -f compose.yaml -f compose.dev.yaml logs postgres
```

The init script creates all roles/databases only for an empty data directory. An interrupted partial
initialization can leave an unusable local cluster. Preserve/backup the directory, then use the
recoverable reset procedure in [Operations](operations.md#development-resets). Hex passwords also
avoid quoting problems in the current SQL bootstrap script.

## Keycloak failures

### Provider JAR is missing

The provider is compiled and copied into the custom Keycloak image; it is not a required host
artifact. Rebuild the image and inspect the build failure instead of creating an untracked JAR by
hand:

```bash
docker compose --env-file .env \
  -f compose.yaml -f compose.dev.yaml \
  build --no-cache keycloak
```

Then recreate Keycloak and rerun `keycloak-realm-config`. If the configuration job reports that
`citizen-sync` is not registered, inspect both the image build and Keycloak startup logs.

### The `privote` realm is missing

Read the generator job first:

```bash
docker compose --env-file .env \
  -f compose.yaml -f compose.dev.yaml \
  logs keycloak-realm-generate
```

The job writes into a Docker volume, not `server/docker/keycloak/import/`. Check missing secrets,
invalid booleans, and volume permissions. If generation succeeded, inspect Keycloak's import logs.
When Keycloak already has persisted state, startup import deliberately does not replace an existing
realm; follow [the realm lifecycle](configuration.md#keycloak-realm-lifecycle).

### `keycloak-realm-config` returns 401

The job logs in to the `master` realm with `KC_BOOTSTRAP_ADMIN_*` and targets `KC_REALM`. A common
mistake is assuming that changing `KC_BOOTSTRAP_ADMIN_PASSWORD` rotates an existing master user. It
does not.

Verify the credential stored in the master realm, update it through Keycloak Admin REST/`kcadm` if
necessary, and keep the external secret in sync. The application realm's development `admin` user is
not the master administrator.

### Login redirects to `localhost`

Keycloak constructs public URLs from its hostname configuration. In development, the Compose
overlay defaults `KC_HOSTNAME` to `http://localhost:8080`, so a request with another Host header can
receive a redirect to localhost. This is expected for host-only development but wrong for LAN
devices or production.

Change the complete set together: Keycloak public hostname, backend issuer, browser Keycloak URL,
realm redirect URIs/web origins, and mobile endpoint configuration. Token issuers are exact strings.

### `citizen-sync` is enabled but no citizen appears

Check in order:

1. `keycloak-realm-config` exited `0`.
2. Keycloak loaded the provider; inspect logs for `citizen-sync`/`Keycloak-Sync`.
3. The event is a supported registration/profile/email-verification or admin create/update event.
4. The user has required `email`, `firstName`, `lastName`, and `cin` values.
5. `BACKEND_SERVICE_URL` is reachable from the Keycloak container.
6. Keycloak and backend use the same non-empty `SYNC_SECRET`.
7. Host clocks are synchronized; stale timestamps are rejected.
8. Backend logs do not show signature, replay, validation, or database failures.

The listener does not replay existing users when enabled. Re-save an affected user's profile after
the backend is healthy. Delivery failures are not currently persisted for retry.

## Contract deployment failures

### Foundry import or library errors

The contract image installs its locked dependencies during the image build. Rebuild it and inspect
the relevant dependency stage:

```bash
docker compose --env-file .env \
  -f compose.yaml -f compose.dev.yaml \
  build --no-cache contracts-deploy
```

Only host-native `forge` commands need a populated `foundry/lib/`; install those dependencies using
the pinned instructions in [the Foundry README](../foundry/README.md#install-dependencies).

### Configured factory is absent, wrong, or at a different address

Read the complete job log:

```bash
docker compose --env-file .env \
  -f compose.yaml -f compose.dev.yaml logs contracts-deploy
```

Persistent Anvil state changes account nonces and deployment addresses. The job accepts an existing
configured address only when an `ElectionFactory`-specific `verifier()` call succeeds. It fails on
unrelated bytecode and when a new deployment does not match `ELECTION_FACTORY_ADDRESS`.

Do not repeatedly redeploy until an address happens to match. Decide whether the existing chain is
authoritative or whether this is a disposable development reset, then align
`ELECTION_FACTORY_ADDRESS`, backend, proof service, and databases deliberately.

### `chain-preflight` fails and production will not start

`chain-preflight` is production-only and read-only: it verifies the configured chain and factory
before `server` and `proof-service` are allowed to start. Read its log first, because the message
names the specific check that failed:

```bash
docker compose --env-file /etc/privote/prod.env \
  -f compose.yaml -f compose.prod.yaml logs chain-preflight
```

| Message | Meaning |
| --- | --- |
| `CHAIN_ID must be a positive integer` / `must be a 20-byte address` (exit `2`) | The environment file is malformed, not the chain |
| `expected chain <n>, RPC returned <m>` | `COMPOSE_CHAIN_RPC_URL` points at a different network than `CHAIN_ID` |
| `no bytecode at ElectionFactory <address>` | The address is wrong for this chain, or the deployment never landed |
| `factory returned an invalid`/`the zero verifier address` | The address holds a contract that is not an `ElectionFactory` |
| `no bytecode at verifier <address>` | The factory references a verifier that does not exist on this chain |

Fix the recorded deployment data rather than the check. A `cast` failure with no `[chain-preflight]`
prefix is RPC reachability or authentication, not a contract problem. See
[Smart contracts](smart-contracts.md#production-preflight-verification).

### Backend transactions fail

Verify chain ID, RPC reachability, factory identity, relayer address balance, and coordinator
expectations. The deployer and backend relayer can be configured separately; a valid private key is
not necessarily funded or authorized on the selected chain.

## Backend failures

### JWT issuer errors or every authenticated API call returns 401

Compare the token's `iss` claim with `KC_ISSUER_URI`; they must be byte-for-byte equivalent. The
backend may fetch signing keys through internal `KC_JWK_SET_URI=http://keycloak:8080/...` while still
validating a public/localhost issuer. Do not change the issuer to a Compose service name merely to
make container DNS work.

### Keycloak admin calls return 401/403

`PRIVOTE_ADMIN_CLIENT_SECRET` must match the persisted `privote-admin` client, and its service
account needs the intended `realm-management` roles. Editing/regenerating the first-boot realm file
does not change an existing client.

### Production profile reports missing tables

Flyway migrates the schema before Hibernate builds the entity manager, so a fresh production
database is bootstrapped at startup rather than left empty. A startup failure naming a missing
table or column therefore means the deployed image and the migrations disagree -- not that the
schema is unmanaged:

1. Confirm Flyway ran. The startup log contains `Migrating schema "public" to version ...`, and
   `flyway_schema_history` exists in the application database.
2. Compare the deployed image with the migration that introduced the entity. The three recognised
   failure modes and their actions are tabulated in
   [Operations: schema migrations at deployment](operations.md#schema-migrations-at-deployment).

Do not weaken production to `ddl-auto=update` to get past this; the refusal to start is the control
working. Fix forward with a new migration -- see
[Configuration: adding a migration](configuration.md#adding-a-migration).

## Proof-service failures

The HTTP statuses are diagnostic:

- `404 Unknown election`: discovery has not found the contract, the address is wrong, or the factory
  start block/history is wrong.
- `404 Commitment not found`: the membership event was not indexed for that election.
- `409 root mismatch`: local Merkle state and current on-chain root disagree.
- `503 RPC unavailable`: the chain read failed.

Check `RPC_URL`, `FACTORY_ADDRESS`, `FACTORY_START_BLOCK`, confirmation window, and proof-service
database cursor. Do not delete `proofdb` until you have confirmed the chain retains all required
logs. A rebuild cannot recover events pruned or omitted before the configured start block.

Run the live validator when you have a known election/commitment:

```bash
cd proof-service
PROOF_BASE_URL=http://127.0.0.1:4010 \
VALIDATE_ELECTION_ADDRESS=0x... \
VALIDATE_COMMITMENT=123... \
pnpm validate:live
```

## Web or mobile client failures

Vite reads environment configuration when its process starts. Restart/rebuild after changing a
`VITE_*` value. Browser-facing URLs must be resolvable by the browser; Docker names are invalid
there.

For a physical Android device, host loopback points to the phone. Use `adb reverse` for USB
development or deliberately publish services on the host's LAN address and update every issuer,
redirect, origin, and mobile endpoint consistently. Do not expose PostgreSQL or Anvil merely to make
the mobile client work.

## Production TLS failures

### `certificate-check` blocks Nginx

This is intentional when the Let's Encrypt volume has no certificate named after `APP_DOMAIN`.
Confirm both public DNS records and inbound port `80`, then run the explicit bootstrap:

```bash
just prod-cert-init /etc/privote/prod.env
```

Inspect `nginx-bootstrap` and `certbot-init` logs if issuance fails. Do not start the normal Nginx
service with a made-up path or remove `certificate-check`; that converts a clear bootstrap failure
into an HTTP-only or crash-looping deployment.

### Certificate renewal fails

Check the renewal loop and ACME challenge routing:

```bash
docker compose --env-file /etc/privote/prod.env \
  -f compose.yaml -f compose.prod.yaml \
  logs --tail=200 certbot-renew nginx
```

Port `80` must continue to serve `/.well-known/acme-challenge/`. Verify DNS has not moved, the
certificate volume is writable by Certbot, the webroot is shared, and Let's Encrypt is reachable.
Fix renewal before expiry; Nginx's periodic reload cannot renew a certificate by itself.

## One route returns `502` while the rest of the site works

This is the intended shape of a single-service outage, not an edge fault. Nginx resolves upstreams
per request, so it keeps serving every other route while one backend is unreachable. Map the route
to its service and inspect that service, not Nginx:

| Failing route | Service to inspect |
| --- | --- |
| `https://APP_DOMAIN/api/*` | `server` |
| `https://APP_DOMAIN/proof/*` | `proof-service` |
| `https://APP_DOMAIN/` | `client` |
| `https://AUTH_DOMAIN/*` | `keycloak` |

```bash
docker compose --env-file /etc/privote/prod.env \
  -f compose.yaml -f compose.prod.yaml ps
docker compose --env-file /etc/privote/prod.env \
  -f compose.yaml -f compose.prod.yaml logs --tail=200 server
```

A container that is running but failing its healthcheck still receives proxied requests. Check
health state before assuming the route itself is misconfigured. If *every* route returns `502` at
once, look instead at the shared dependencies: `postgres`, the external RPC, or the Compose network.

## Requests to the server's IP address are refused

Port `80` closes the connection and port `443` rejects the TLS handshake for any name that is not
`APP_DOMAIN` or `AUTH_DOMAIN`. This is deliberate, so the production certificate is never presented
for a hostname it does not cover. Test with the real names rather than the address:

```bash
curl --fail --show-error --resolve "vote.example.com:443:203.0.113.10" https://vote.example.com/
```

## `Exited (0)` looks like a crash

For `keycloak-realm-generate`, `keycloak-realm-config`, development `contracts-deploy`, and
production `chain-preflight` and `certificate-check`, exit status `0` is success. They are setup jobs whose contract is "perform one
operation, then terminate." A non-zero exit blocks dependent services and must be diagnosed from
that job's logs.

For long-running services (`postgres`, `keycloak`, `anvil`, `server`, `proof-service`, `client`), an
exit normally is a failure or an intentional stop.

## Safe diagnostic bundle

When asking for help, collect structure and status first:

```bash
docker version
docker compose version
git rev-parse --short HEAD

docker compose --env-file .env \
  -f compose.yaml -f compose.dev.yaml config --quiet

docker compose --env-file .env \
  -f compose.yaml -f compose.dev.yaml ps -a

docker compose --env-file .env \
  -f compose.yaml -f compose.dev.yaml logs --tail=200 <failing-service>
```

Redact secrets, authorization headers, personal data, private keys, database URLs with passwords,
and full tokens before sharing output.
