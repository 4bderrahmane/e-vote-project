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
deployment.deployTask(constants_1.EDeploySteps.Poseidon, "Deploy poseidon contracts").then((task) => task.setAction(async ({ incremental }, hre) => {
    deployment.setHre(hre);
    const deployer = await deployment.getDeployer();
    const poseidonT3ContractAddress = storage.getAddress(types_1.EContracts.PoseidonT3, hre.network.name);
    const poseidonT4ContractAddress = storage.getAddress(types_1.EContracts.PoseidonT4, hre.network.name);
    const poseidonT5ContractAddress = storage.getAddress(types_1.EContracts.PoseidonT5, hre.network.name);
    const poseidonT6ContractAddress = storage.getAddress(types_1.EContracts.PoseidonT6, hre.network.name);
    if (incremental &&
        poseidonT3ContractAddress &&
        poseidonT4ContractAddress &&
        poseidonT5ContractAddress &&
        poseidonT6ContractAddress) {
        // eslint-disable-next-line no-console
        console.log(`Skipping deployment of the Poseidon contracts`);
        return;
    }
    const PoseidonT3Contract = await deployment.deployContract({ name: types_1.EContracts.PoseidonT3, signer: deployer });
    const PoseidonT4Contract = await deployment.deployContract({ name: types_1.EContracts.PoseidonT4, signer: deployer });
    const PoseidonT5Contract = await deployment.deployContract({ name: types_1.EContracts.PoseidonT5, signer: deployer });
    const PoseidonT6Contract = await deployment.deployContract({ name: types_1.EContracts.PoseidonT6, signer: deployer });
    await Promise.all([
        storage.register({
            id: types_1.EContracts.PoseidonT3,
            contract: PoseidonT3Contract,
            args: [],
            network: hre.network.name,
        }),
        storage.register({
            id: types_1.EContracts.PoseidonT4,
            contract: PoseidonT4Contract,
            args: [],
            network: hre.network.name,
        }),
        storage.register({
            id: types_1.EContracts.PoseidonT5,
            contract: PoseidonT5Contract,
            args: [],
            network: hre.network.name,
        }),
        storage.register({
            id: types_1.EContracts.PoseidonT6,
            contract: PoseidonT6Contract,
            args: [],
            network: hre.network.name,
        }),
    ]);
}));
//# sourceMappingURL=04-poseidon.js.map