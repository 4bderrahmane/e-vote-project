import { type DeployedContracts, type DeployArgs } from "../utils";
/**
 * Deploy MACI and related contracts
 * @param DeployArgs - The arguments for the deploy command
 * @returns The addresses of the deployed contracts
 */
export declare const deploy: ({ stateTreeDepth, initialVoiceCredits, initialVoiceCreditsProxyAddress, signupGatekeeperAddress, poseidonT3Address, poseidonT4Address, poseidonT5Address, poseidonT6Address, signer, quiet, }: DeployArgs) => Promise<DeployedContracts>;
//# sourceMappingURL=deploy.d.ts.map