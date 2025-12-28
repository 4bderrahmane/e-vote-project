import loglevel, { LogLevelDesc } from 'loglevel';
import { Groth16Proof, PublicSignals, PlonkProof, FflonkProof } from 'snarkjs';

/**
 * Some fields for the R1CS information, many other fields are omitted in this type.
 */
type R1CSInfoType = {
    wires: number;
    constraints: number;
    privateInputs: number;
    publicInputs: number;
    publicOutputs: number;
    useCustomGates: boolean;
    labels: number;
    prime: bigint;
    primeName: string;
};

/** An integer value is a numerical string, a number, or a bigint. */
type IntegerValueType = `${number}` | number | bigint;
/** A signal value is a number, or an array of numbers (recursively). */
type SignalValueType = IntegerValueType | SignalValueType[];
/**
 * An object with string keys and array of numerical values.
 * Each key represents a signal name as it appears in the circuit.
 *
 * By default, signal names are not typed, but you can pass an array of signal names
 * to make them type-safe, e.g. `CircuitSignals<['sig1', 'sig2']>`
 */
type CircuitSignals<T extends readonly string[] = []> = T extends [] ? {
    [signal: string]: SignalValueType;
} : {
    [signal in T[number]]: SignalValueType;
};
/** A witness is an array of `bigint`s, corresponding to the values of each wire in the evaluation of the circuit. */
type WitnessType = bigint[];
/**
 * Symbols are a mapping of each circuit `wire` to an object with three keys. Within them,
 * the most important is `varIdx` which indicates the position of this signal in the witness array.
 */
type SymbolsType = {
    [symbol: string]: {
        labelIdx: number;
        varIdx: number;
        componentIdx: number;
    };
};
/** A configuration object for circuit main components. */
type CircuitConfig = {
    /** File to read the template from */
    file: string;
    /** The template name to instantiate */
    template: string;
    /** Directory to instantiate at */
    dir?: string;
    /** Target version */
    version?: `${number}.${number}.${number}`;
    /** An array of public input signal names, defaults to `[]` */
    pubs?: string[];
    /** An array of template parameters, defaults to `[]` */
    params?: (number | bigint)[];
};
/**
 * A simple type-wrapper for `circom_tester` WASM tester class.
 * Not all functions may exist here, some are omitted.
 * @see https://github.com/iden3/circom_tester/blob/main/wasm/tester.js
 */
type CircomWasmTester = {
    checkConstraints: (witness: WitnessType) => Promise<void>;
    release: () => Promise<void>;
    assertOut: (actualOut: WitnessType, expectedOut: CircuitSignals) => Promise<void>;
    calculateWitness: (input: CircuitSignals, sanityCheck: boolean) => Promise<WitnessType>;
    loadConstraints: () => Promise<void>;
    constraints: unknown[] | undefined;
    loadSymbols: () => Promise<void>;
    symbols: SymbolsType | undefined;
    getDecoratedOutput: (witness: WitnessType) => Promise<string>;
};

declare const PROTOCOLS: readonly ["groth16", "plonk", "fflonk"];
declare const PRIMES: readonly ["bn128", "bls12381", "goldilocks", "grumpkin", "pallas", "vesta", "secq256r1"];
type CircomkitConfig = {
    /** Protocol (proof system) to be used. */
    protocol: (typeof PROTOCOLS)[number];
    /**
     * Primes supported by Circom, as described for the `-p` option.
     * @see https://github.com/iden3/circom/blob/master/program_structure/src/utils/constants.rs
     */
    prime: (typeof PRIMES)[number];
    /** Circuit configurations path. */
    circuits: string;
    /** Directory to read circuits from. */
    dirCircuits: string;
    /** Directory to read inputs from. */
    dirInputs: string;
    /** Directory to download PTAU files. */
    dirPtau: string;
    /** Directory to output circuit build files. */
    dirBuild: string;
    /** Path to circom executable */
    circomPath: string;
    /** Number of contributions */
    groth16numContributions: number;
    /** Ask user input to create entropy */
    groth16askForEntropy: boolean;
    /** Version number for main components. */
    version: `${number}.${number}.${number}`;
    /**
     * [Optimization level](https://docs.circom.io/getting-started/compilation-options/#flags-and-options-related-to-the-r1cs-optimization).
     * - `0`: No simplification is applied.
     * - `1`: Only applies `var` to `var` and `var` to `constant` simplification.
     * - `2`: Full constraint simplificiation via Gaussian eliminations.
     * - `>2`: Any number higher than 2 will use `--O2round` with the number as simplification rounds.
     */
    optimization: number;
    /** Does an additional check over the constraints produced. */
    inspect: boolean;
    /** Include paths as libraries during compilation. */
    include: string[];
    /** Pass logger to SnarkJS to see its logs in addition to Circomkit. */
    verbose: boolean;
    /** Log level used by the internal logger. */
    logLevel: LogLevelDesc;
    /** Whether to generate the C witness calculator. */
    cWitness: boolean;
    /** Whether to print Solidity copy-pasteable calldata. */
    prettyCalldata: false;
};

/** A utility class to test your circuits. Use `expectFail` and `expectPass` to test out evaluations. */
declare class WitnessTester<IN extends readonly string[] = [], OUT extends readonly string[] = []> {
    /** The underlying `circom_tester` object */
    private readonly circomWasmTester;
    /** A dictionary of symbols, see {@link loadSymbols} */
    private symbols;
    /** List of constraints, see {@link loadConstraints} */
    private constraints;
    constructor(
    /** The underlying `circom_tester` object */
    circomWasmTester: CircomWasmTester);
    /** Assert that constraints are valid for a given witness. */
    expectConstraintPass(witness: WitnessType): Promise<void>;
    /**
     * Assert that constraints are NOT valid for a given witness.
     * This is useful to test if a fake witness (a witness from a
     * dishonest prover) can still be valid, which would indicate
     * that there are soundness errors in the circuit.
     */
    expectConstraintFail(witness: WitnessType): Promise<void>;
    /** Compute witness given the input signals. */
    calculateWitness(input: CircuitSignals<IN>): Promise<WitnessType>;
    /** Returns the number of constraints. */
    getConstraintCount(): Promise<number>;
    /** Asserts that the circuit has enough constraints.
     *
     * By default, this function checks if there **at least** `expected` many constraints in the circuit.
     * If `exact` option is set to `true`, it will also check if the number of constraints is exactly equal to
     * the `expected` amount.
     *
     * If first check fails, it means the circuit is under-constrained. If the second check fails, it means
     * the circuit is over-constrained.
     */
    expectConstraintCount(expected: number, exact?: boolean): Promise<void>;
    /** Expect a witness computation to fail in the circuit.
     *
     * See [here](https://github.com/iden3/circom/blob/master/code_producers/src/wasm_elements/common/witness_calculator.js#L21)
     * for the list of errors that may occur during witness calculation.
     * Most of the time, you will be expecting an assertion error.
     *
     * @returns the error message.
     */
    expectFail(input: CircuitSignals<IN>): Promise<string>;
    /** Expect an input to pass assertions and match the output.
     *
     * If `output` is omitted, it will only check for constraints to pass.
     */
    expectPass(input: CircuitSignals<IN>, output?: CircuitSignals<OUT>): Promise<void>;
    /**
     * Computes the witness.
     * This is a shorthand for calculating the witness and calling {@link readWitnessSignals} on the result.
     */
    compute(input: CircuitSignals<IN>, signals: string[] | OUT): Promise<CircuitSignals>;
    /**
     * Override witness value to try and fake a proof. If the circuit has soundness problems (i.e.
     * some signals are not constrained correctly), then you may be able to create a fake witness by
     * overriding specific values, and pass the constraints check.
     *
     * The symbol names must be given in full form, not just as the signal is named in the circuit code. In
     * general a symbol name looks something like:
     *
     * - `main.signal`
     * - `main.component.signal`
     * - `main.component.signal[n][m]`
     *
     * You will likely call `expectConstraintPass` on the resulting fake witness to see if it can indeed fool
     * a verifier.
     * @see {@link expectConstraintPass}
     */
    editWitness(witness: Readonly<WitnessType>, symbolValues: {
        [symbolName: string]: bigint;
    }): Promise<WitnessType>;
    /** Read symbol values from a witness. */
    readWitness(witness: Readonly<WitnessType>, symbols: string[]): Promise<Record<string, bigint>>;
    /**
     * Read signals from a witness.
     *
     * This is not the same as {@link readWitness} in the sense that the entire value represented by a signal
     * will be returned here. For example, instead of reading `main.out[0], main.out[1], main.out[2]` with `readWitness`,
     * you can simply query `out` in this function and an object with `{out: [...]}` will be returned.
     *
     * To read signals within a component, simply refer to them as `component.signal`. In other words, omit the `main.` prefix
     * and array dimensions.
     */
    readWitnessSignals(witness: Readonly<WitnessType>, signals: string[] | OUT): Promise<CircuitSignals>;
    /**
     * Assert the output of a given witness.
     * @param actualOut expected witness
     * @param expectedOut computed output signals
     */
    private assertOut;
    /** Loads the list of R1CS constraints to `this.constraints`. */
    private loadConstraints;
    /**
     * Loads the symbols in a dictionary at `this.symbols`
     * Symbols are stored under the .sym file
     *
     * Each line has 4 comma-separated values:
     *
     * 1.  symbol name
     * 2.  label index
     * 3.  variable index
     * 4.  component index
     */
    private loadSymbols;
    /**
     * @deprecated this is buggy right now
     * @param witness witness
     */
    private getDecoratedOutput;
    /**
     * Cleanup directory, should probably be called upon test completion (?)
     * @deprecated this is buggy right now
     */
    private release;
}

/** A tester that is able to generate proofs & verify them.
 * Use `expectFail` and `expectPass` to test out evaluations. */
declare class ProofTester<IN extends string[] = [], P extends CircomkitConfig['protocol'] = 'groth16'> {
    readonly wasmPath: string;
    readonly pkeyPath: string;
    readonly vkeyPath: string;
    readonly protocol: P;
    readonly verificationKey: any;
    constructor(wasmPath: string, pkeyPath: string, vkeyPath: string, protocol: P);
    /** Generate a proof for the witness computed from the given input signals. */
    prove(input: CircuitSignals<IN>): Promise<{
        proof: Groth16Proof;
        publicSignals: PublicSignals;
    }>;
    prove(input: CircuitSignals<IN>): Promise<{
        proof: PlonkProof;
        publicSignals: PublicSignals;
    }>;
    prove(input: CircuitSignals<IN>): Promise<{
        proof: FflonkProof;
        publicSignals: PublicSignals;
    }>;
    /** Returns the verification result of a proof for some public signals. */
    verify(proof: Groth16Proof, publicSignals: PublicSignals): Promise<boolean>;
    verify(proof: PlonkProof, publicSignals: PublicSignals): Promise<boolean>;
    verify(proof: FflonkProof, publicSignals: PublicSignals): Promise<boolean>;
    /** Expects a verification to pass for this proof and public signals. */
    expectPass(proof: Groth16Proof, publicSignals: PublicSignals): Promise<void>;
    expectPass(proof: PlonkProof, publicSignals: PublicSignals): Promise<void>;
    expectPass(proof: FflonkProof, publicSignals: PublicSignals): Promise<void>;
    /** Expects a verification to fail for this proof and public signals. */
    expectFail(proof: Groth16Proof, publicSignals: PublicSignals): Promise<void>;
    expectFail(proof: PlonkProof, publicSignals: PublicSignals): Promise<void>;
    expectFail(proof: FflonkProof, publicSignals: PublicSignals): Promise<void>;
}

/** Utility class to handle path abstractions.
 *
 * This class takes in a reference to the Circomkit configuration and provides the correct pathing.
 */
declare class CircomkitPath {
    private readonly config;
    constructor(config: CircomkitConfig);
    /**
     * Computes a path that requires a circuit name.
     *
     * @param circuit The name of the circuit.
     * @param kind The kind of file to compute the path for.
     */
    ofCircuit(circuit: string, kind: 'main' | 'sym' | 'pkey' | 'vkey' | 'wasm' | 'sol' | 'dir' | 'r1cs'): string;
    /**
     * Computes a path that requires a circuit and an input name.
     *
     * @param circuit The name of the circuit.
     * @param input The name of the input.
     * @param kind The kind of file to compute the path for.
     */
    ofCircuitWithInput(circuit: string, input: string, kind: 'pubs' | 'proof' | 'wtns' | 'in' | 'dir'): string;
    /**
     * Given a PTAU name, returns the relative path.
     *
     * @param ptauName The name of the PTAU file, e.g. `powersOfTau28_hez_final_08.ptau`.
     */
    ofPtau(ptauName: string): string;
    /**
     * Given a circuit & id name, returns the relative path of the phase-2 PTAU.
     *
     * This is used in particular by Groth16's circuit-specific setup phase.
     *
     * @param circuit The name of the circuit.
     * @param id The id of the zKey.
     */
    ofZkey(circuit: string, id: number): string;
}

/**
 * Circomkit is an opinionated wrapper around many SnarkJS functions.
 *
 * It abstracts away all the path and commands by providing a simple interface,
 * built around just providing the circuit name and the input name.
 *
 * ```ts
 * const circomkit = new Circomkit()
 * ```
 *
 * It also provides a **WitnessTester** and a **ProofTester** module which use Chai assertions within.
 *
 * ```ts
 * const witnessTester = await circomkit.WitnessTester(circuitName, circuitConfig)
 * const proofTester = await circomkit.ProofTester(circuitName)
 * ```
 */
declare class Circomkit {
    readonly config: CircomkitConfig;
    readonly log: loglevel.Logger;
    readonly path: CircomkitPath;
    /** A logger reference to be passed into SnarkJS functions. If `verbose` is set to `false`, this logger will be undefined. */
    private readonly snarkjsLogger;
    constructor(overrides?: Partial<CircomkitConfig>);
    /** Returns the contents of `circuits.json`. */
    readCircuits(): Record<string, CircuitConfig>;
    /** Returns a single circuit config from `circuits.json`. */
    readCircuitConfig(circuit: string): CircuitConfig;
    /** Clear build files and the `main` component of a circuit. */
    clear(circuit: string): Promise<void>;
    /** Export a verification key (vKey) from a proving key (zKey). */
    vkey(circuit: string, pkeyPath?: string): Promise<string>;
    /** Returns circuit information. */
    info(circuit: string): Promise<R1CSInfoType>;
    /** Downloads the phase-1 setup PTAU file for a circuit based on it's number of constraints.
     *
     * The downloaded PTAU files can be seen at [SnarkJS docs](https://github.com/iden3/snarkjs#7-prepare-phase-2).
     * Note that this may take a while if the circuit is large and thus a larger PTAU is needed.
     *
     * This function only works when the used prime is `bn128`.
     *
     * @returns path of the downloaded PTAU file
     */
    ptau(circuit: string): Promise<string>;
    /** Compile the circuit.
     *
     * A circuit configuration can be passed optionally; if not, the
     * config will be read from `circuits.json` at the working directory.
     *
     * @returns path of the build directory
     */
    compile(circuit: string, config?: CircuitConfig): Promise<string>;
    /** Exports a solidity contract for the verifier.
     * @returns path of the exported Solidity contract
     */
    contract(circuit: string): Promise<string>;
    /** Export calldata to call a Verifier contract.
     *
     * @returns calldata
     */
    calldata(circuit: string, input: string, pretty?: boolean): Promise<string>;
    /** Instantiate the `main` component.
     *
     * If `circuitConfig` argument is omitted, this function will look for it at `circuits.json`
     * in the working directory, and throw an error if no entry is found for the circuit.
     *
     * When config is read from file, `dir` defaults to `main`, otherwise `dir` defaults to `test`.
     * This is done to make it so that when CLI is used circuits are created under `main`, and when
     * we use Circomkit programmatically (e.g. during testing) circuits are created under `test`
     * unless specified otherwise.
     *
     * @returns path of the created main component
     */
    instantiate(circuit: string, circuitConfig?: CircuitConfig): string;
    /** Generate a proof.
     *
     * If `data` is not passed, the input data will be read from `inputs/<circuit>/<input>.json`.
     *
     * @returns path of the directory where public signals and proof are created
     */
    prove(circuit: string, input: string, data?: CircuitSignals): Promise<string>;
    /** Commence a circuit-specific setup.
     *
     * If `ptauPath` argument is omitted, this function will try to automatically download it.
     * See the {@link ptau} method for more information about this.
     *
     * @returns path of the verifier key and prover key
     */
    setup(circuit: string, ptauPath?: string): Promise<{
        proverKeyPath: string;
        verifierKeyPath: string;
    }>;
    /** Verify a proof for some public signals.
     * @returns `true` if verification is successful, `false` otherwise.
     */
    verify(circuit: string, input: string): Promise<boolean>;
    /** Calculates the witness for the given circuit and input.
     *
     * If `data` is not passed, the input data will be read from `inputs/<circuit>/<input>.json`.
     *
     * @returns path of the created witness
     */
    witness(circuit: string, input: string, data?: CircuitSignals): Promise<string>;
    /** Exports a JSON input file for some circuit with the given object.
     *
     * This is useful for testing real circuits, or creating an input programmatically.
     * Overwrites an existing input.
     *
     * @returns path of the created input file
     */
    input(circuit: string, input: string, data: CircuitSignals): string;
    /** Export a circuit artifact in JSON format.
     *
     * Returns the JSON object itself, and the path that it would be exported to with
     * respect to the Circomkit configuration.
     *
     * @returns a JSON object or the path that it would be exported to.
     */
    json(type: 'r1cs' | 'zkey', circuit: string): Promise<{
        json: object;
        path: string;
    }>;
    json(type: 'wtns', circuit: string, input: string): Promise<{
        json: object;
        path: string;
    }>;
    /** Compiles the circuit and returns a witness tester instance. */
    WitnessTester<IN extends string[] = [], OUT extends string[] = []>(circuit: string, circuitConfig: CircuitConfig & {
        recompile?: boolean;
    }): Promise<WitnessTester<IN, OUT>>;
    /** Returns a proof tester. */
    ProofTester<IN extends string[] = [], P extends CircomkitConfig['protocol'] = 'groth16'>(circuit: string, protocol: P): Promise<ProofTester<IN, P>>;
}

export { Circomkit, type CircomkitConfig, type CircuitConfig, type CircuitSignals, ProofTester, WitnessTester };
