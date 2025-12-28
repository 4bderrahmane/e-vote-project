"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.genLocalState = void 0;
const ethers_1 = require("ethers");
const maci_contracts_1 = require("maci-contracts");
const maci_domainobjs_1 = require("maci-domainobjs");
const fs_1 = __importDefault(require("fs"));
const utils_1 = require("../utils");
/**
 * Generate a local MACI state from the smart contracts events
 * @param GenLocalStateArgs - The arguments for the genLocalState command
 */
const genLocalState = async ({ outputPath, pollId, maciAddress, coordinatorPrivateKey, ethereumProvider, endBlock, startBlock, blockPerBatch, transactionHash, sleep, signer, quiet = true, }) => {
    (0, utils_1.banner)(quiet);
    const network = await signer.provider?.getNetwork();
    // validation of the maci contract address
    const maciContractAddress = maciAddress || (await (0, utils_1.readContractAddress)("MACI", network?.name));
    if (!maciContractAddress) {
        (0, utils_1.logError)("MACI contract address is empty");
    }
    if (!(await (0, utils_1.contractExists)(signer.provider, maciContractAddress))) {
        (0, utils_1.logError)("MACI contract does not exist");
    }
    // if no private key is passed we ask it securely
    const coordPrivKey = coordinatorPrivateKey || (await (0, utils_1.promptSensitiveValue)("Insert your MACI private key"));
    if (!maci_domainobjs_1.PrivKey.isValidSerializedPrivKey(coordPrivKey)) {
        (0, utils_1.logError)("Invalid MACI private key");
    }
    const coordinatorMaciPrivKey = maci_domainobjs_1.PrivKey.deserialize(coordPrivKey);
    const coordinatorKeypair = new maci_domainobjs_1.Keypair(coordinatorMaciPrivKey);
    const maciContract = maci_contracts_1.MACI__factory.connect(maciContractAddress, signer);
    const pollContracts = await maciContract.polls(pollId);
    if (!(await (0, utils_1.contractExists)(signer.provider, pollContracts.poll))) {
        (0, utils_1.logError)("Poll contract does not exist");
    }
    const pollContract = maci_contracts_1.Poll__factory.connect(pollContracts.poll, signer);
    const [{ messageAq }, { messageTreeDepth }] = await Promise.all([
        pollContract.extContracts(),
        pollContract.treeDepths(),
    ]);
    const messageAqContract = maci_contracts_1.AccQueue__factory.connect(messageAq, signer);
    const [defaultStartBlockSignup, defaultStartBlockPoll, stateRoot, numSignups, messageRoot] = await Promise.all([
        maciContract.queryFilter(maciContract.filters.SignUp(), startBlock).then((events) => events[0]?.blockNumber ?? 0),
        maciContract
            .queryFilter(maciContract.filters.DeployPoll(), startBlock)
            .then((events) => events[0]?.blockNumber ?? 0),
        maciContract.getStateTreeRoot(),
        maciContract.numSignUps(),
        messageAqContract.getMainRoot(messageTreeDepth),
    ]);
    const defaultStartBlock = Math.min(defaultStartBlockPoll, defaultStartBlockSignup);
    let fromBlock = startBlock ? Number(startBlock) : defaultStartBlock;
    const defaultEndBlock = await Promise.all([
        pollContract
            .queryFilter(pollContract.filters.MergeMessageAq(messageRoot), fromBlock)
            .then((events) => events[events.length - 1]?.blockNumber),
        pollContract
            .queryFilter(pollContract.filters.MergeMaciState(stateRoot, numSignups), fromBlock)
            .then((events) => events[events.length - 1]?.blockNumber),
    ]).then((blocks) => Math.max(...blocks));
    if (transactionHash) {
        const tx = await signer.provider.getTransaction(transactionHash);
        fromBlock = tx?.blockNumber ?? defaultStartBlock;
    }
    // calculate the end block number
    const endBlockNumber = endBlock || defaultEndBlock;
    if (transactionHash) {
        const tx = await signer.provider.getTransaction(transactionHash);
        fromBlock = tx?.blockNumber ?? defaultStartBlock;
    }
    const provider = ethereumProvider ? new ethers_1.JsonRpcProvider(ethereumProvider) : signer.provider;
    (0, utils_1.logYellow)(quiet, (0, utils_1.info)(`Fetching logs from ${fromBlock} till ${endBlockNumber} and generating the offline maci state`));
    const maciState = await (0, maci_contracts_1.genMaciStateFromContract)(provider, maciContractAddress, coordinatorKeypair, pollId, fromBlock, blockPerBatch || 50, endBlockNumber, sleep);
    // write the state to a file
    const serializedState = maciState.toJSON();
    await fs_1.default.promises.writeFile(outputPath, JSON.stringify(serializedState, null, 4));
    (0, utils_1.logGreen)(quiet, (0, utils_1.success)(`The state has been written to ${outputPath}`));
};
exports.genLocalState = genLocalState;
//# sourceMappingURL=genLocalState.js.map