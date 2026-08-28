# Smart contracts

The `foundry/` workspace contains the EVM trust boundary for election creation, anonymous
membership, proof verification, and duplicate-vote prevention. It is built with Solidity `0.8.28`
and Foundry.

## Contracts

| Contract | Responsibility |
| --- | --- |
| `Groth16Verifier` | Verifies the Semaphore-20 Groth16 proof against the generated verification key |
| `ElectionFactory` | Creates one `Election` per UUID and emits discoverable deployment metadata |
| `Election` | Owns one Semaphore group, lifecycle state, encryption public key, nullifier set, and vote events |

`ElectionFactory` stores an immutable verifier address. Each `Election` stores immutable coordinator,
external-nullifier, end-time, and encryption-public-key values.

The UUID is converted directly from `bytes16` to a `uint128`/`uint256` value. That value is used as
both the Semaphore group ID and the proof scope for that election.

## Election lifecycle

The on-chain phases are:

```text
REGISTRATION --startElection()--> VOTING --endElection()--> TALLY
```

Only the coordinator can add voters, start, or end an election. The current backend relayer is the
transaction sender that creates elections through the factory, so relayer-key continuity matters.

During registration, `addVoter`/`addVoters` inserts identity commitments in the Semaphore group and
emits membership events consumed by the proof service. During voting, `castVote`:

1. requires non-empty ciphertext of at most 1,024 bytes;
2. reads the current on-chain Merkle root;
3. binds the proof message to the ciphertext;
4. binds the proof scope to the election's external nullifier;
5. verifies the eight packed Groth16 proof elements; and
6. records the nullifier before emitting `VoteAdded`.

A reused nullifier reverts even if the caller changes. The contract does not learn a Keycloak user ID
or plaintext candidate choice.

The exact verifier public inputs are:

```text
[
  merkleTreeRoot,
  nullifier,
  hashSemaphore(hashToField(ciphertext)),
  hashSemaphore(externalNullifier)
]
```

This double-stage message hashing matches `@semaphore-protocol/proof` v4: Privote first maps the
ciphertext into a field, then Semaphore hashes that field as its public signal. Do not "simplify"
the mapping without regenerating cross-stack vectors and verifying browser, Rust/mobile, Solidity,
and server behavior together.

The browser and Android proof implementations must preserve this same mapping. Cross-stack vectors
are required when changing it.

## Install dependencies

The Compose contract image installs the locked Solidity dependencies during its image build, so a
fresh checkout does not depend on a host-populated, ignored `foundry/lib/` directory. For host-side
Foundry work, follow the pinned commands in
[the Foundry README](../foundry/README.md#install-dependencies). Dependency versions are part of the
verification boundary; review remapping and layout changes when upgrading them.

Then validate:

```bash
cd foundry
forge fmt --check
forge build --sizes
forge test -vvv
```

## Local deployment through Compose

The development overlay runs two distinct concerns:

- `anvil` is the long-running local chain, with chain ID `31337` and state persisted at
  `foundry/anvil-state.json` through the development bind mount.
- `contracts-deploy` is a one-shot transaction sender. It verifies or deploys
  `Groth16Verifier` and `ElectionFactory`, then exits.

The job uses `foundry/script/deploy-local.sh`, which invokes `Deploy.s.sol`, and these inputs:

- `ANVIL_DEPLOYER_PRIVATE_KEY` (development only);
- `ELECTION_FACTORY_ADDRESS`; and
- internal `RPC_URL=http://anvil:8545`.

### What the broadcast actually deploys

`Deploy.s.sol` names two contracts, but three deployments happen, and the order matters because it
is what fixes the expected factory address on a fresh chain:

| # | Deployer nonce | Contract | Creation | Notes |
|---|---|---|---|---|
| 1 | `0` | `PoseidonT3` | `CREATE2` | Linked library, deployed through Foundry's deterministic deployer before any contract that needs it |
| 2 | `1` | `Groth16Verifier` | `CREATE` | |
| 3 | `2` | `ElectionFactory` | `CREATE` | Constructor takes the verifier address |

The linked Poseidon library comes first. `Election` uses Poseidon hashing through
`@zk-kit/lean-imt.sol`, so Foundry deploys and links `PoseidonT3` before broadcasting the script's
own `new` expressions. Its address comes from `CREATE2` and so does not depend on the deployer's
nonce, but the transaction that deploys it does consume nonce `0`. That is why the verifier lands at
the nonce-`1` address and the factory at nonce-`2` -- not at nonce `0` and `1` as a reading of the
script alone would suggest.

On a fresh Anvil chain with the default development key, that produces the
`ELECTION_FACTORY_ADDRESS` documented in `.env.example`. The record of an actual run is in
`foundry/broadcast/Deploy.s.sol/<chainId>/run-latest.json`, including the `libraries` entry that
pins the linked Poseidon address.

These addresses are a property of one chain's state, not of the source. Any earlier transaction from
the same account shifts every `CREATE` address, and a different linked-library bytecode shifts the
`CREATE2` address. The job therefore never assumes a later deployment reproduces them: it checks the
configured address and fails on a mismatch rather than adopting whatever it finds.

Start or re-run it:

```bash
just dev

docker compose --env-file .env \
  -f compose.yaml -f compose.dev.yaml \
  run --rm --no-deps contracts-deploy
```

The idempotency rule is deliberately strict:

- no bytecode at the configured address: deploy;
- bytecode plus a valid `verifier()` response: reuse the existing factory;
- bytecode that does not identify an `ElectionFactory`: fail;
- a newly deployed factory at a different address than configured: fail and report the mismatch.

This avoids silently starting the backend against an unrelated contract in a reused Anvil state.

## Host-side local chain

`foundry/script/anvil-dev.sh` is the convenience entry point when both Anvil and Foundry run on the
host. It starts Anvil with persistent state, waits with a bounded readiness check, and uses the same
deployment-only helper as Compose. Run it from anywhere in the repository:

```bash
foundry/script/anvil-dev.sh
```

Do not run the host script and the Compose `anvil` service on the same port. The Compose deployment
job must not call a script that starts a second Anvil instance; it connects to the existing `anvil`
service instead.

## Cross-service invariants

These values must describe the same chain:

| Consumer | Setting |
| --- | --- |
| Backend | `web3j.chain-id`, RPC URL, `RELAYER_PRIVATE_KEY`, `ELECTION_FACTORY_ADDRESS` |
| Proof service | `RPC_URL`, `FACTORY_ADDRESS`, `FACTORY_START_BLOCK`, `CONFIRMATIONS` |
| Deployment job (development) | `RPC_URL`, deployer key, `ELECTION_FACTORY_ADDRESS` |
| Preflight job (production) | `COMPOSE_CHAIN_RPC_URL`, `CHAIN_ID`, `ELECTION_FACTORY_ADDRESS` |
| Browser/mobile proof | Semaphore artifacts and public-signal ordering |

If the Anvil state is reset, reset or deliberately migrate database records and proof cursors that
reference its old blocks/contracts. If only `proofdb` is reset, it can normally rebuild from factory
and membership events as long as the chain history and start block remain available.

## Inspect a deployment

From a host with Foundry installed:

```bash
cast chain-id --rpc-url http://127.0.0.1:8545
cast code "$ELECTION_FACTORY_ADDRESS" --rpc-url http://127.0.0.1:8545
cast call "$ELECTION_FACTORY_ADDRESS" 'verifier()(address)' \
  --rpc-url http://127.0.0.1:8545
```

Also record the factory deployment transaction/log and compare the backend and proof-service
configuration. Non-empty bytecode alone does not prove contract identity.

## Production preflight verification

Production has no deployment job. It has a read-only one, `chain-preflight`, which runs
`foundry/script/verify-deployment.sh` from the same Foundry image and gates both `server` and
`proof-service` through `service_completed_successfully`. It never sends a transaction; it answers
one question before any consumer starts: *is the contract this deployment is configured for actually
present on the chain this deployment is pointed at?*

It reads `COMPOSE_CHAIN_RPC_URL`, `CHAIN_ID`, and `ELECTION_FACTORY_ADDRESS`, and fails on:

- a `CHAIN_ID` that is not a positive integer, or a factory address that is not 20 bytes (exit `2`,
  before any network call);
- an RPC whose `eth_chainId` is not the configured `CHAIN_ID`;
- no bytecode at the configured factory address;
- a `verifier()` call that does not return a plausible non-zero address, which is how a contract
  that is not an `ElectionFactory` is caught; and
- a verifier address with no bytecode of its own.

The identity checks mirror `contracts-deploy`, so the same misconfiguration fails the same way in
both environments -- the difference is that production stops rather than deploying. This is a
configuration check, not an assurance argument: matching bytecode at a recorded address says nothing
about whether that contract was reviewed. See
[Production: contract assurance](production.md#contract-assurance).

Run it on its own after changing any chain value:

```bash
docker compose --env-file /etc/privote/prod.env \
  -f compose.yaml -f compose.prod.yaml \
  run --rm chain-preflight
```

## Production deployment

Do not put `contracts-deploy` or Anvil in the production application startup path. Treat contract
deployment as a separate release with human-reviewed inputs and recorded output:

1. pin compiler, source revision, dependency versions, optimizer settings, chain ID, and signer;
2. run tests, static analysis, and an independent audit;
3. simulate deployment against a fork/test network;
4. deploy verifier then factory from the approved account;
5. verify published bytecode/source where the network supports it;
6. record verifier/factory addresses, transaction hashes, deployment block, and artifact hashes;
7. configure backend/proof service from the recorded release data; and
8. use a confirmation window appropriate to network finality.

The current contracts are not upgradeable. A defect requires a migration to new deployments and a
clear policy for elections created by an old factory. `endElection` publishes generic decryption
material; guardian/threshold-decryption work is not yet a current production guarantee.
