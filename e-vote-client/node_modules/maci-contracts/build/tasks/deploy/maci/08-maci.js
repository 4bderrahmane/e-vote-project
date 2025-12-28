"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const genEmptyBallotRoots_1 = require("../../../ts/genEmptyBallotRoots");
const constants_1 = require("../../helpers/constants");
const ContractStorage_1 = require("../../helpers/ContractStorage");
const Deployment_1 = require("../../helpers/Deployment");
const types_1 = require("../../helpers/types");
const deployment = Deployment_1.Deployment.getInstance();
const storage = ContractStorage_1.ContractStorage.getInstance();
const DEFAULT_STATE_TREE_DEPTH = 10;
/**
 * Deploy step registration and task itself
 */
deployment.deployTask(constants_1.EDeploySteps.Maci, "Deploy MACI contract").then((task) => task.setAction(async ({ incremental }, hre) => {
    deployment.setHre(hre);
    const deployer = await deployment.getDeployer();
    const maciContractAddress = storage.getAddress(types_1.EContracts.MACI, hre.network.name);
    if (incremental && maciContractAddress) {
        // eslint-disable-next-line no-console
        console.log(`Skipping deployment of the ${types_1.EContracts.MACI} contract`);
        return;
    }
    const poseidonT3ContractAddress = storage.mustGetAddress(types_1.EContracts.PoseidonT3, hre.network.name);
    const poseidonT4ContractAddress = storage.mustGetAddress(types_1.EContracts.PoseidonT4, hre.network.name);
    const poseidonT5ContractAddress = storage.mustGetAddress(types_1.EContracts.PoseidonT5, hre.network.name);
    const poseidonT6ContractAddress = storage.mustGetAddress(types_1.EContracts.PoseidonT6, hre.network.name);
    const maciContractFactory = await hre.ethers.getContractFactory(types_1.EContracts.MACI, {
        signer: deployer,
        libraries: {
            PoseidonT3: poseidonT3ContractAddress,
            PoseidonT4: poseidonT4ContractAddress,
            PoseidonT5: poseidonT5ContractAddress,
            PoseidonT6: poseidonT6ContractAddress,
        },
    });
    const constantInitialVoiceCreditProxyContractAddress = storage.mustGetAddress(types_1.EContracts.ConstantInitialVoiceCreditProxy, hre.network.name);
    const gatekeeper = deployment.getDeployConfigField(types_1.EContracts.MACI, "gatekeeper") ||
        types_1.EContracts.FreeForAllGatekeeper;
    const gatekeeperContractAddress = storage.mustGetAddress(gatekeeper, hre.network.name);
    const pollFactoryContractAddress = storage.mustGetAddress(types_1.EContracts.PollFactory, hre.network.name);
    const messageProcessorFactoryContractAddress = storage.mustGetAddress(types_1.EContracts.MessageProcessorFactory, hre.network.name);
    const tallyFactoryContractAddress = storage.mustGetAddress(types_1.EContracts.TallyFactory, hre.network.name);
    const stateTreeDepth = deployment.getDeployConfigField(types_1.EContracts.MACI, "stateTreeDepth") ?? DEFAULT_STATE_TREE_DEPTH;
    const emptyBallotRoots = (0, genEmptyBallotRoots_1.genEmptyBallotRoots)(stateTreeDepth);
    const maciContract = await deployment.deployContractWithLinkedLibraries({ contractFactory: maciContractFactory }, pollFactoryContractAddress, messageProcessorFactoryContractAddress, tallyFactoryContractAddress, gatekeeperContractAddress, constantInitialVoiceCreditProxyContractAddress, stateTreeDepth, emptyBallotRoots);
    if (gatekeeper !== types_1.EContracts.FreeForAllGatekeeper) {
        const gatekeeperContract = await deployment.getContract({
            name: types_1.EContracts.SignUpGatekeeper,
            address: gatekeeperContractAddress,
        });
        const maciInstanceAddress = await maciContract.getAddress();
        await gatekeeperContract.setMaciInstance(maciInstanceAddress).then((tx) => tx.wait());
    }
    await storage.register({
        id: types_1.EContracts.MACI,
        contract: maciContract,
        args: [
            pollFactoryContractAddress,
            messageProcessorFactoryContractAddress,
            tallyFactoryContractAddress,
            gatekeeperContractAddress,
            constantInitialVoiceCreditProxyContractAddress,
            stateTreeDepth,
            emptyBallotRoots.map((root) => root.toString()),
        ],
        network: hre.network.name,
    });
}));
//# sourceMappingURL=08-maci.js.map