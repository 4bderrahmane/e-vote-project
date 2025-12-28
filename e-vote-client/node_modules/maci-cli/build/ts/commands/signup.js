"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMerkleProofGatekeeperData = exports.getHatsSingleGatekeeperData = exports.getEASGatekeeperData = exports.getZupassGatekeeperData = exports.getSemaphoreGatekeeperData = exports.getGatekeeperTrait = exports.isRegisteredUser = exports.signup = void 0;
const ethers_1 = require("ethers");
const typechain_types_1 = require("maci-contracts/typechain-types");
const maci_domainobjs_1 = require("maci-domainobjs");
const banner_1 = require("../utils/banner");
const contracts_1 = require("../utils/contracts");
const defaults_1 = require("../utils/defaults");
const theme_1 = require("../utils/theme");
/**
 * Signup a user to the MACI contract
 * @param {SignupArgs} args - The arguments for the signup command
 * @returns {ISignupData} The state index of the user and transaction hash
 */
const signup = async ({ maciPubKey, maciAddress, sgDataArg, ivcpDataArg, signer, quiet = true, }) => {
    (0, banner_1.banner)(quiet);
    // validate user key
    if (!maci_domainobjs_1.PubKey.isValidSerializedPubKey(maciPubKey)) {
        (0, theme_1.logError)("Invalid MACI public key");
    }
    const userMaciPubKey = maci_domainobjs_1.PubKey.deserialize(maciPubKey);
    if (!(await (0, contracts_1.contractExists)(signer.provider, maciAddress))) {
        (0, theme_1.logError)("There is no contract deployed at the specified address");
    }
    const sgData = sgDataArg || defaults_1.DEFAULT_SG_DATA;
    const ivcpData = ivcpDataArg || defaults_1.DEFAULT_IVCP_DATA;
    // we validate that the signup data and voice credit data is valid
    if (!(0, ethers_1.isBytesLike)(sgData)) {
        (0, theme_1.logError)("invalid signup gateway data");
    }
    if (!(0, ethers_1.isBytesLike)(ivcpData)) {
        (0, theme_1.logError)("invalid initial voice credit proxy data");
    }
    const maciContract = typechain_types_1.MACI__factory.connect(maciAddress, signer);
    let stateIndex = "";
    let voiceCredits = "";
    let receipt = null;
    try {
        // sign up to the MACI contract
        const tx = await maciContract.signUp(userMaciPubKey.asContractParam(), sgData, ivcpData);
        receipt = await tx.wait();
        (0, theme_1.logYellow)(quiet, (0, theme_1.info)(`Transaction hash: ${tx.hash}`));
        if (receipt?.status !== 1) {
            (0, theme_1.logError)("The transaction failed");
        }
        const iface = maciContract.interface;
        // get state index from the event
        if (receipt?.logs) {
            const [log] = receipt.logs;
            const { args } = iface.parseLog(log) || { args: [] };
            [stateIndex, , , voiceCredits] = args;
            (0, theme_1.logGreen)(quiet, (0, theme_1.success)(`State index: ${stateIndex.toString()}`));
        }
        else {
            (0, theme_1.logError)("Unable to retrieve the transaction receipt");
        }
    }
    catch (error) {
        (0, theme_1.logError)(error.message);
    }
    return {
        stateIndex: stateIndex ? stateIndex.toString() : "",
        voiceCredits: voiceCredits ? Number.parseInt(voiceCredits, 10) : 0,
        hash: receipt.hash,
    };
};
exports.signup = signup;
/**
 * Parse the signup events from the MACI contract
 */
const parseSignupEvents = async ({ maciContract, startBlock, currentBlock, publicKey }) => {
    // 1000 blocks at a time
    for (let block = startBlock; block <= currentBlock; block += 1000) {
        const toBlock = Math.min(block + 999, currentBlock);
        // eslint-disable-next-line no-await-in-loop
        const newEvents = await maciContract.queryFilter(maciContract.filters.SignUp(undefined, publicKey.rawPubKey[0], publicKey.rawPubKey[1]), block, toBlock);
        if (newEvents.length > 0) {
            const [event] = newEvents;
            return {
                stateIndex: event.args[0].toString(),
                voiceCredits: event.args[3].toString(),
            };
        }
    }
    return {
        stateIndex: undefined,
        voiceCredits: undefined,
    };
};
/**
 * Checks if user is registered with public key
 * @param IRegisteredArgs - The arguments for the register check command
 * @returns user registered or not and state index, voice credit balance
 */
const isRegisteredUser = async ({ maciAddress, maciPubKey, signer, startBlock, quiet = true, }) => {
    (0, banner_1.banner)(quiet);
    const maciContract = typechain_types_1.MACI__factory.connect(maciAddress, signer);
    const publicKey = maci_domainobjs_1.PubKey.deserialize(maciPubKey);
    const startBlockNumber = startBlock || 0;
    const currentBlock = await signer.provider.getBlockNumber();
    const { stateIndex, voiceCredits } = await parseSignupEvents({
        maciContract,
        startBlock: startBlockNumber,
        currentBlock,
        publicKey,
    });
    (0, theme_1.logGreen)(quiet, (0, theme_1.success)(`State index: ${stateIndex?.toString()}, registered: ${stateIndex !== undefined}`));
    return {
        isRegistered: stateIndex !== undefined,
        stateIndex,
        voiceCredits,
    };
};
exports.isRegisteredUser = isRegisteredUser;
/**
 * Get the gatekeeper type of the MACI contract
 * @param IGetGatekeeperTraitArgs - The arguments for the get gatekeeper type command
 * @returns The gatekeeper type
 */
const getGatekeeperTrait = async ({ maciAddress, signer, }) => {
    const maciContract = typechain_types_1.MACI__factory.connect(maciAddress, signer);
    // get the address of the signup gatekeeper
    const gatekeeperContractAddress = await maciContract.signUpGatekeeper();
    const gatekeeperContract = typechain_types_1.SignUpGatekeeper__factory.connect(gatekeeperContractAddress, signer);
    const gatekeeperType = await gatekeeperContract.getTrait();
    return gatekeeperType;
};
exports.getGatekeeperTrait = getGatekeeperTrait;
/**
 * Get the semaphore gatekeeper data
 * @param IGetSemaphoreGatekeeperDataArgs - The arguments for the get semaphore gatekeeper data command
 * @returns The semaphore gatekeeper data
 */
const getSemaphoreGatekeeperData = async ({ maciAddress, signer, }) => {
    const maciContract = typechain_types_1.MACI__factory.connect(maciAddress, signer);
    // get the address of the signup gatekeeper
    const gatekeeperContractAddress = await maciContract.signUpGatekeeper();
    const gatekeeperContract = typechain_types_1.SemaphoreGatekeeper__factory.connect(gatekeeperContractAddress, signer);
    // get the group ID and semaphore contract address
    const [groupId, semaphoreContractAddress] = await Promise.all([
        gatekeeperContract.groupId(),
        gatekeeperContract.semaphoreContract(),
    ]);
    return {
        address: semaphoreContractAddress,
        groupId: groupId.toString(),
    };
};
exports.getSemaphoreGatekeeperData = getSemaphoreGatekeeperData;
/**
 * Get the zupass gatekeeper data
 * @param IGetGatekeeperDataArgs - The arguments for the get zupass gatekeeper data command
 * @returns The zupass gatekeeper data
 */
const getZupassGatekeeperData = async ({ maciAddress, signer, }) => {
    const maciContract = typechain_types_1.MACI__factory.connect(maciAddress, signer);
    // get the address of the signup gatekeeper
    const gatekeeperContractAddress = await maciContract.signUpGatekeeper();
    const gatekeeperContract = typechain_types_1.ZupassGatekeeper__factory.connect(gatekeeperContractAddress, signer);
    const [validEventId, validSigner1, validSigner2] = await Promise.all([
        gatekeeperContract.validEventId(),
        gatekeeperContract.validSigner1(),
        gatekeeperContract.validSigner2(),
    ]);
    return {
        eventId: validEventId.toString(),
        signer1: validSigner1.toString(),
        signer2: validSigner2.toString(),
    };
};
exports.getZupassGatekeeperData = getZupassGatekeeperData;
/**
 * Get the EAS gatekeeper data
 * @param IGetGatekeeperDataArgs - The arguments for the get eas gatekeeper data command
 * @returns The eas gatekeeper data
 */
const getEASGatekeeperData = async ({ maciAddress, signer, }) => {
    const maciContract = typechain_types_1.MACI__factory.connect(maciAddress, signer);
    const gatekeeperContractAddress = await maciContract.signUpGatekeeper();
    const gatekeeperContract = typechain_types_1.EASGatekeeper__factory.connect(gatekeeperContractAddress, signer);
    const [eas, schema, attester] = await Promise.all([
        gatekeeperContract.eas(),
        gatekeeperContract.schema(),
        gatekeeperContract.attester(),
    ]);
    return {
        eas: eas.toString(),
        schema: schema.toString(),
        attester: attester.toString(),
    };
};
exports.getEASGatekeeperData = getEASGatekeeperData;
/**
 * Get the hats single gatekeeper data
 * @param IGetGatekeeperDataArgs - The arguments for the get hats single gatekeeper data command
 * @returns The hats single gatekeeper data
 */
const getHatsSingleGatekeeperData = async ({ maciAddress, signer, }) => {
    const maciContract = typechain_types_1.MACI__factory.connect(maciAddress, signer);
    const gatekeeperContractAddress = await maciContract.signUpGatekeeper();
    const gatekeeperContract = typechain_types_1.HatsGatekeeperSingle__factory.connect(gatekeeperContractAddress, signer);
    const [criterionHat, hatsContract] = await Promise.all([
        gatekeeperContract.criterionHat(),
        gatekeeperContract.hats(),
    ]);
    return {
        criterionHat: [criterionHat.toString()],
        hatsContract: hatsContract.toString(),
    };
};
exports.getHatsSingleGatekeeperData = getHatsSingleGatekeeperData;
/**
 * Get the merkleproof gatekeeper data
 * @param IGetGatekeeperDataArgs - The arguments for the get merkleproof gatekeeper data command
 * @returns The merkleproof gatekeeper data
 */
const getMerkleProofGatekeeperData = async ({ maciAddress, signer, }) => {
    const maciContract = typechain_types_1.MACI__factory.connect(maciAddress, signer);
    // get the address of the signup gatekeeper
    const gatekeeperContractAddress = await maciContract.signUpGatekeeper();
    const gatekeeperContract = typechain_types_1.MerkleProofGatekeeper__factory.connect(gatekeeperContractAddress, signer);
    const [validRoot] = await Promise.all([gatekeeperContract.root()]);
    return {
        root: validRoot.toString(),
    };
};
exports.getMerkleProofGatekeeperData = getMerkleProofGatekeeperData;
//# sourceMappingURL=signup.js.map