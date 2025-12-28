"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const constants_1 = require("../../helpers/constants");
const ContractStorage_1 = require("../../helpers/ContractStorage");
const Deployment_1 = require("../../helpers/Deployment");
const types_1 = require("../../helpers/types");
const deployment = Deployment_1.Deployment.getInstance();
const storage = ContractStorage_1.ContractStorage.getInstance();
/**
 * Deploy step registration and task itself
 */
deployment.deployTask(constants_1.EDeploySteps.PollFactory, "Deploy poll factory").then((task) => task.setAction(async ({ incremental }, hre) => {
    deployment.setHre(hre);
    const deployer = await deployment.getDeployer();
    const pollFactoryContractAddress = storage.getAddress(types_1.EContracts.PollFactory, hre.network.name);
    if (incremental && pollFactoryContractAddress) {
        // eslint-disable-next-line no-console
        console.log(`Skipping deployment of the ${types_1.EContracts.PollFactory} contract`);
        return;
    }
    const poseidonT3ContractAddress = storage.mustGetAddress(types_1.EContracts.PoseidonT3, hre.network.name);
    const poseidonT4ContractAddress = storage.mustGetAddress(types_1.EContracts.PoseidonT4, hre.network.name);
    const poseidonT5ContractAddress = storage.mustGetAddress(types_1.EContracts.PoseidonT5, hre.network.name);
    const poseidonT6ContractAddress = storage.mustGetAddress(types_1.EContracts.PoseidonT6, hre.network.name);
    const linkedPollFactoryContract = await hre.ethers.getContractFactory(types_1.EContracts.PollFactory, {
        signer: deployer,
        libraries: {
            PoseidonT3: poseidonT3ContractAddress,
            PoseidonT4: poseidonT4ContractAddress,
            PoseidonT5: poseidonT5ContractAddress,
            PoseidonT6: poseidonT6ContractAddress,
        },
    });
    const pollFactoryContract = await deployment.deployContractWithLinkedLibraries({
        contractFactory: linkedPollFactoryContract,
    });
    await storage.register({
        id: types_1.EContracts.PollFactory,
        contract: pollFactoryContract,
        args: [],
        network: hre.network.name,
    });
}));
//# sourceMappingURL=05-pollFactory.js.map