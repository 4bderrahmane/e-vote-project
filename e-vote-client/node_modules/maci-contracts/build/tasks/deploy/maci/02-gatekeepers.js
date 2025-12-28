"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const constants_1 = require("../../helpers/constants");
const ContractStorage_1 = require("../../helpers/ContractStorage");
const Deployment_1 = require("../../helpers/Deployment");
const numericParser_1 = require("../../helpers/numericParser");
const types_1 = require("../../helpers/types");
const deployment = Deployment_1.Deployment.getInstance();
const storage = ContractStorage_1.ContractStorage.getInstance();
/**
 * Deploy step registration and task itself
 */
deployment.deployTask(constants_1.EDeploySteps.Gatekeepers, "Deploy gatekeepers").then((task) => task.setAction(async ({ incremental }, hre) => {
    deployment.setHre(hre);
    const deployer = await deployment.getDeployer();
    const freeForAllGatekeeperContractAddress = storage.getAddress(types_1.EContracts.FreeForAllGatekeeper, hre.network.name);
    const easGatekeeperContractAddress = storage.getAddress(types_1.EContracts.EASGatekeeper, hre.network.name);
    const hatsGatekeeperContractAddress = storage.getAddress(types_1.EContracts.HatsGatekeeper, hre.network.name);
    const gitcoinGatekeeperContractAddress = storage.getAddress(types_1.EContracts.GitcoinPassportGatekeeper, hre.network.name);
    const zupassGatekeeperContractAddress = storage.getAddress(types_1.EContracts.ZupassGatekeeper, hre.network.name);
    const semaphoreGatekeeperContractAddress = storage.getAddress(types_1.EContracts.SemaphoreGatekeeper, hre.network.name);
    const merkleProofGatekeeperContractAddress = storage.getAddress(types_1.EContracts.MerkleProofGatekeeper, hre.network.name);
    const deployFreeForAllGatekeeper = deployment.getDeployConfigField(types_1.EContracts.FreeForAllGatekeeper, "deploy");
    const deployEASGatekeeper = deployment.getDeployConfigField(types_1.EContracts.EASGatekeeper, "deploy");
    const deployGitcoinGatekeeper = deployment.getDeployConfigField(types_1.EContracts.GitcoinPassportGatekeeper, "deploy");
    const deployZupassGatekeeper = deployment.getDeployConfigField(types_1.EContracts.ZupassGatekeeper, "deploy");
    const deploySemaphoreGatekeeper = deployment.getDeployConfigField(types_1.EContracts.SemaphoreGatekeeper, "deploy");
    const deployHatsSingleGatekeeper = deployment.getDeployConfigField(types_1.EContracts.HatsGatekeeper, "deploy");
    const deployMerkleGateekeper = deployment.getDeployConfigField(types_1.EContracts.MerkleProofGatekeeper, "deploy");
    const skipDeployFreeForAllGatekeeper = deployFreeForAllGatekeeper !== true;
    const skipDeployEASGatekeeper = deployEASGatekeeper !== true;
    const skipDeployGitcoinGatekeeper = deployGitcoinGatekeeper !== true;
    const skipDeployZupassGatekeeper = deployZupassGatekeeper !== true;
    const skipDeploySemaphoreGatekeeper = deploySemaphoreGatekeeper !== true;
    const skipDeployHatsGatekeeper = deployHatsSingleGatekeeper !== true;
    const skipDeployMerkleProofGatekeeper = deployMerkleGateekeper !== true;
    const canSkipDeploy = incremental &&
        (freeForAllGatekeeperContractAddress || skipDeployFreeForAllGatekeeper) &&
        (easGatekeeperContractAddress || skipDeployEASGatekeeper) &&
        (gitcoinGatekeeperContractAddress || skipDeployGitcoinGatekeeper) &&
        (zupassGatekeeperContractAddress || skipDeployZupassGatekeeper) &&
        (semaphoreGatekeeperContractAddress || skipDeploySemaphoreGatekeeper) &&
        (hatsGatekeeperContractAddress || skipDeployHatsGatekeeper) &&
        (merkleProofGatekeeperContractAddress || skipDeployMerkleProofGatekeeper) &&
        (!skipDeployFreeForAllGatekeeper ||
            !skipDeployEASGatekeeper ||
            !skipDeployGitcoinGatekeeper ||
            !skipDeployZupassGatekeeper ||
            !skipDeploySemaphoreGatekeeper ||
            !skipDeployHatsGatekeeper ||
            !skipDeployMerkleProofGatekeeper);
    if (canSkipDeploy) {
        // eslint-disable-next-line no-console
        console.log(`Skipping deployment of the Gatekeeper contract`);
        return;
    }
    if (!skipDeployFreeForAllGatekeeper) {
        const freeForAllGatekeeperContract = await deployment.deployContract({
            name: types_1.EContracts.FreeForAllGatekeeper,
            signer: deployer,
        });
        await storage.register({
            id: types_1.EContracts.FreeForAllGatekeeper,
            contract: freeForAllGatekeeperContract,
            args: [],
            network: hre.network.name,
        });
    }
    const isSupportedEASGatekeeperNetwork = ![constants_1.ESupportedChains.Hardhat, constants_1.ESupportedChains.Coverage].includes(hre.network.name);
    if (!skipDeployEASGatekeeper && isSupportedEASGatekeeperNetwork) {
        const easAddress = deployment.getDeployConfigField(types_1.EContracts.EASGatekeeper, "easAddress", true);
        const encodedSchema = deployment.getDeployConfigField(types_1.EContracts.EASGatekeeper, "schema", true);
        const attester = deployment.getDeployConfigField(types_1.EContracts.EASGatekeeper, "attester", true);
        const easGatekeeperContract = await deployment.deployContract({
            name: types_1.EContracts.EASGatekeeper,
            signer: deployer,
        }, easAddress, attester, encodedSchema);
        await storage.register({
            id: types_1.EContracts.EASGatekeeper,
            contract: easGatekeeperContract,
            args: [easAddress, attester, encodedSchema],
            network: hre.network.name,
        });
    }
    const isSupportedGitcoinGatekeeperNetwork = ![
        constants_1.ESupportedChains.Hardhat,
        constants_1.ESupportedChains.Coverage,
        constants_1.ESupportedChains.Sepolia,
    ].includes(hre.network.name);
    if (!skipDeployGitcoinGatekeeper && isSupportedGitcoinGatekeeperNetwork) {
        const gitcoinGatekeeperDecoderAddress = deployment.getDeployConfigField(types_1.EContracts.GitcoinPassportGatekeeper, "decoderAddress", true);
        const gitcoinGatekeeperPassingScore = deployment.getDeployConfigField(types_1.EContracts.GitcoinPassportGatekeeper, "passingScore", true);
        const gitcoinGatekeeperContract = await deployment.deployContract({
            name: types_1.EContracts.GitcoinPassportGatekeeper,
            signer: deployer,
        }, gitcoinGatekeeperDecoderAddress, gitcoinGatekeeperPassingScore);
        await storage.register({
            id: types_1.EContracts.GitcoinPassportGatekeeper,
            contract: gitcoinGatekeeperContract,
            args: [gitcoinGatekeeperDecoderAddress, gitcoinGatekeeperPassingScore],
            network: hre.network.name,
        });
    }
    if (!skipDeployZupassGatekeeper) {
        const eventId = deployment.getDeployConfigField(types_1.EContracts.ZupassGatekeeper, "eventId", true);
        const validEventId = (0, numericParser_1.uuidToBigInt)(eventId);
        const validSigner1 = deployment.getDeployConfigField(types_1.EContracts.ZupassGatekeeper, "signer1", true);
        const validSigner2 = deployment.getDeployConfigField(types_1.EContracts.ZupassGatekeeper, "signer2", true);
        let verifier = deployment.getDeployConfigField(types_1.EContracts.ZupassGatekeeper, "zupassVerifier");
        if (!verifier) {
            const verifierContract = await deployment.deployContract({
                name: types_1.EContracts.ZupassGroth16Verifier,
                signer: deployer,
            });
            verifier = await verifierContract.getAddress();
        }
        const ZupassGatekeeperContract = await deployment.deployContract({
            name: types_1.EContracts.ZupassGatekeeper,
            signer: deployer,
        }, validEventId, validSigner1, validSigner2, verifier);
        await storage.register({
            id: types_1.EContracts.ZupassGatekeeper,
            contract: ZupassGatekeeperContract,
            args: [validEventId.toString(), validSigner1, validSigner2, verifier],
            network: hre.network.name,
        });
    }
    if (!skipDeploySemaphoreGatekeeper) {
        const semaphoreContractAddress = deployment.getDeployConfigField(types_1.EContracts.SemaphoreGatekeeper, "semaphoreContract", true);
        const groupId = deployment.getDeployConfigField(types_1.EContracts.SemaphoreGatekeeper, "groupId", true);
        const semaphoreGatekeeperContract = await deployment.deployContract({
            name: types_1.EContracts.SemaphoreGatekeeper,
            signer: deployer,
        }, semaphoreContractAddress, groupId);
        await storage.register({
            id: types_1.EContracts.SemaphoreGatekeeper,
            contract: semaphoreGatekeeperContract,
            args: [semaphoreContractAddress, groupId.toString()],
            network: hre.network.name,
        });
    }
    if (!skipDeployHatsGatekeeper) {
        // get args
        const criterionHats = deployment.getDeployConfigField(types_1.EContracts.HatsGatekeeper, "criterionHats", true);
        const hatsProtocolAddress = deployment.getDeployConfigField(types_1.EContracts.HatsGatekeeper, "hatsProtocolAddress", true);
        let hatsGatekeeperContract;
        // if we have one we use the single gatekeeper
        if (criterionHats.length === 1) {
            hatsGatekeeperContract = await deployment.deployContract({
                name: types_1.EContracts.HatsGatekeeperSingle,
                signer: deployer,
            }, hatsProtocolAddress, criterionHats[0]);
        }
        else {
            hatsGatekeeperContract = await deployment.deployContract({
                name: types_1.EContracts.HatsGatekeeperMultiple,
                signer: deployer,
            }, hatsProtocolAddress, criterionHats);
        }
        await storage.register({
            id: types_1.EContracts.HatsGatekeeper,
            contract: hatsGatekeeperContract,
            args: [hatsProtocolAddress, criterionHats.length === 1 ? criterionHats[0] : criterionHats],
            network: hre.network.name,
        });
    }
    if (!skipDeployMerkleProofGatekeeper) {
        const root = deployment.getDeployConfigField(types_1.EContracts.MerkleProofGatekeeper, "root", true);
        const MerkleProofGatekeeperContract = await deployment.deployContract({
            name: types_1.EContracts.MerkleProofGatekeeper,
            signer: deployer,
        }, root);
        await storage.register({
            id: types_1.EContracts.MerkleProofGatekeeper,
            contract: MerkleProofGatekeeperContract,
            args: [root],
            network: hre.network.name,
        });
    }
}));
//# sourceMappingURL=02-gatekeepers.js.map