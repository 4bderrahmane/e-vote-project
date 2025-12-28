"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProofGenerator = void 0;
const maci_circuits_1 = require("maci-circuits");
const maci_core_1 = require("maci-core");
const maci_crypto_1 = require("maci-crypto");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const utils_1 = require("../../ts/utils");
/**
 * Proof generator class for message processing and tally.
 */
class ProofGenerator {
    /**
     * Get maci state from local file or from contract
     *
     * @param {IPrepareStateParams} params - params to prepare maci state
     * @returns {MaciState} maci state
     */
    static async prepareState({ maciContract, pollContract, messageAq, pollId, maciPrivateKey, coordinatorKeypair, signer, outputDir, options: { transactionHash, stateFile, startBlock, endBlock, blocksPerBatch }, }) {
        const isOutputDirExists = fs_1.default.existsSync(path_1.default.resolve(outputDir));
        if (!isOutputDirExists) {
            await fs_1.default.promises.mkdir(path_1.default.resolve(outputDir));
        }
        if (stateFile) {
            const content = await fs_1.default.promises
                .readFile(stateFile)
                .then((res) => JSON.parse(res.toString()));
            const serializedPrivateKey = maciPrivateKey.serialize();
            const maciState = maci_core_1.MaciState.fromJSON(content);
            maciState.polls.forEach((poll) => {
                poll.setCoordinatorKeypair(serializedPrivateKey);
            });
            return maciState;
        }
        // build an off-chain representation of the MACI contract using data in the contract storage
        const [defaultStartBlockSignup, defaultStartBlockPoll, { messageTreeDepth }, stateRoot, numSignups] = await Promise.all([
            maciContract
                .queryFilter(maciContract.filters.SignUp(), startBlock)
                .then((events) => events[0]?.blockNumber ?? 0),
            maciContract
                .queryFilter(maciContract.filters.DeployPoll(), startBlock)
                .then((events) => events[0]?.blockNumber ?? 0),
            pollContract.treeDepths(),
            maciContract.getStateTreeRoot(),
            maciContract.numSignUps(),
        ]);
        const defaultStartBlock = Math.min(defaultStartBlockPoll, defaultStartBlockSignup);
        let fromBlock = startBlock ? Number(startBlock) : defaultStartBlock;
        const messageRoot = await messageAq.getMainRoot(messageTreeDepth);
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
        console.log(`starting to fetch logs from block ${fromBlock}`);
        const maciContractAddress = await maciContract.getAddress();
        return Promise.resolve().then(() => __importStar(require("../../ts/genMaciState"))).then(({ genMaciStateFromContract }) => genMaciStateFromContract(signer.provider, maciContractAddress, coordinatorKeypair, BigInt(pollId), fromBlock, blocksPerBatch, endBlock || defaultEndBlock));
    }
    /**
     * Initialize class properties
     *
     * @param {IProofGeneratorParams} params - initialization params
     */
    constructor({ poll, mp, tally, rapidsnark, maciContractAddress, tallyContractAddress, outputDir, tallyOutputFile, useQuadraticVoting, }) {
        this.poll = poll;
        this.maciContractAddress = maciContractAddress;
        this.tallyContractAddress = tallyContractAddress;
        this.outputDir = outputDir;
        this.tallyOutputFile = tallyOutputFile;
        this.mp = mp;
        this.tally = tally;
        this.rapidsnark = rapidsnark;
        this.useQuadraticVoting = useQuadraticVoting;
    }
    /**
     * Generate message processing proofs
     *
     * @returns message processing proofs
     */
    async generateMpProofs(options) {
        performance.mark("mp-proofs-start");
        console.log(`Generating proofs of message processing...`);
        const { messageBatchSize } = this.poll.batchSizes;
        const numMessages = this.poll.messages.length;
        let totalMessageBatches = numMessages <= messageBatchSize ? 1 : Math.floor(numMessages / messageBatchSize);
        if (numMessages > messageBatchSize && numMessages % messageBatchSize > 0) {
            totalMessageBatches += 1;
        }
        try {
            const inputs = [];
            // while we have unprocessed messages, process them
            while (this.poll.hasUnprocessedMessages()) {
                // process messages in batches
                const circuitInputs = this.poll.processMessages(BigInt(this.poll.pollId), this.useQuadraticVoting);
                // generate the proof for this batch
                inputs.push(circuitInputs);
                console.log(`Progress: ${this.poll.numBatchesProcessed} / ${totalMessageBatches}`);
            }
            console.log("Wait until proof generation is finished");
            const processZkey = await (0, maci_circuits_1.extractVk)(this.mp.zkey, false);
            const proofs = await Promise.all(inputs.map((circuitInputs, index) => this.generateProofs(circuitInputs, this.mp, `process_${index}.json`, processZkey).then((data) => {
                options?.onBatchComplete?.({ current: index, total: totalMessageBatches, proofs: data });
                return data;
            }))).then((data) => data.reduce((acc, x) => acc.concat(x), []));
            console.log("Proof generation is finished");
            // cleanup threads
            await (0, maci_circuits_1.cleanThreads)();
            performance.mark("mp-proofs-end");
            performance.measure("Generate message processor proofs", "mp-proofs-start", "mp-proofs-end");
            options?.onComplete?.(proofs);
            return proofs;
        }
        catch (error) {
            options?.onFail?.(error);
            throw error;
        }
    }
    /**
     * Generate tally proofs
     *
     * @param network - current network
     * @returns tally proofs
     */
    async generateTallyProofs(network, options) {
        performance.mark("tally-proofs-start");
        console.log(`Generating proofs of vote tallying...`);
        const { tallyBatchSize } = this.poll.batchSizes;
        const numStateLeaves = this.poll.stateLeaves.length;
        let totalTallyBatches = numStateLeaves <= tallyBatchSize ? 1 : Math.floor(numStateLeaves / tallyBatchSize);
        if (numStateLeaves > tallyBatchSize && numStateLeaves % tallyBatchSize > 0) {
            totalTallyBatches += 1;
        }
        try {
            let tallyCircuitInputs;
            const inputs = [];
            while (this.poll.hasUntalliedBallots()) {
                tallyCircuitInputs = (this.useQuadraticVoting
                    ? this.poll.tallyVotes()
                    : this.poll.tallyVotesNonQv());
                inputs.push(tallyCircuitInputs);
                console.log(`Progress: ${this.poll.numBatchesTallied} / ${totalTallyBatches}`);
            }
            console.log("Wait until proof generation is finished");
            const tallyVk = await (0, maci_circuits_1.extractVk)(this.tally.zkey, false);
            const proofs = await Promise.all(inputs.map((circuitInputs, index) => this.generateProofs(circuitInputs, this.tally, `tally_${index}.json`, tallyVk).then((data) => {
                options?.onBatchComplete?.({ current: index, total: totalTallyBatches, proofs: data });
                return data;
            }))).then((data) => data.reduce((acc, x) => acc.concat(x), []));
            console.log("Proof generation is finished");
            // cleanup threads
            await (0, maci_circuits_1.cleanThreads)();
            // verify the results
            // Compute newResultsCommitment
            const newResultsCommitment = (0, maci_crypto_1.genTreeCommitment)(this.poll.tallyResult, BigInt((0, utils_1.asHex)(tallyCircuitInputs.newResultsRootSalt)), this.poll.treeDepths.voteOptionTreeDepth);
            // compute newSpentVoiceCreditsCommitment
            const newSpentVoiceCreditsCommitment = (0, maci_crypto_1.hashLeftRight)(this.poll.totalSpentVoiceCredits, BigInt((0, utils_1.asHex)(tallyCircuitInputs.newSpentVoiceCreditSubtotalSalt)));
            let newPerVOSpentVoiceCreditsCommitment;
            let newTallyCommitment;
            // create the tally file data to store for verification later
            const tallyFileData = {
                maci: this.maciContractAddress,
                pollId: this.poll.pollId.toString(),
                network: network.name,
                chainId: network.config.chainId?.toString(),
                isQuadratic: Boolean(this.useQuadraticVoting),
                tallyAddress: this.tallyContractAddress,
                newTallyCommitment: (0, utils_1.asHex)(tallyCircuitInputs.newTallyCommitment),
                results: {
                    tally: this.poll.tallyResult.map((x) => x.toString()),
                    salt: (0, utils_1.asHex)(tallyCircuitInputs.newResultsRootSalt),
                    commitment: (0, utils_1.asHex)(newResultsCommitment),
                },
                totalSpentVoiceCredits: {
                    spent: this.poll.totalSpentVoiceCredits.toString(),
                    salt: (0, utils_1.asHex)(tallyCircuitInputs.newSpentVoiceCreditSubtotalSalt),
                    commitment: (0, utils_1.asHex)(newSpentVoiceCreditsCommitment),
                },
            };
            if (this.useQuadraticVoting) {
                // Compute newPerVOSpentVoiceCreditsCommitment
                newPerVOSpentVoiceCreditsCommitment = (0, maci_crypto_1.genTreeCommitment)(this.poll.perVOSpentVoiceCredits, BigInt((0, utils_1.asHex)(tallyCircuitInputs.newPerVOSpentVoiceCreditsRootSalt)), this.poll.treeDepths.voteOptionTreeDepth);
                // Compute newTallyCommitment
                newTallyCommitment = (0, maci_crypto_1.hash3)([
                    newResultsCommitment,
                    newSpentVoiceCreditsCommitment,
                    newPerVOSpentVoiceCreditsCommitment,
                ]);
                // update perVOSpentVoiceCredits in the tally file data
                tallyFileData.perVOSpentVoiceCredits = {
                    tally: this.poll.perVOSpentVoiceCredits.map((x) => x.toString()),
                    salt: (0, utils_1.asHex)(tallyCircuitInputs.newPerVOSpentVoiceCreditsRootSalt),
                    commitment: (0, utils_1.asHex)(newPerVOSpentVoiceCreditsCommitment),
                };
            }
            else {
                newTallyCommitment = (0, maci_crypto_1.hashLeftRight)(newResultsCommitment, newSpentVoiceCreditsCommitment);
            }
            await fs_1.default.promises.writeFile(this.tallyOutputFile, JSON.stringify(tallyFileData, null, 4));
            console.log(`Tally file:\n${JSON.stringify(tallyFileData, null, 4)}\n`);
            // compare the commitments
            if ((0, utils_1.asHex)(newTallyCommitment) === tallyFileData.newTallyCommitment) {
                console.log("The tally commitment is correct");
            }
            else {
                throw new Error("Error: the newTallyCommitment is invalid.");
            }
            performance.mark("tally-proofs-end");
            performance.measure("Generate tally proofs", "tally-proofs-start", "tally-proofs-end");
            options?.onComplete?.(proofs, tallyFileData);
            return { proofs, tallyData: tallyFileData };
        }
        catch (error) {
            options?.onFail?.(error);
            throw error;
        }
    }
    /**
     * Generic function for proofs generation
     *
     * @param {CircuitInputs} circuitInputs - circuit inputs
     * @param {ICircuitFiles} circuitFiles - circuit files (zkey, witgen, wasm)
     * @param outputFile - output file
     * @returns proofs
     */
    async generateProofs(circuitInputs, circuitFiles, outputFile, vk) {
        const proofs = [];
        const { proof, publicSignals } = await (0, maci_circuits_1.genProof)({
            inputs: circuitInputs,
            useWasm: Boolean(circuitFiles.wasm),
            zkeyPath: circuitFiles.zkey,
            rapidsnarkExePath: this.rapidsnark,
            witnessExePath: circuitFiles.witgen,
            wasmPath: circuitFiles.wasm,
        });
        // verify it
        // eslint-disable-next-line no-await-in-loop
        const isValid = await (0, maci_circuits_1.verifyProof)(publicSignals, proof, vk, false);
        if (!isValid) {
            throw new Error("Error: generated an invalid proof");
        }
        proofs.push({
            circuitInputs,
            proof,
            publicInputs: publicSignals,
        });
        await fs_1.default.promises.writeFile(path_1.default.resolve(this.outputDir, outputFile), JSON.stringify(proofs[proofs.length - 1], null, 4));
        return proofs;
    }
}
exports.ProofGenerator = ProofGenerator;
//# sourceMappingURL=ProofGenerator.js.map