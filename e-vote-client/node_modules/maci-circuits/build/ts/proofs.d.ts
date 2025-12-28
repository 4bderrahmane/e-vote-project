import { type PublicSignals, type Groth16Proof } from "snarkjs";
import type { IGenProofOptions, ISnarkJSVerificationKey, FullProveResult } from "./types";
import type { IVkObjectParams } from "maci-domainobjs";
/**
 * Generate a zk-SNARK proof
 * @dev if running on a intel chip we use rapidsnark for
 * speed - on the other hand if running on ARM we need to use
 * snark and a WASM witness
 * @param inputs - the inputs to the circuit
 * @param zkeyPath - the path to the zkey
 * @param useWasm - whether we want to use the wasm witness or not
 * @param rapidsnarkExePath - the path to the rapidnsark binary
 * @param witnessExePath - the path to the compiled witness binary
 * @param wasmPath - the path to the wasm witness
 * @param silent - whether we want to print to the console or not
 * @returns the zk-SNARK proof and public signals
 */
export declare const genProof: ({ inputs, zkeyPath, useWasm, rapidsnarkExePath, witnessExePath, wasmPath, }: IGenProofOptions) => Promise<FullProveResult>;
/**
 * Verify a zk-SNARK proof using snarkjs
 * @param publicInputs - the public inputs to the circuit
 * @param proof - the proof
 * @param vk - the verification key
 * @param cleanup - whether to cleanup the threads or not
 * @returns whether the proof is valid or not
 */
export declare const verifyProof: (publicInputs: PublicSignals, proof: Groth16Proof, vk: ISnarkJSVerificationKey, cleanup?: boolean) => Promise<boolean>;
/**
 * Extract the Verification Key from a zKey
 * @param zkeyPath - the path to the zKey
 * @param cleanup - whether to cleanup the threads or not
 * @returns the verification key
 */
export declare const extractVk: (zkeyPath: string, cleanup?: boolean) => Promise<IVkObjectParams>;
//# sourceMappingURL=proofs.d.ts.map