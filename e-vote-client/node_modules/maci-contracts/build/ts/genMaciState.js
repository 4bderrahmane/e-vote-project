"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.genMaciStateFromContract = void 0;
const maci_core_1 = require("maci-core");
const maci_domainobjs_1 = require("maci-domainobjs");
const assert_1 = __importDefault(require("assert"));
const typechain_types_1 = require("../typechain-types");
const utils_1 = require("./utils");
/**
 * Generate a MaciState object from the events of a MACI and Poll smart contracts
 * @param provider - the ethereum provider
 * @param address - the address of the MACI contract
 * @param coordinatorKeypair - the keypair of the coordinator
 * @param pollId - the id of the poll for which we are fetching events
 * @param fromBlock - the block number from which to start fetching events
 * @param blocksPerRequest - the number of blocks to fetch in each request
 * @param endBlock - the block number at which to stop fetching events
 * @param sleepAmount - the amount of time to sleep between each request
 * @returns an instance of MaciState
 */
const genMaciStateFromContract = async (provider, address, coordinatorKeypair, pollId, fromBlock = 0, blocksPerRequest = 50, endBlock = undefined, sleepAmount = undefined) => {
    // ensure the pollId is valid
    (0, assert_1.default)(pollId >= 0);
    const maciContract = typechain_types_1.MACI__factory.connect(address, provider);
    // Check stateTreeDepth
    const stateTreeDepth = await maciContract.stateTreeDepth();
    // we need to pass the stateTreeDepth
    const maciState = new maci_core_1.MaciState(Number(stateTreeDepth));
    // ensure it is set correctly
    (0, assert_1.default)(stateTreeDepth === BigInt(maciState.stateTreeDepth));
    // if no last block is set then we fetch until the current block number
    const lastBlock = endBlock || (await provider.getBlockNumber());
    const actions = [];
    const foundPollIds = new Set();
    const pollContractAddresses = new Map();
    // Fetch event logs in batches (lastBlock inclusive)
    for (let i = fromBlock; i <= lastBlock; i += blocksPerRequest + 1) {
        // the last block batch will be either current iteration block + blockPerRequest
        // or the end block if it is set
        const toBlock = i + blocksPerRequest >= lastBlock ? lastBlock : i + blocksPerRequest;
        const [signUpLogs, deployPollLogs] = 
        // eslint-disable-next-line no-await-in-loop
        await Promise.all([
            maciContract.queryFilter(maciContract.filters.SignUp(), i, toBlock),
            maciContract.queryFilter(maciContract.filters.DeployPoll(), i, toBlock),
        ]);
        signUpLogs.forEach((event) => {
            (0, assert_1.default)(!!event);
            actions.push({
                type: "SignUp",
                blockNumber: event.blockNumber,
                transactionIndex: event.transactionIndex,
                data: {
                    stateIndex: Number(event.args._stateIndex),
                    pubKey: new maci_domainobjs_1.PubKey([BigInt(event.args._userPubKeyX), BigInt(event.args._userPubKeyY)]),
                    voiceCreditBalance: Number(event.args._voiceCreditBalance),
                    timestamp: Number(event.args._timestamp),
                },
            });
        });
        // eslint-disable-next-line @typescript-eslint/prefer-for-of
        for (let j = 0; j < deployPollLogs.length; j += 1) {
            const event = deployPollLogs[j];
            (0, assert_1.default)(!!event);
            const id = event.args._pollId;
            const pubKey = new maci_domainobjs_1.PubKey([BigInt(event.args._coordinatorPubKeyX), BigInt(event.args._coordinatorPubKeyY)]);
            // eslint-disable-next-line no-await-in-loop
            const pollContracts = await maciContract.getPoll(id);
            actions.push({
                type: "DeployPoll",
                blockNumber: event.blockNumber,
                transactionIndex: event.transactionIndex,
                data: { pollId: id, pollAddr: pollContracts.poll, pubKey },
            });
            foundPollIds.add(Number(id));
            pollContractAddresses.set(BigInt(id), pollContracts.poll);
        }
        if (sleepAmount) {
            // eslint-disable-next-line no-await-in-loop
            await (0, utils_1.sleep)(sleepAmount);
        }
    }
    // Check whether each pollId exists
    (0, assert_1.default)(foundPollIds.has(Number(pollId)), "Error: the specified pollId does not exist on-chain");
    const pollContractAddress = pollContractAddresses.get(pollId);
    const pollContract = typechain_types_1.Poll__factory.connect(pollContractAddress, provider);
    const [coordinatorPubKeyHashOnChain, [deployTime, duration], onChainTreeDepths] = await Promise.all([
        pollContract.coordinatorPubKeyHash(),
        pollContract.getDeployTimeAndDuration().then((values) => values.map(Number)),
        pollContract.treeDepths(),
    ]);
    (0, assert_1.default)(coordinatorKeypair.pubKey.hash().toString() === coordinatorPubKeyHashOnChain.toString());
    const treeDepths = {
        intStateTreeDepth: Number(onChainTreeDepths.intStateTreeDepth),
        messageTreeDepth: Number(onChainTreeDepths.messageTreeDepth),
        messageTreeSubDepth: Number(onChainTreeDepths.messageTreeSubDepth),
        voteOptionTreeDepth: Number(onChainTreeDepths.voteOptionTreeDepth),
    };
    const batchSizes = {
        tallyBatchSize: maci_core_1.STATE_TREE_ARITY ** Number(onChainTreeDepths.intStateTreeDepth),
        messageBatchSize: maci_core_1.MESSAGE_TREE_ARITY ** Number(onChainTreeDepths.messageTreeSubDepth),
    };
    // fetch poll contract logs
    for (let i = fromBlock; i <= lastBlock; i += blocksPerRequest + 1) {
        const toBlock = i + blocksPerRequest >= lastBlock ? lastBlock : i + blocksPerRequest;
        const [publishMessageLogs, mergeMessageAqLogs,
        // eslint-disable-next-line no-await-in-loop
        ] = await Promise.all([
            pollContract.queryFilter(pollContract.filters.PublishMessage(), i, toBlock),
            pollContract.queryFilter(pollContract.filters.MergeMessageAq(), i, toBlock),
        ]);
        publishMessageLogs.forEach((event) => {
            (0, assert_1.default)(!!event);
            const message = new maci_domainobjs_1.Message(event.args._message[0].map((x) => BigInt(x)));
            const encPubKey = new maci_domainobjs_1.PubKey(event.args._encPubKey.map((x) => BigInt(x.toString())));
            actions.push({
                type: "PublishMessage",
                blockNumber: event.blockNumber,
                transactionIndex: event.transactionIndex,
                data: {
                    message,
                    encPubKey,
                },
            });
        });
        mergeMessageAqLogs.forEach((event) => {
            (0, assert_1.default)(!!event);
            const messageRoot = BigInt(event.args._messageRoot);
            actions.push({
                type: "MergeMessageAq",
                blockNumber: event.blockNumber,
                transactionIndex: event.transactionIndex,
                data: { messageRoot },
            });
        });
        if (sleepAmount) {
            // eslint-disable-next-line no-await-in-loop
            await (0, utils_1.sleep)(sleepAmount);
        }
    }
    // Reconstruct MaciState in order
    (0, utils_1.sortActions)(actions).forEach((action) => {
        switch (true) {
            case action.type === "SignUp": {
                const { pubKey, voiceCreditBalance, timestamp } = action.data;
                maciState.signUp(pubKey, BigInt(voiceCreditBalance), BigInt(timestamp));
                break;
            }
            case action.type === "DeployPoll" && action.data.pollId?.toString() === pollId.toString(): {
                maciState.deployPoll(BigInt(deployTime + duration), treeDepths, batchSizes.messageBatchSize, coordinatorKeypair);
                break;
            }
            case action.type === "DeployPoll" && action.data.pollId?.toString() !== pollId.toString(): {
                maciState.deployNullPoll();
                break;
            }
            case action.type === "PublishMessage": {
                const { encPubKey, message } = action.data;
                maciState.polls.get(pollId)?.publishMessage(message, encPubKey);
                break;
            }
            // ensure that the message root is correct (i.e. all messages have been published offchain)
            case action.type === "MergeMessageAq": {
                (0, assert_1.default)(maciState.polls.get(pollId)?.messageTree.root.toString() === action.data.messageRoot?.toString());
                break;
            }
            default:
                break;
        }
    });
    // Set numSignUps
    const numSignUpsAndMessages = await pollContract.numSignUpsAndMessages();
    const poll = maciState.polls.get(pollId);
    // ensure all messages were recorded
    (0, assert_1.default)(Number(numSignUpsAndMessages[1]) === poll?.messages.length);
    // set the number of signups
    poll.updatePoll(numSignUpsAndMessages[0]);
    // we need to ensure that the stateRoot is correct
    (0, assert_1.default)(poll.stateTree?.root.toString() === (await pollContract.mergedStateRoot()).toString());
    maciState.polls.set(pollId, poll);
    return maciState;
};
exports.genMaciStateFromContract = genMaciStateFromContract;
//# sourceMappingURL=genMaciState.js.map