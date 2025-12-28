"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deploy = void 0;
const maci_contracts_1 = require("maci-contracts");
const utils_1 = require("../utils");
/**
 * Deploy MACI and related contracts
 * @param DeployArgs - The arguments for the deploy command
 * @returns The addresses of the deployed contracts
 */
const deploy = async ({ stateTreeDepth, initialVoiceCredits, initialVoiceCreditsProxyAddress, signupGatekeeperAddress, poseidonT3Address, poseidonT4Address, poseidonT5Address, poseidonT6Address, signer, quiet = true, }) => {
    (0, utils_1.banner)(quiet);
    if (initialVoiceCreditsProxyAddress && initialVoiceCredits) {
        (0, utils_1.logError)("Please provide either an initialVoiceCreditProxyAddress or initialVoiceCredits, not both");
    }
    const network = await signer.provider?.getNetwork();
    const poseidonT3 = poseidonT3Address || (await (0, utils_1.readContractAddress)("PoseidonT3", network?.name));
    const poseidonT4 = poseidonT4Address || (await (0, utils_1.readContractAddress)("PoseidonT4", network?.name));
    const poseidonT5 = poseidonT5Address || (await (0, utils_1.readContractAddress)("PoseidonT5", network?.name));
    const poseidonT6 = poseidonT6Address || (await (0, utils_1.readContractAddress)("PoseidonT6", network?.name));
    // if we did not deploy it before, then deploy it now
    let initialVoiceCreditProxyContractAddress = initialVoiceCreditsProxyAddress || (await (0, utils_1.readContractAddress)("InitialVoiceCreditProxy", network?.name));
    if (!initialVoiceCreditsProxyAddress) {
        const contract = await (0, maci_contracts_1.deployConstantInitialVoiceCreditProxy)(initialVoiceCredits || utils_1.DEFAULT_INITIAL_VOICE_CREDITS, signer, true);
        initialVoiceCreditProxyContractAddress = await contract.getAddress();
    }
    // check if we have a signupGatekeeper already deployed or passed as arg
    let signupGatekeeperContractAddress = signupGatekeeperAddress || (await (0, utils_1.readContractAddress)("SignUpGatekeeper", network?.name));
    if (!signupGatekeeperContractAddress) {
        const contract = await (0, maci_contracts_1.deployFreeForAllSignUpGatekeeper)(signer, true);
        signupGatekeeperContractAddress = await contract.getAddress();
    }
    // deploy a verifier contract
    const verifierContract = await (0, maci_contracts_1.deployVerifier)(signer, true);
    const verifierContractAddress = await verifierContract.getAddress();
    // deploy MACI, stateAq, PollFactory and poseidon
    const { maciContract, pollFactoryContract, poseidonAddrs } = await (0, maci_contracts_1.deployMaci)({
        signUpTokenGatekeeperContractAddress: signupGatekeeperContractAddress,
        initialVoiceCreditBalanceAddress: initialVoiceCreditProxyContractAddress,
        poseidonAddresses: {
            poseidonT3,
            poseidonT4,
            poseidonT5,
            poseidonT6,
        },
        signer,
        stateTreeDepth,
        quiet: true,
    });
    const [maciContractAddress, pollFactoryContractAddress] = await Promise.all([
        maciContract.getAddress(),
        pollFactoryContract.getAddress(),
    ]);
    // save to the JSON File
    await (0, utils_1.storeContractAddress)("InitialVoiceCreditProxy", initialVoiceCreditProxyContractAddress, network?.name);
    await (0, utils_1.storeContractAddress)("SignUpGatekeeper", signupGatekeeperContractAddress, network?.name);
    await (0, utils_1.storeContractAddress)("Verifier", verifierContractAddress, network?.name);
    await (0, utils_1.storeContractAddress)("MACI", maciContractAddress, network?.name);
    await (0, utils_1.storeContractAddress)("PollFactory", pollFactoryContractAddress, network?.name);
    await (0, utils_1.storeContractAddress)("PoseidonT3", poseidonAddrs.poseidonT3, network?.name);
    await (0, utils_1.storeContractAddress)("PoseidonT4", poseidonAddrs.poseidonT4, network?.name);
    await (0, utils_1.storeContractAddress)("PoseidonT5", poseidonAddrs.poseidonT5, network?.name);
    await (0, utils_1.storeContractAddress)("PoseidonT6", poseidonAddrs.poseidonT6, network?.name);
    (0, utils_1.logGreen)(quiet, (0, utils_1.success)(`MACI deployed at:  ${maciContractAddress}`));
    // return all addresses
    return {
        maciAddress: maciContractAddress,
        pollFactoryAddress: pollFactoryContractAddress,
        verifierAddress: verifierContractAddress,
        poseidonT3Address: poseidonAddrs.poseidonT3,
        poseidonT4Address: poseidonAddrs.poseidonT4,
        poseidonT5Address: poseidonAddrs.poseidonT5,
        poseidonT6Address: poseidonAddrs.poseidonT6,
        signUpGatekeeperAddress: signupGatekeeperContractAddress,
        initialVoiceCreditProxyAddress: initialVoiceCreditProxyContractAddress,
    };
};
exports.deploy = deploy;
//# sourceMappingURL=deploy.js.map