# Privote

Privote is a privacy-preserving electronic voting platform that combines verified identity, anonymous participation, encrypted ballots, and blockchain-backed auditability.

The project is designed to solve a hard problem in digital elections: how to verify that only eligible voters participate, prevent double voting, and keep an auditable record of the process without exposing the voter's choice or linking the ballot back to the voter.

## Core Idea

The platform separates identity verification from ballot secrecy:

- Keycloak authenticates users and enforces access control.
- A Keycloak SPI plugin synchronizes citizen accounts into the backend on user events.
- The client derives election-specific anonymous voter identities.
- Registered identity commitments are enrolled on-chain.
- The proof service rebuilds Merkle state and serves membership proofs.
- Votes are submitted as encrypted ballots together with a zero-knowledge proof.
- Smart contracts reject reused nullifiers, preventing double voting.
- The backend stores receipts and synchronizes local state with on-chain events.
- A threshold key ceremony (guardians) underpins the eventual decentralized tally.

## Why It Is Different

- Verified identity without exposing the vote itself.
- Anonymous, election-specific participation instead of reusable voting identities.
- Encrypted ballots whose plaintext choice is not published during voting.
- Zero-knowledge proof flow bound to the encrypted ballot payload.
- Nullifier-based one-person-one-vote enforcement.
- Tamper-evident lifecycle events anchored on-chain.
- Native mobile proof generation through a Rust/UniFFI bridge (no server-side proving).

## End-to-End Flow

1. An administrator creates an election from the web client.
2. The client generates an election encryption keypair locally in the browser.
3. Only the election public key is sent to the backend and then to the election contract.
4. The election is deployed on-chain through the factory contract.
5. A voter authenticates with Keycloak (web or mobile).
6. The client derives an election-specific anonymous identity and registers its commitment.
7. The backend enrolls that commitment on-chain into the election group.
8. The proof service indexes group membership and serves Merkle proofs.
9. During voting, the client encrypts the ballot, generates a proof, and submits both.
10. The contract verifies the proof and rejects duplicate nullifiers.
11. The backend records the receipt, transaction hash, and ciphertext hash.
12. When voting ends, the election moves to the tally / key-ceremony phase.

## Architecture

```text
+------------------+      +--------------------+      +----------------------+
| React Client     | ---> | Keycloak           | <--- | Keycloak Synchronizer|
| - login          |      | - auth             |      | (SPI event listener) |
| - key generation |      | - roles            |      | - pushes citizens    |
| - proof creation |      +--------------------+      |   into backend       |
| - vote casting   |                                  +----------------------+
+--------+---------+
         |
         |        +--------------------+
         |        | Android Client     |
         |        | - login            |
         |        | - identity vault   |
         |        | - vote casting     |
         |        +---------+----------+
         |                  |
         |                  v
         |        +--------------------+
         |        | Mopro Semaphore    |
         |        | (Rust + UniFFI)    |
         |        | - witness          |
         |        | - Groth16 prover   |
         |        +--------------------+
         v
+------------------+      +--------------------+
| Spring Boot API  | ---> | PostgreSQL         |
| - election rules |      | - elections        |
| - registrations  |      | - commitments      |
| - vote receipts  |      | - ballots          |
| - chain sync     |      | - guardians /      |
| - key ceremony   |      |   key ceremony     |
+--------+---------+      +--------------------+
         |
         v
+------------------+      +--------------------+
| Smart Contracts  | <--> | Proof Service      |
| (Foundry)        |      | - Merkle rebuild   |
| - ElectionFactory|      | - root checks      |
| - Election       |      | - proof endpoint   |
| - Groth16Verifier|      +--------------------+
+------------------+
```

## Repository Layout

- `client/`: React + TypeScript + Vite frontend, Keycloak integration, local identity vault, browser-side election key management, proof generation, and voting UI.
- `mobile_client/`: Android (Java + ViewBinding) client, with its own identity vault, Keycloak-backed auth, and on-device proof generation through the Mopro bridge.
- `mopro-semaphore/`: Rust crate that wraps Semaphore-20 witness building and Groth16 proving/verification, and produces Android (UniFFI) bindings consumed by `mobile_client/`.
- `server/`: Spring Boot backend, election lifecycle management, voter registration, vote submission, Keycloak-backed authorization, persistence, chain event reconciliation, and the guardian key-ceremony model.
- `keycloak-synchronizer/`: Keycloak SPI plugin (event listener) that mirrors citizen accounts from Keycloak into the backend.
- `foundry/`: Solidity contracts (`Election`, `ElectionFactory`, `Groth16Verifier`), Foundry tests, deployment script, and the Circom sources for the ZK circuits.
- `proof-service/`: Fastify service that indexes on-chain group membership, rebuilds Merkle state, validates root consistency, and serves Merkle proofs to clients.

## Key Technologies

- Frontend (web): React, TypeScript, Vite, TanStack Query
- Frontend (mobile): Android (Java), ViewBinding, Argon2id-backed local identity vault
- Native proving (mobile): Rust, `circom-prover` (Arkworks Groth16), `rust-witness`, UniFFI / Mopro
- Identity and access control: Keycloak (+ custom event-listener SPI)
- Backend: Java 21, Spring Boot, Spring Security, Spring Data JPA
- Database: PostgreSQL
- Blockchain integration: Solidity, Foundry (`forge`, `cast`, `anvil`), Web3j, viem/Ethers
- Privacy layer: Semaphore v4, Groth16 verifier, zero-knowledge proof workflow
- Proof indexing service: Fastify, viem, Postgres

## What Is Already Implemented

- Keycloak-based authentication and role-aware access control, on both web and Android clients
- Citizen synchronization from Keycloak into the backend via a custom SPI event listener
- Election creation with browser-generated election encryption keys
- On-chain election deployment through a factory contract
- Election lifecycle actions: deploy, start, end (with lifecycle guards and a structured exception hierarchy)
- Parties and candidate management for elections
- Election-specific voter commitment registration
- On-chain voter enrollment into the election group
- Proof-service indexing of group membership and Merkle proof serving
- Encrypted ballot submission from the web client
- Native Groth16 proof generation on Android through the Mopro / UniFFI bridge, validated against the web client's reference vectors
- Zero-knowledge proof submission and contract-side verification path
- Nullifier-based duplicate vote prevention
- Backend event listeners for chain-to-database reconciliation
- Persistent data model for an ElectionGuard-style threshold key ceremony (guardians, key shares, partial key backups, challenges, verifications, partial decryptions)
- Test coverage across backend services, Foundry contract tests, the Rust proving crate, and the proof service

## Current Project Status

This repository already demonstrates the core security architecture and the main voting workflow:

- secure authentication (web and mobile)
- anonymous voter registration
- encrypted vote casting (with browser-side or on-device proof generation)
- blockchain-backed verification
- duplicate-vote prevention

Active work: the threshold key ceremony service (decentralized tally with guardians, see `server/ELECTIONGUARD_PARITY_AUDIT.md` and `server/WHY_KEY_CEREMONY_IS_COMPLEX.md`), the result publication UX, and a one-command demo bootstrap.

## Local Demo Setup

The project is split into several services/workspaces. A typical local demo needs:

- a local EVM node on `http://127.0.0.1:8545` (Anvil)
- PostgreSQL + Keycloak via the `server/docker-compose.yaml` stack
- the Spring Boot backend on `http://localhost:9090`
- the proof-service on `http://127.0.0.1:4010`
- the web client on `http://localhost:5173`
- optionally, the Android client built from `mobile_client/`

### 1. Smart Contracts (Foundry)

From `foundry/`:

```bash
# one-time: install Solidity deps (see foundry/README.md for the exact recipe)
forge install foundry-rs/forge-std@v1.16.1 --no-commit
# ...plus the npm-packed Semaphore / zk-kit / poseidon-solidity deps

forge build
forge test
```

Run a local chain and deploy in one step:

```bash
./script/anvil-dev.sh
```

This boots Anvil with persistent state and runs `script/Deploy.s.sol`, which deploys `Groth16Verifier` and `ElectionFactory`. Record the printed `ElectionFactory` address and use it in the backend configuration.

### 2. Infrastructure (Postgres + Keycloak)

From `server/`, a development `docker-compose.yaml` bundles Postgres and Keycloak (and bootstraps databases for the backend, Keycloak, and the proof service):

```bash
docker compose up -d postgres keycloak
```

The required environment variables (`POSTGRES_SUPERPASS`, `APP_DB_*`, `KEYCLOAK_DB_*`, `PROOF_DB_*`, ...) are listed at the top of the compose file.

### 3. Keycloak Synchronizer (optional but recommended)

From `keycloak-synchronizer/`:

```bash
mvn package
# Drop the resulting JAR into the Keycloak providers directory and restart Keycloak.
```

This installs the SPI event listener that pushes citizen create/update events into the backend.

### 4. Backend

From `server/`:

```bash
./mvnw spring-boot:run
```

The backend expects environment variables for:

- database connection
- Keycloak admin integration
- chain RPC URL
- relayer private key
- election factory address
- sync secret (shared with the Keycloak synchronizer)

See `server/src/main/resources/application.yaml` (and the `dev` / `prod` profiles) for the exact properties.

### 5. Proof Service

From `proof-service/`:

```bash
pnpm install
pnpm dev
```

The proof service requires:

- `RPC_URL`
- `DATABASE_URL`
- optional seeded election addresses or factory address

### 6. Web Frontend

From `client/`:

```bash
npm install
npm run dev
```

The client can be configured with:

- `VITE_API_BASE_URL`
- `VITE_KEYCLOAK_URL`
- `VITE_KEYCLOAK_REALM`
- `VITE_KEYCLOAK_CLIENT`
- `VITE_PROOF_SERVICE_BASE_URL`

### 7. Mobile Client (optional)

First, build the Rust → Android bindings from `mopro-semaphore/` (requires the Android NDK; see `mopro-semaphore/README.md` for the exact recipe). The generated `MoproAndroidBindings/` are consumed by the Android module.

Then open `mobile_client/` in Android Studio (or use Gradle from the command line) and run the `app` module on an emulator or device. The client points at the same backend, Keycloak realm, and proof service as the web client.

## Example Workflow

One representative end-to-end flow is:

1. Login as admin
2. Create a party, then an election bound to that party set
3. Deploy the election on-chain
4. Add candidates
5. Start the election
6. Login as voter (web or mobile)
7. Register the anonymous voting commitment
8. Show the commitment status, Merkle leaf index, and transaction hash
9. Cast an encrypted ballot (proof generated in the browser, or natively on Android via Mopro)
10. Show the ciphertext hash, nullifier, transaction hash, and block number
11. Attempt a duplicate vote and show that it is rejected

## Testing

Web frontend:

```bash
cd client
npm test
```

Backend:

```bash
cd server
./mvnw test
```

Smart contracts (Foundry):

```bash
cd foundry
forge test            # all tests
forge test -vvv       # with stack traces
forge test --gas-report
```

Mobile proving crate (Rust):

```bash
cd mopro-semaphore
cargo test
```

The Rust test suite re-uses the web client's `cross-stack-vectors.json` fixtures to assert that native Android proofs match the TypeScript reference implementation bit-for-bit.

Proof service:

```bash
cd proof-service
pnpm test
pnpm build
```

## Security Notes

- Authentication is separated from vote casting.
- Voter identities are derived per election, reducing cross-election linkability.
- The local identity vault is scoped per authenticated user and uses Argon2id key derivation.
- Ballots are encrypted before submission.
- The proof is bound to the encrypted ballot via a signal hash, so the ciphertext can't be tampered with or replayed, while the plaintext choice is never an input to the proof.
- Nullifiers prevent duplicate voting without revealing voter identity.
- The backend stores verifiable receipts such as transaction hashes and ciphertext hashes.
- Mobile proofs are generated on-device, so the user's identity secret never leaves the phone.

## Next Steps

- Wire the persisted guardian / key-ceremony model into a working 3-of-5 threshold decryption flow so any 3 coordinators can combine their private key shares to decrypt the election private key and reveal the tally
- Strengthen the existing tally and result publication dashboard into a production-grade workflow
- Add a portable environment template and one-command demo bootstrap for all services
