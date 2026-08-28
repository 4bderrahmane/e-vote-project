# Privote documentation

This directory is the canonical operator and contributor documentation for Privote. The root
`README.md` is an overview; use these documents when you need to run, configure, troubleshoot, or
prepare the system for deployment.

Privote is currently a development-ready, multi-service application. The development Compose
stack is the supported end-to-end environment. The production overlay targets one Linux server
behind Nginx with Certbot-managed certificates, but a valid configuration is not proof of
production readiness. The application schema is migrated by Flyway on startup (see
[Configuration](configuration.md#database-schema-lifecycle)), but DNS/certificate bootstrap,
external contract deployment and review, secret rotation, monitoring, and tested disaster recovery
remain deployment work. See [Production](production.md) before exposing anything to the Internet.

## Start here

| Goal | Document |
| --- | --- |
| Understand the components and data flows | [Architecture](architecture.md) |
| Start the project locally | [Development](development.md) |
| Understand environment variables and persisted credentials | [Configuration](configuration.md) |
| Recreate services, inspect health, back up, or restore | [Operations](operations.md) |
| Diagnose common startup, networking, Keycloak, or chain failures | [Troubleshooting](troubleshooting.md) |
| Prepare a single-server production deployment | [Production](production.md) |
| Build, test, deploy, and reason about the contracts | [Smart contracts](smart-contracts.md) |

## Runtime at a glance

The development stack combines:

- a React/Vite web client;
- a Spring Boot API;
- Keycloak with the custom `citizen-sync` event-listener provider;
- one PostgreSQL instance containing isolated application, Keycloak, and proof-service databases;
- an Anvil development chain;
- a one-shot contract deployment job; and
- a Fastify proof/indexing service.

Three one-shot jobs may appear in `docker compose ps -a`:

- `keycloak-realm-generate` creates secret-bearing first-boot realm JSON in a Docker volume and
  exits. Keycloak skips the import if the realm already exists.
- `keycloak-realm-config` calls Keycloak's Admin API, makes sure `citizen-sync` is enabled for the
  realm, and exits. The listener itself runs inside `keycloak`.
- `contracts-deploy` verifies or deploys `Groth16Verifier` and `ElectionFactory` on Anvil, then
  exits. The contracts themselves live on the chain, not inside that stopped container.

Successful exit status (`0`) is the healthy state for all three jobs. See
[Architecture: one-shot jobs](architecture.md#why-setup-services-exit) for the dependency flow.

## Environment selection

Privote deliberately selects both a shared Compose file and one environment overlay:

```text
compose.yaml + compose.dev.yaml   -> local development
compose.yaml + compose.prod.yaml  -> production deployment template
```

The `justfile` provides the intended entry points:

```bash
just dev
just dev-down
just dev-config

just prod-config /etc/privote/prod.env
just prod-cert-init /etc/privote/prod.env
just deploy-prod /etc/privote/prod.env
just prod-down /etc/privote/prod.env
```

The development recipes read `.env`; production recipes default to
`/etc/privote/prod.env`. A different production path is passed as a positional recipe argument. The
equivalent explicit Compose commands are documented in
[Development](development.md#compose-without-just) and
[Production](production.md#deployment-command-interface).

## Scope of these documents

The canonical set describes the runtime that exists now. Guardian/key-ceremony work belongs to a
future, more decentralized version and is deliberately excluded from current operational claims.

## Documentation conventions

- Commands are run from the repository root unless a preceding `cd` says otherwise.
- Examples use placeholders such as `<public-host>` and never contain real credentials.
- `localhost` always means the machine on which the command or browser runs. Inside Compose,
  services reach each other through names such as `postgres`, `keycloak`, `anvil`, and `server`.
- Configuration files and running databases have different lifecycles. A changed password in an
  environment file does not automatically rotate a credential already stored by PostgreSQL or
  Keycloak. See [Credential persistence](configuration.md#credential-persistence-and-rotation).
