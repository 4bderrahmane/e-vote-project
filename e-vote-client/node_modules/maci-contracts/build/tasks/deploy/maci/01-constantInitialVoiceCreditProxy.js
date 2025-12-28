"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const constants_1 = require("../../helpers/constants");
const ContractStorage_1 = require("../../helpers/ContractStorage");
const Deployment_1 = require("../../helpers/Deployment");
const types_1 = require("../../helpers/types");
const DEFAULT_INITIAL_VOICE_CREDITS = 99;
const deployment = Deployment_1.Deployment.getInstance();
const storage = ContractStorage_1.ContractStorage.getInstance();
/**
 * Deploy step registration and task itself
 */
deployment
    .deployTask(constants_1.EDeploySteps.ConstantInitialVoiceCreditProxy, "Deploy constant initial voice credit proxy")
    .then((task) => task.setAction(async ({ incremental }, hre) => {
    deployment.setHre(hre);
    const deployer = await deployment.getDeployer();
    const needDeploy = deployment.getDeployConfigField(types_1.EContracts.ConstantInitialVoiceCreditProxy, "deploy");
    if (needDeploy === false) {
        return;
    }
    const constantInitialVoiceCreditProxyContractAddress = storage.getAddress(types_1.EContracts.ConstantInitialVoiceCreditProxy, hre.network.name);
    if (incremental && constantInitialVoiceCreditProxyContractAddress) {
        // eslint-disable-next-line no-console
        console.log(`Skipping deployment of the ${types_1.EContracts.ConstantInitialVoiceCreditProxy} contract`);
        return;
    }
    const amount = deployment.getDeployConfigField(types_1.EContracts.ConstantInitialVoiceCreditProxy, "amount") ??
        DEFAULT_INITIAL_VOICE_CREDITS;
    const constantInitialVoiceCreditProxyContract = await deployment.deployContract({ name: types_1.EContracts.ConstantInitialVoiceCreditProxy, signer: deployer }, amount.toString());
    await storage.register({
        id: types_1.EContracts.ConstantInitialVoiceCreditProxy,
        contract: constantInitialVoiceCreditProxyContract,
        args: [amount.toString()],
        network: hre.network.name,
    });
}));
//# sourceMappingURL=01-constantInitialVoiceCreditProxy.js.map