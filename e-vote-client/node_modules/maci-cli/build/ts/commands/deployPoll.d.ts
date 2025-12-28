import { type DeployPollArgs, type PollContracts } from "../utils";
/**
 * Deploy a new Poll for the set of MACI's contracts already deployed
 * @param DeployPollArgs - The arguments for the deployPoll command
 * @returns The addresses of the deployed contracts
 */
export declare const deployPoll: ({ pollDuration, intStateTreeDepth, messageTreeSubDepth, messageTreeDepth, voteOptionTreeDepth, coordinatorPubkey, maciAddress, vkRegistryAddress, signer, quiet, useQuadraticVoting, }: DeployPollArgs) => Promise<PollContracts>;
//# sourceMappingURL=deployPoll.d.ts.map