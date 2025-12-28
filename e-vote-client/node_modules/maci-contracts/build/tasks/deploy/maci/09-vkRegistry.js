"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const maci_circuits_1 = require("maci-circuits");
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
deployment.deployTask(constants_2.EDeploySteps.VkRegistry, "Deploy Vk Registry and set keys").then((task) => task.setAction(async ({ incremental }, hre) => {
    deployment.setHre(hre);
    const deployer = await deployment.getDeployer();
    const vkRegistryContractAddress = storage.getAddress(types_1.EContracts.VkRegistry, hre.network.name);
    if (incremental && vkRegistryContractAddress) {
        // eslint-disable-next-line no-console
        console.log(`Skipping deployment of the ${types_1.EContracts.VkRegistry} contract`);
        return;
    }
    const stateTreeDepth = deployment.getDeployConfigField(types_1.EContracts.VkRegistry, "stateTreeDepth");
    const intStateTreeDepth = deployment.getDeployConfigField(types_1.EContracts.VkRegistry, "intStateTreeDepth");
    const messageTreeDepth = deployment.getDeployConfigField(types_1.EContracts.VkRegistry, "messageTreeDepth");
    const messageBatchDepth = deployment.getDeployConfigField(types_1.EContracts.VkRegistry, "messageBatchDepth");
    const voteOptionTreeDepth = deployment.getDeployConfigField(types_1.EContracts.VkRegistry, "voteOptionTreeDepth");
    const processMessagesZkeyPathQv = deployment.getDeployConfigField(types_1.EContracts.VkRegistry, "zkeys.qv.processMessagesZkey");
    const processMessagesZkeyPathNonQv = deployment.getDeployConfigField(types_1.EContracts.VkRegistry, "zkeys.nonQv.processMessagesZkey");
    const tallyVotesZkeyPathQv = deployment.getDeployConfigField(types_1.EContracts.VkRegistry, "zkeys.qv.tallyVotesZkey");
    const tallyVotesZkeyPathNonQv = deployment.getDeployConfigField(types_1.EContracts.VkRegistry, "zkeys.nonQv.tallyVotesZkey");
    const useQuadraticVoting = deployment.getDeployConfigField(types_1.EContracts.Poll, "useQuadraticVoting") ?? false;
    if (useQuadraticVoting && (!tallyVotesZkeyPathQv || !processMessagesZkeyPathQv)) {
        throw new Error("QV zkeys are not set");
    }
    if (!useQuadraticVoting && (!tallyVotesZkeyPathNonQv || !processMessagesZkeyPathNonQv)) {
        throw new Error("Non-QV zkeys are not set");
    }
    const [qvProcessVk, qvTallyVk, nonQvProcessVk, nonQvTallyQv] = await Promise.all([
        processMessagesZkeyPathQv && (0, maci_circuits_1.extractVk)(processMessagesZkeyPathQv),
        tallyVotesZkeyPathQv && (0, maci_circuits_1.extractVk)(tallyVotesZkeyPathQv),
        processMessagesZkeyPathNonQv && (0, maci_circuits_1.extractVk)(processMessagesZkeyPathNonQv),
        tallyVotesZkeyPathNonQv && (0, maci_circuits_1.extractVk)(tallyVotesZkeyPathNonQv),
    ]).then((vks) => vks.map((vk) => vk && maci_domainobjs_1.VerifyingKey.fromObj(vk).asContractParam()));
    const vkRegistryContract = await deployment.deployContract({
        name: types_1.EContracts.VkRegistry,
        signer: deployer,
    });
    const processZkeys = [qvProcessVk, nonQvProcessVk].filter(Boolean);
    const tallyZkeys = [qvTallyVk, nonQvTallyQv].filter(Boolean);
    const modes = [];
    if (qvProcessVk && qvTallyVk) {
        modes.push(constants_1.EMode.QV);
    }
    if (nonQvProcessVk && nonQvTallyQv) {
        modes.push(constants_1.EMode.NON_QV);
    }
    await vkRegistryContract
        .setVerifyingKeysBatch(stateTreeDepth, intStateTreeDepth, messageTreeDepth, voteOptionTreeDepth, 5 ** messageBatchDepth, modes, processZkeys, tallyZkeys)
        .then((tx) => tx.wait());
    await storage.register({
        id: types_1.EContracts.VkRegistry,
        contract: vkRegistryContract,
        args: [],
        network: hre.network.name,
    });
}));
//# sourceMappingURL=09-vkRegistry.js.map