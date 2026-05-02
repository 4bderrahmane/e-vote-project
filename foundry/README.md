## Privote — Foundry

Solidity contracts for Privote (Election + ElectionFactory + Groth16Verifier),
ported from the previous Hardhat setup to Foundry.

### Layout

- `contracts/` — production contracts (`Election.sol`, `ElectionFactory.sol`, `Groth16Verifier.sol`)
- `contracts/interfaces/` — public interfaces consumed by the contracts
- `contracts/test/` — test-only helpers (`MockGroth16Verifier`, `PoseidonT3Import`)
- `test/` — Foundry tests (`*.t.sol`)
- `circuits/` — Circom sources for the ZK circuits (kept verbatim from the Hardhat repo)
- `lib/` — git-submodule and library dependencies (forge-std, semaphore, zk-kit, poseidon-solidity)

### Prerequisites

- [Foundry](https://book.getfoundry.sh/getting-started/installation) (`forge`, `cast`, `anvil`)
- Submodules installed: `git submodule update --init --recursive`

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
