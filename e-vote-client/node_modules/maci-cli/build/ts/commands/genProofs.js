"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.genProofs = void 0;
const maci_circuits_1 = require("maci-circuits");
const maci_contracts_1 = require("maci-contracts");
const maci_core_1 = require("maci-core");
const maci_crypto_1 = require("maci-crypto");
const maci_domainobjs_1 = require("maci-domainobjs");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const utils_1 = require("../utils");
/**
 * Generate proofs for the message processing and tally calculations
 * @note see different options for zkey files to use specific circuits https://maci.pse.dev/docs/trusted-setup, https://maci.pse.dev/docs/testing/#pre-compiled-artifacts-for-testing
 * @param GenProofsArgs - The arguments for the genProofs command
 * @returns The tally data
 */
const genProofs = async ({ outputDir, tallyFile, tallyZkey, processZkey, pollId, rapidsnark, processWitgen, processDatFile, tallyWitgen, tallyDatFile, coordinatorPrivKey, maciAddress, transactionHash, processWasm, tallyWasm, useWasm, stateFile, startBlock, blocksPerBatch, endBlock, signer, useQuadraticVoting = true, quiet = true, }) => {
    (0, utils_1.banner)(quiet);
    // if we do not have the output directory just create it
    const isOutputDirExists = fs_1.default.existsSync(outputDir);
    if (!isOutputDirExists) {
        // Create the directory
        await fs_1.default.promises.mkdir(outputDir);
    }
    // differentiate whether we are using wasm or rapidsnark
    if (useWasm) {
        // if no rapidsnark then we assume we go with wasm
        // so we expect those arguments
        if (!processWasm) {
            (0, utils_1.logError)("Please specify the process wasm file location");
        }
        if (!tallyWasm) {
            (0, utils_1.logError)("Please specify the tally wasm file location");
        }
        const wasmResult = (0, utils_1.doesPathExist)([processWasm, tallyWasm]);
        if (!wasmResult[0]) {
            (0, utils_1.logError)(`Could not find ${wasmResult[1]}.`);
        }
    }
    else {
        if (!rapidsnark) {
            (0, utils_1.logError)("Please specify the rapidsnark file location");
        }
        if (!processWitgen) {
            (0, utils_1.logError)("Please specify the process witgen file location");
        }
        if (!tallyWitgen) {
            (0, utils_1.logError)("Please specify the tally witgen file location");
        }
        const witgenResult = (0, utils_1.doesPathExist)([rapidsnark, processWitgen, tallyWitgen, processDatFile, tallyDatFile]);
        if (!witgenResult[0]) {
            (0, utils_1.logError)(`Could not find ${witgenResult[1]}.`);
        }
    }
    // check if zkeys were provided
    const zkResult = (0, utils_1.doesPathExist)([processZkey, tallyZkey]);
    if (!zkResult[0]) {
        (0, utils_1.logError)(`Could not find ${zkResult[1]}.`);
    }
    // extract the rest of the verifying keys
    const processVk = await (0, maci_circuits_1.extractVk)(processZkey);
    const tallyVk = await (0, maci_circuits_1.extractVk)(tallyZkey);
    // the coordinator's MACI private key
    const privateKey = coordinatorPrivKey || (await (0, utils_1.promptSensitiveValue)("Insert your MACI private key"));
    if (!maci_domainobjs_1.PrivKey.isValidSerializedPrivKey(privateKey)) {
        (0, utils_1.logError)("Invalid MACI private key");
    }
    const maciPrivKey = maci_domainobjs_1.PrivKey.deserialize(privateKey);
    const coordinatorKeypair = new maci_domainobjs_1.Keypair(maciPrivKey);
    const network = await signer.provider?.getNetwork();
    // contracts
    const maciContractAddress = maciAddress || (await (0, utils_1.readContractAddress)("MACI", network?.name));
    if (!maciContractAddress) {
        (0, utils_1.logError)("MACI contract address is empty");
    }
    if (!(await (0, utils_1.contractExists)(signer.provider, maciContractAddress))) {
        (0, utils_1.logError)("MACI contract does not exist");
    }
    if (pollId < 0) {
        (0, utils_1.logError)("Invalid poll id");
    }
    const maciContract = maci_contracts_1.MACI__factory.connect(maciContractAddress, signer);
    const pollContracts = await maciContract.polls(pollId);
    if (!(await (0, utils_1.contractExists)(signer.provider, pollContracts.poll))) {
        (0, utils_1.logError)("Poll contract does not exist");
    }
    const pollContract = maci_contracts_1.Poll__factory.connect(pollContracts.poll, signer);
    const extContracts = await pollContract.extContracts();
    const messageAqContractAddr = extContracts.messageAq;
    const messageAqContract = maci_contracts_1.AccQueue__factory.connect(messageAqContractAddr, signer);
    // Check that the state and message trees have been merged
    if (!(await pollContract.stateMerged())) {
        (0, utils_1.logError)("The state tree has not been merged yet. Please use the mergeSignups subcommand to do so.");
    }
    const messageTreeDepth = Number((await pollContract.treeDepths()).messageTreeDepth);
    // check that the main root is set
    const mainRoot = (await messageAqContract.getMainRoot(messageTreeDepth.toString())).toString();
    if (mainRoot === "0") {
        (0, utils_1.logError)("The message tree has not been merged yet. Please use the mergeMessages subcommand to do so.");
    }
    let maciState;
    if (stateFile) {
        const content = JSON.parse(await fs_1.default.promises.readFile(stateFile).then((res) => res.toString()));
        const serializedPrivateKey = maciPrivKey.serialize();
        try {
            maciState = maci_core_1.MaciState.fromJSON(content);
            maciState.polls.forEach((poll) => {
                poll.setCoordinatorKeypair(serializedPrivateKey);
            });
        }
        catch (error) {
            (0, utils_1.logError)(error.message);
        }
    }
    else {
        // build an off-chain representation of the MACI contract using data in the contract storage
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
        (0, utils_1.logYellow)(quiet, (0, utils_1.info)(`starting to fetch logs from block ${fromBlock}`));
        maciState = await (0, maci_contracts_1.genMaciStateFromContract)(signer.provider, await maciContract.getAddress(), coordinatorKeypair, pollId, fromBlock, blocksPerBatch, endBlock || defaultEndBlock);
    }
    const poll = maciState.polls.get(pollId);
    const processProofs = [];
    const tallyProofs = [];
    // time how long it takes
    const startTime = Date.now();
    (0, utils_1.logYellow)(quiet, (0, utils_1.info)(`Generating proofs of message processing...`));
    const { messageBatchSize } = poll.batchSizes;
    const numMessages = poll.messages.length;
    let totalMessageBatches = numMessages <= messageBatchSize ? 1 : Math.floor(numMessages / messageBatchSize);
    if (numMessages > messageBatchSize && numMessages % messageBatchSize > 0) {
        totalMessageBatches += 1;
    }
    // while we have unprocessed messages, process them
    while (poll.hasUnprocessedMessages()) {
        // process messages in batches
        const circuitInputs = poll.processMessages(pollId, useQuadraticVoting, quiet);
        try {
            // generate the proof for this batch
            // eslint-disable-next-line no-await-in-loop
            const r = await (0, maci_circuits_1.genProof)({
                inputs: circuitInputs,
                zkeyPath: processZkey,
                useWasm,
                rapidsnarkExePath: rapidsnark,
                witnessExePath: processWitgen,
                wasmPath: processWasm,
            });
            // verify it
            // eslint-disable-next-line no-await-in-loop
            const isValid = await (0, maci_circuits_1.verifyProof)(r.publicSignals, r.proof, processVk);
            if (!isValid) {
                throw new Error("Generated an invalid proof");
            }
            const thisProof = {
                circuitInputs,
                proof: r.proof,
                publicInputs: r.publicSignals,
            };
            // save the proof
            processProofs.push(thisProof);
            // eslint-disable-next-line no-await-in-loop
            await fs_1.default.promises.writeFile(path_1.default.resolve(outputDir, `process_${poll.numBatchesProcessed - 1}.json`), JSON.stringify(thisProof, null, 4));
            (0, utils_1.logYellow)(quiet, (0, utils_1.info)(`Progress: ${poll.numBatchesProcessed} / ${totalMessageBatches}`));
        }
        catch (error) {
            (0, utils_1.logError)(error.message);
        }
    }
    const endTime = Date.now();
    (0, utils_1.logYellow)(quiet, (0, utils_1.info)(`gen processMessage proof took ${(endTime - startTime) / 1000} seconds\n`));
    // tallying proofs
    (0, utils_1.logYellow)(quiet, (0, utils_1.info)(`Generating proofs of vote tallying...`));
    const tallyStartTime = Date.now();
    const { tallyBatchSize } = poll.batchSizes;
    const numStateLeaves = poll.stateLeaves.length;
    let totalTallyBatches = numStateLeaves <= tallyBatchSize ? 1 : Math.floor(numStateLeaves / tallyBatchSize);
    if (numStateLeaves > tallyBatchSize && numStateLeaves % tallyBatchSize > 0) {
        totalTallyBatches += 1;
    }
    let tallyCircuitInputs;
    // tally all ballots for this poll
    while (poll.hasUntalliedBallots()) {
        // tally votes in batches
        tallyCircuitInputs = useQuadraticVoting
            ? poll.tallyVotes()
            : poll.tallyVotesNonQv();
        try {
            // generate the proof
            // eslint-disable-next-line no-await-in-loop
            const r = await (0, maci_circuits_1.genProof)({
                inputs: tallyCircuitInputs,
                zkeyPath: tallyZkey,
                useWasm,
                rapidsnarkExePath: rapidsnark,
                witnessExePath: tallyWitgen,
                wasmPath: tallyWasm,
            });
            // verify it
            // eslint-disable-next-line no-await-in-loop
            const isValid = await (0, maci_circuits_1.verifyProof)(r.publicSignals, r.proof, tallyVk);
            if (!isValid) {
                (0, utils_1.logError)("Generated an invalid tally proof");
            }
            const thisProof = {
                circuitInputs: tallyCircuitInputs,
                proof: r.proof,
                publicInputs: r.publicSignals,
            };
            // save it
            tallyProofs.push(thisProof);
            // eslint-disable-next-line no-await-in-loop
            await fs_1.default.promises.writeFile(path_1.default.resolve(outputDir, `tally_${poll.numBatchesTallied - 1}.json`), JSON.stringify(thisProof, null, 4));
            (0, utils_1.logYellow)(quiet, (0, utils_1.info)(`Progress: ${poll.numBatchesTallied} / ${totalTallyBatches}`));
        }
        catch (error) {
            (0, utils_1.logError)(error.message);
        }
    }
    // verify the results
    // Compute newResultsCommitment
    const newResultsCommitment = (0, maci_crypto_1.genTreeCommitment)(poll.tallyResult, BigInt((0, utils_1.asHex)(tallyCircuitInputs.newResultsRootSalt)), poll.treeDepths.voteOptionTreeDepth);
    // compute newSpentVoiceCreditsCommitment
    const newSpentVoiceCreditsCommitment = (0, maci_crypto_1.hashLeftRight)(poll.totalSpentVoiceCredits, BigInt((0, utils_1.asHex)(tallyCircuitInputs.newSpentVoiceCreditSubtotalSalt)));
    let newPerVOSpentVoiceCreditsCommitment;
    let newTallyCommitment;
    // create the tally file data to store for verification later
    const tallyFileData = {
        maci: maciContractAddress,
        pollId: pollId.toString(),
        network: network?.name,
        chainId: network?.chainId.toString(),
        isQuadratic: useQuadraticVoting,
        tallyAddress: pollContracts.tally,
        newTallyCommitment: (0, utils_1.asHex)(tallyCircuitInputs.newTallyCommitment),
        results: {
            tally: poll.tallyResult.map((x) => x.toString()),
            salt: (0, utils_1.asHex)(tallyCircuitInputs.newResultsRootSalt),
            commitment: (0, utils_1.asHex)(newResultsCommitment),
        },
        totalSpentVoiceCredits: {
            spent: poll.totalSpentVoiceCredits.toString(),
            salt: (0, utils_1.asHex)(tallyCircuitInputs.newSpentVoiceCreditSubtotalSalt),
            commitment: (0, utils_1.asHex)(newSpentVoiceCreditsCommitment),
        },
    };
    if (useQuadraticVoting) {
        // Compute newPerVOSpentVoiceCreditsCommitment
        newPerVOSpentVoiceCreditsCommitment = (0, maci_crypto_1.genTreeCommitment)(poll.perVOSpentVoiceCredits, BigInt((0, utils_1.asHex)(tallyCircuitInputs.newPerVOSpentVoiceCreditsRootSalt)), poll.treeDepths.voteOptionTreeDepth);
        // Compute newTallyCommitment
        newTallyCommitment = (0, maci_crypto_1.hash3)([
            newResultsCommitment,
            newSpentVoiceCreditsCommitment,
            newPerVOSpentVoiceCreditsCommitment,
        ]);
        // update perVOSpentVoiceCredits in the tally file data
        tallyFileData.perVOSpentVoiceCredits = {
            tally: poll.perVOSpentVoiceCredits.map((x) => x.toString()),
            salt: (0, utils_1.asHex)(tallyCircuitInputs.newPerVOSpentVoiceCreditsRootSalt),
            commitment: (0, utils_1.asHex)(newPerVOSpentVoiceCreditsCommitment),
        };
    }
    else {
        newTallyCommitment = (0, maci_crypto_1.hashLeftRight)(newResultsCommitment, newSpentVoiceCreditsCommitment);
    }
    await fs_1.default.promises.writeFile(tallyFile, JSON.stringify(tallyFileData, null, 4));
    (0, utils_1.logYellow)(quiet, (0, utils_1.info)(`Tally file:\n${JSON.stringify(tallyFileData, null, 4)}\n`));
    // compare the commitments
    if ((0, utils_1.asHex)(newTallyCommitment) === tallyFileData.newTallyCommitment) {
        (0, utils_1.logGreen)(quiet, (0, utils_1.success)("The tally commitment is correct"));
    }
    else {
        (0, utils_1.logError)("Error: the newTallyCommitment is invalid.");
    }
    const tallyEndTime = Date.now();
    (0, utils_1.logYellow)(quiet, (0, utils_1.info)(`gen tally proof took ${(tallyEndTime - tallyStartTime) / 1000} seconds\n`));
    return tallyFileData;
};
exports.genProofs = genProofs;
//# sourceMappingURL=genProofs.js.map