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
deployment.deployTask(constants_1.EDeploySteps.Verifier, "Deploy verifier").then((task) => task.setAction(async ({ incremental }, hre) => {
    deployment.setHre(hre);
    const deployer = await deployment.getDeployer();
    const verifierContractAddress = storage.getAddress(types_1.EContracts.Verifier, hre.network.name);
    if (incremental && verifierContractAddress) {
        // eslint-disable-next-line no-console
        console.log(`Skipping deployment of the ${types_1.EContracts.Verifier} contract`);
        return;
    }
    const verifierContract = await deployment.deployContract({ name: types_1.EContracts.Verifier, signer: deployer });
    await storage.register({
        id: types_1.EContracts.Verifier,
        contract: verifierContract,
        args: [],
        network: hre.network.name,
    });
}));
//# sourceMappingURL=03-verifier.js.map