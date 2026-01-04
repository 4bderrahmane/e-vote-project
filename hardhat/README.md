# Sample Hardhat 3 Beta Project (`mocha` and `ethers`)

This project showcases a Hardhat 3 Beta project using `mocha` for tests and the `ethers` library for Ethereum interactions.

To learn more about the Hardhat 3 Beta, please visit the [Getting Started guide](https://hardhat.org/docs/getting-started#getting-started-with-hardhat-3). To share your feedback, join our [Hardhat 3 Beta](https://hardhat.org/hardhat3-beta-telegram-group) Telegram group or [open an issue](https://github.com/NomicFoundation/hardhat/issues/new) in our GitHub issue tracker.

## Project Overview

This example project includes:

- A simple Hardhat configuration file.
- Foundry-compatible Solidity unit tests.
- TypeScript integration tests using `mocha` and ethers.js
- Examples demonstrating how to connect to different types of networks, including locally simulating OP mainnet.

## Usage

### Running Tests

To run all the tests in the project, execute the following command:

```shell
npx hardhat test
```

You can also selectively run the Solidity or `mocha` tests:

```shell
npx hardhat test solidity
npx hardhat test mocha
```

### Deploy `ElectionFactory` (local Hardhat)

This project includes a deployment script that deploys:

- the Poseidon `PoseidonT3` library (required for Semaphore Groups)
- a Semaphore verifier:
  - deploys `MockSemaphoreVerifier` automatically on local/dev networks, OR
  - uses `SEMAPHORE_VERIFIER_ADDRESS` if provided
- `ElectionFactory`

By default it deploys only the factory (recommended while iterating locally).

Local deploy:

```shell
npm run deploy
```

Optional environment variables (script: [scripts/deploy-contracts.ts](scripts/deploy-contracts.ts)):

- `SEMAPHORE_VERIFIER_ADDRESS` (address): if set, the script will not deploy the mock verifier

Optional: deploy a standalone `Election` too (not required if you only want the factory):

- `DEPLOY_ELECTION` (`true`/`1`): if set, also deploys an `Election` instance
- `COORDINATOR_ADDRESS` (address): defaults to the deployer address
- `EXTERNAL_NULLIFIER` (uint256): defaults to `123`
- `END_TIME` (unix timestamp, uint256): if set, used as-is
- `DURATION_SECONDS` (number): used only if `END_TIME` is not set, defaults to `3600`
- `ENCRYPTION_PUBLIC_KEY` (bytes32 hex): defaults to `keccak256("pubkey")`

### Make a deployment to Sepolia

This project includes an example Ignition module to deploy the contract. You can deploy this module to a locally simulated chain or to Sepolia.

To run the deployment to a local chain:

```shell
npx hardhat ignition deploy ignition/modules/Counter.ts
```

To run the deployment to Sepolia, you need an account with funds to send the transaction. The provided Hardhat configuration includes a Configuration Variable called `SEPOLIA_PRIVATE_KEY`, which you can use to set the private key of the account you want to use.

You can set the `SEPOLIA_PRIVATE_KEY` variable using the `hardhat-keystore` plugin or by setting it as an environment variable.

To set the `SEPOLIA_PRIVATE_KEY` config variable using `hardhat-keystore`:

```shell
npx hardhat keystore set SEPOLIA_PRIVATE_KEY
```

After setting the variable, you can run the deployment with the Sepolia network:

```shell
npx hardhat ignition deploy --network sepolia ignition/modules/Counter.ts
```
