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
deployment.deployTask(constants_1.EDeploySteps.MessageProcessorFactory, "Deploy message processor factory").then((task) => task.setAction(async ({ incremental }, hre) => {
    deployment.setHre(hre);
    const deployer = await deployment.getDeployer();
    const messageProcessorFactoryContractAddress = storage.getAddress(types_1.EContracts.MessageProcessorFactory, hre.network.name);
    if (incremental && messageProcessorFactoryContractAddress) {
        // eslint-disable-next-line no-console
        console.log(`Skipping deployment of the ${types_1.EContracts.MessageProcessorFactory} contract`);
        return;
    }
    const poseidonT3ContractAddress = storage.mustGetAddress(types_1.EContracts.PoseidonT3, hre.network.name);
    const poseidonT4ContractAddress = storage.mustGetAddress(types_1.EContracts.PoseidonT4, hre.network.name);
    const poseidonT5ContractAddress = storage.mustGetAddress(types_1.EContracts.PoseidonT5, hre.network.name);
    const poseidonT6ContractAddress = storage.mustGetAddress(types_1.EContracts.PoseidonT6, hre.network.name);
    const linkedMessageProcessorFactoryContract = await hre.ethers.getContractFactory(types_1.EContracts.MessageProcessorFactory, {
        signer: deployer,
        libraries: {
            PoseidonT3: poseidonT3ContractAddress,
            PoseidonT4: poseidonT4ContractAddress,
            PoseidonT5: poseidonT5ContractAddress,
            PoseidonT6: poseidonT6ContractAddress,
        },
    });
    const messageProcessorFactoryContract = await deployment.deployContractWithLinkedLibraries({
        contractFactory: linkedMessageProcessorFactoryContract,
    });
    await storage.register({
        id: types_1.EContracts.MessageProcessorFactory,
        contract: messageProcessorFactoryContract,
        args: [],
        network: hre.network.name,
    });
}));
//# sourceMappingURL=06-messageProcessorFactory.js.map