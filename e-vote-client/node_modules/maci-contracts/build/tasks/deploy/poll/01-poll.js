"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable no-console */
const maci_domainobjs_1 = require("maci-domainobjs");
const constants_1 = require("../../../ts/constants");
const constants_2 = require("../../helpers/constants");
const ContractStorage_1 = require("../../helpers/ContractStorage");
const Deployment_1 = require("../../helpers/Deployment");
const types_1 = require("../../helpers/types");
const deployment = Deployment_1.Deployment.getInstance();
const storage = ContractStorage_1.ContractStorage.getInstance();
/**
 * Deploy step registration and task itself
 */
deployment.deployTask(constants_2.EDeploySteps.Poll, "Deploy poll").then((task) => task.setAction(async (_, hre) => {
    deployment.setHre(hre);
    const maciContractAddress = storage.getAddress(types_1.EContracts.MACI, hre.network.name);
    const verifierContractAddress = storage.getAddress(types_1.EContracts.Verifier, hre.network.name);
    const vkRegistryContractAddress = storage.getAddress(types_1.EContracts.VkRegistry, hre.network.name);
    if (!maciContractAddress) {
        throw new Error("Need to deploy MACI contract first");
    }
    if (!verifierContractAddress) {
        throw new Error("Need to deploy Verifier contract first");
    }
    if (!vkRegistryContractAddress) {
        throw new Error("Need to deploy VkRegistry contract first");
    }
    const maciContract = await deployment.getContract({ name: types_1.EContracts.MACI });
    const pollId = await maciContract.nextPollId();
    const coordinatorPubkey = deployment.getDeployConfigField(types_1.EContracts.Poll, "coordinatorPubkey");
    const pollDuration = deployment.getDeployConfigField(types_1.EContracts.Poll, "pollDuration");
    const intStateTreeDepth = deployment.getDeployConfigField(types_1.EContracts.VkRegistry, "intStateTreeDepth");
    const messageTreeSubDepth = deployment.getDeployConfigField(types_1.EContracts.VkRegistry, "messageBatchDepth");
    const messageTreeDepth = deployment.getDeployConfigField(types_1.EContracts.VkRegistry, "messageTreeDepth");
    const voteOptionTreeDepth = deployment.getDeployConfigField(types_1.EContracts.VkRegistry, "voteOptionTreeDepth");
    const useQuadraticVoting = deployment.getDeployConfigField(types_1.EContracts.Poll, "useQuadraticVoting") ?? false;
    const unserializedKey = maci_domainobjs_1.PubKey.deserialize(coordinatorPubkey);
    const mode = useQuadraticVoting ? constants_1.EMode.QV : constants_1.EMode.NON_QV;
    const tx = await maciContract.deployPoll(pollDuration, {
        intStateTreeDepth,
        messageTreeSubDepth,
        messageTreeDepth,
        voteOptionTreeDepth,
    }, unserializedKey.asContractParam(), verifierContractAddress, vkRegistryContractAddress, mode);
    const receipt = await tx.wait();
    if (receipt?.status !== 1) {
        throw new Error("Deploy poll transaction is failed");
    }
    const pollContracts = await maciContract.getPoll(pollId);
    const pollContractAddress = pollContracts.poll;
    const messageProcessorContractAddress = pollContracts.messageProcessor;
    const tallyContractAddress = pollContracts.tally;
    const pollContract = await deployment.getContract({ name: types_1.EContracts.Poll, address: pollContractAddress });
    const extContracts = await pollContract.extContracts();
    const messageProcessorContract = await deployment.getContract({
        name: types_1.EContracts.MessageProcessor,
        address: messageProcessorContractAddress,
    });
    const tallyContract = await deployment.getContract({
        name: types_1.EContracts.Tally,
        address: tallyContractAddress,
    });
    const messageAccQueueContract = await deployment.getContract({
        name: types_1.EContracts.AccQueueQuinaryMaci,
        address: extContracts[1],
    });
    // get the empty ballot root
    const emptyBallotRoot = await pollContract.emptyBallotRoot();
    await Promise.all([
        storage.register({
            id: types_1.EContracts.Poll,
            key: `poll-${pollId}`,
            contract: pollContract,
            args: [
                pollDuration,
                {
                    intStateTreeDepth,
                    messageTreeSubDepth,
                    messageTreeDepth,
                    voteOptionTreeDepth,
                },
                unserializedKey.asContractParam(),
                extContracts,
                emptyBallotRoot.toString(),
            ],
            network: hre.network.name,
        }),
        storage.register({
            id: types_1.EContracts.MessageProcessor,
            key: `poll-${pollId}`,
            contract: messageProcessorContract,
            args: [verifierContractAddress, vkRegistryContractAddress, pollContractAddress, mode],
            network: hre.network.name,
        }),
        storage.register({
            id: types_1.EContracts.Tally,
            key: `poll-${pollId}`,
            contract: tallyContract,
            args: [
                verifierContractAddress,
                vkRegistryContractAddress,
                pollContractAddress,
                messageProcessorContractAddress,
                mode,
            ],
            network: hre.network.name,
        }),
        storage.register({
            id: types_1.EContracts.AccQueueQuinaryMaci,
            key: `poll-${pollId}`,
            name: "contracts/trees/AccQueueQuinaryMaci.sol:AccQueueQuinaryMaci",
            contract: messageAccQueueContract,
            args: [messageTreeSubDepth],
            network: hre.network.name,
        }),
    ]);
}));
//# sourceMappingURL=01-poll.js.map