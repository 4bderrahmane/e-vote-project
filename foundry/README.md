## Privote — Foundry

Solidity contracts for Privote (Election + ElectionFactory + Groth16Verifier),
ported from the previous Hardhat setup to Foundry.

### Layout

- `contracts/` — production contracts (`Election.sol`, `ElectionFactory.sol`, `Groth16Verifier.sol`)
- `contracts/interfaces/` — public interfaces consumed by the contracts
- `contracts/test/` — test-only helpers (`MockGroth16Verifier`, `PoseidonT3Import`)
- `test/` — Foundry tests (`*.t.sol`)
- `circuits/` — Circom sources for the ZK circuits (kept verbatim from the Hardhat repo)
- `lib/` — external Solidity dependencies (forge-std, semaphore, zk-kit, poseidon-solidity). Gitignored; contributors install them locally (see [Install dependencies](#install-dependencies)).

### Prerequisites

- [Foundry](https://book.getfoundry.sh/getting-started/installation) (`forge`, `cast`, `anvil`)
- Node.js + `npm` (only for the one-time dependency install below)

### Install dependencies

`lib/` is not committed. The Solidity deps use an npm-style layout (matching how the
remappings in `remappings.txt` resolve), so the install is a mix of `npm pack` (for the
three npm-published libs) and `forge install` (for `forge-std`).

Run once from `foundry/`:

```shell
# 1. forge-std (fetched via forge)
forge install foundry-rs/forge-std@v1.16.1 --no-commit

# 2. Semaphore, zk-kit lean-imt, poseidon-solidity (fetched via npm)
mkdir -p lib/@semaphore-protocol lib/@zk-kit
( cd lib/@semaphore-protocol && \
    tar -xzf "$(npm pack @semaphore-protocol/contracts@4.14.0 | tail -1)" && \
    mv package contracts && rm -f *.tgz )
( cd lib/@zk-kit && \
    tar -xzf "$(npm pack @zk-kit/lean-imt.sol@2.0.1 | tail -1)" && \
    mv package lean-imt.sol && rm -f *.tgz )
( cd lib && \
    tar -xzf "$(npm pack poseidon-solidity@0.0.5 | tail -1)" && \
    mv package poseidon-solidity && rm -f *.tgz )
```

Pinned versions match what the project was developed against. Bumping any of these
may require updating `remappings.txt` if the package's internal layout changes.

### Build

```shell
forge build
```

### Test

```shell
forge test            # run all tests
forge test -vvv       # with stack traces on failure
forge test --gas-report
```

### Format

```shell
forge fmt             # apply
forge fmt --check     # verify (CI uses this)
```

### Local node

```shell
anvil
```

### Deploy

There is no project deployment script yet. To run an ad-hoc deployment, use
`forge create`:

```shell
forge create contracts/Groth16Verifier.sol:Groth16Verifier \
  --rpc-url <rpc> --private-key <key>

forge create contracts/ElectionFactory.sol:ElectionFactory \
  --rpc-url <rpc> --private-key <key> \
  --constructor-args <verifier-address>
```

### CI

`.github/workflows/test.yml` runs `forge fmt --check`, `forge build --sizes`,
and `forge test -vvv` on every push and pull request.
