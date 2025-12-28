"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deployPoll = void 0;
const maci_contracts_1 = require("maci-contracts");
const maci_domainobjs_1 = require("maci-domainobjs");
const utils_1 = require("../utils");
/**
 * Deploy a new Poll for the set of MACI's contracts already deployed
 * @param DeployPollArgs - The arguments for the deployPoll command
 * @returns The addresses of the deployed contracts
 */
const deployPoll = async ({ pollDuration, intStateTreeDepth, messageTreeSubDepth, messageTreeDepth, voteOptionTreeDepth, coordinatorPubkey, maciAddress, vkRegistryAddress, signer, quiet = true, useQuadraticVoting = false, }) => {
    (0, utils_1.banner)(quiet);
    const network = await signer.provider?.getNetwork();
    // check if we have a vkRegistry already deployed or passed as arg
    const vkRegistryContractAddress = await (0, utils_1.readContractAddress)("VkRegistry", network?.name);
    if (!vkRegistryContractAddress && !vkRegistryAddress) {
        (0, utils_1.logError)("Please provide a VkRegistry contract address");
    }
    const vkRegistry = vkRegistryAddress || vkRegistryContractAddress;
    const maciContractAddress = await (0, utils_1.readContractAddress)("MACI", network?.name);
    if (!maciContractAddress && !maciAddress) {
        (0, utils_1.logError)("Please provide a MACI contract address");
    }
    const maci = maciAddress || maciContractAddress;
    // required arg -> poll duration
    if (pollDuration <= 0) {
        (0, utils_1.logError)("Duration cannot be <= 0");
    }
    // required arg -> int state tree depth
    if (intStateTreeDepth <= 0) {
        (0, utils_1.logError)("Int state tree depth cannot be <= 0");
    }
    // required arg -> message tree sub depth
    if (messageTreeSubDepth <= 0) {
        (0, utils_1.logError)("Message tree sub depth cannot be <= 0");
    }
    // required arg -> message tree depth
    if (messageTreeDepth <= 0) {
        (0, utils_1.logError)("Message tree depth cannot be <= 0");
    }
    // required arg -> vote option tree depth
    if (voteOptionTreeDepth <= 0) {
        (0, utils_1.logError)("Vote option tree depth cannot be <= 0");
    }
    // we check that the contract is deployed
    if (!(await (0, utils_1.contractExists)(signer.provider, maci))) {
        (0, utils_1.logError)("MACI contract does not exist");
    }
    // we check that the coordinator's public key is valid
    if (!maci_domainobjs_1.PubKey.isValidSerializedPubKey(coordinatorPubkey)) {
        (0, utils_1.logError)("Invalid MACI public key");
    }
    const unserializedKey = maci_domainobjs_1.PubKey.deserialize(coordinatorPubkey);
    // get the verifier contract
    const verifierContractAddress = await (0, utils_1.readContractAddress)("Verifier", network?.name);
    const maciContract = maci_contracts_1.MACI__factory.connect(maci, signer);
    // deploy the poll
    let pollAddr = "";
    let messageProcessorContractAddress = "";
    let tallyContractAddress = "";
    try {
        // deploy the poll contract via the maci contract
        const tx = await maciContract.deployPoll(pollDuration, {
            intStateTreeDepth,
            messageTreeSubDepth,
            messageTreeDepth,
            voteOptionTreeDepth,
        }, unserializedKey.asContractParam(), verifierContractAddress, vkRegistry, useQuadraticVoting ? maci_contracts_1.EMode.QV : maci_contracts_1.EMode.NON_QV, { gasLimit: 10000000 });
        const receipt = await tx.wait();
        if (receipt?.status !== 1) {
            (0, utils_1.logError)("Deploy poll transaction is failed");
        }
        const iface = maciContract.interface;
        const receiptLog = receipt.logs[receipt.logs.length - 1];
        // parse DeployPoll log
        const log = iface.parseLog(receiptLog);
        // we are trying to get the poll id from the event logs
        // if we do not find this log then we throw
        if (log.name !== "DeployPoll") {
            (0, utils_1.logError)("Invalid event log");
        }
        // eslint-disable-next-line no-underscore-dangle
        const pollId = log.args._pollId;
        const pollContracts = await maciContract.getPoll(pollId);
        pollAddr = pollContracts.poll;
        messageProcessorContractAddress = pollContracts.messageProcessor;
        tallyContractAddress = pollContracts.tally;
        (0, utils_1.logGreen)(quiet, (0, utils_1.info)(`Poll ID: ${pollId.toString()}`));
        (0, utils_1.logGreen)(quiet, (0, utils_1.info)(`Poll contract: ${pollAddr}`));
        (0, utils_1.logGreen)(quiet, (0, utils_1.info)(`Message Processor contract: ${messageProcessorContractAddress}`));
        (0, utils_1.logGreen)(quiet, (0, utils_1.info)(`Tally contract: ${tallyContractAddress}`));
        // store the address
        await (0, utils_1.storeContractAddress)(`MessageProcessor-${pollId.toString()}`, messageProcessorContractAddress, network?.name);
        await (0, utils_1.storeContractAddress)(`Tally-${pollId.toString()}`, tallyContractAddress, network?.name);
        await (0, utils_1.storeContractAddress)(`Poll-${pollId.toString()}`, pollAddr, network?.name);
    }
    catch (error) {
        (0, utils_1.logError)(error.message);
    }
    // we return all of the addresses
    return {
        messageProcessor: messageProcessorContractAddress,
        tally: tallyContractAddress,
        poll: pollAddr,
    };
};
exports.deployPoll = deployPoll;
//# sourceMappingURL=deployPoll.js.map