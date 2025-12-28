import { Network } from "hardhat/types";
import { MaciState } from "maci-core";
import type { IGenerateProofsOptions, IPrepareStateParams, IProofGeneratorParams, TallyData } from "./types";
import type { Proof } from "../../ts/types";
/**
 * Proof generator class for message processing and tally.
 */
export declare class ProofGenerator {
    /**
     * Current poll
     */
    private poll;
    /**
     * MACI contract address
     */
    private maciContractAddress;
    /**
     * Tally contract address
     */
    private tallyContractAddress;
    /**
     * The directory to store the proofs
     */
    private outputDir;
    /**
     * The file to store the tally proof
     */
    private tallyOutputFile;
    /**
     * Message processing circuit files
     */
    private mp;
    /**
     * Tally circuit files
     */
    private tally;
    /**
     * Whether to use quadratic voting or not
     */
    private useQuadraticVoting?;
    /**
     * Path to the rapidsnark binary
     */
    private rapidsnark?;
    /**
     * Get maci state from local file or from contract
     *
     * @param {IPrepareStateParams} params - params to prepare maci state
     * @returns {MaciState} maci state
     */
    static prepareState({ maciContract, pollContract, messageAq, pollId, maciPrivateKey, coordinatorKeypair, signer, outputDir, options: { transactionHash, stateFile, startBlock, endBlock, blocksPerBatch }, }: IPrepareStateParams): Promise<MaciState>;
    /**
     * Initialize class properties
     *
     * @param {IProofGeneratorParams} params - initialization params
     */
    constructor({ poll, mp, tally, rapidsnark, maciContractAddress, tallyContractAddress, outputDir, tallyOutputFile, useQuadraticVoting, }: IProofGeneratorParams);
    /**
     * Generate message processing proofs
     *
     * @returns message processing proofs
     */
    generateMpProofs(options?: IGenerateProofsOptions): Promise<Proof[]>;
    /**
     * Generate tally proofs
     *
     * @param network - current network
     * @returns tally proofs
     */
    generateTallyProofs(network: Network, options?: IGenerateProofsOptions): Promise<{
        proofs: Proof[];
        tallyData: TallyData;
    }>;
    /**
     * Generic function for proofs generation
     *
     * @param {CircuitInputs} circuitInputs - circuit inputs
     * @param {ICircuitFiles} circuitFiles - circuit files (zkey, witgen, wasm)
     * @param outputFile - output file
     * @returns proofs
     */
    private generateProofs;
}
//# sourceMappingURL=ProofGenerator.d.ts.map