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
exports.extractVk = exports.verifyProof = exports.genProof = void 0;
const maci_crypto_1 = require("maci-crypto");
const snarkjs_1 = require("snarkjs");
const child_process_1 = __importDefault(require("child_process"));
const fs_1 = __importDefault(require("fs"));
const os_1 = require("os");
const path_1 = __importDefault(require("path"));
const utils_1 = require("./utils");
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
const genProof = async ({ inputs, zkeyPath, useWasm, rapidsnarkExePath, witnessExePath, wasmPath, }) => {
    // if we want to use a wasm witness we use snarkjs
    if (useWasm) {
        if (!wasmPath) {
            throw new Error("wasmPath must be specified");
        }
        const isWasmExists = fs_1.default.existsSync(wasmPath);
        if (!isWasmExists) {
            throw new Error(`wasmPath ${wasmPath} does not exist`);
        }
        const { proof, publicSignals } = await snarkjs_1.groth16.fullProve(inputs, wasmPath, zkeyPath);
        return { proof, publicSignals };
    }
    if ((0, utils_1.isArm)()) {
        throw new Error("To use rapidnsnark you currently need to be running on an intel chip");
    }
    // intel chip flow (use rapidnsark)
    // Create tmp directory
    const tmpPath = path_1.default.resolve((0, os_1.tmpdir)(), `tmp-${Date.now()}`);
    await fs_1.default.promises.mkdir(tmpPath, { recursive: true });
    const inputJsonPath = path_1.default.resolve(tmpPath, "input.json");
    const outputWtnsPath = path_1.default.resolve(tmpPath, "output.wtns");
    const proofJsonPath = path_1.default.resolve(tmpPath, "proof.json");
    const publicJsonPath = path_1.default.resolve(tmpPath, "public.json");
    // Write input.json
    const jsonData = JSON.stringify((0, maci_crypto_1.stringifyBigInts)(inputs));
    await fs_1.default.promises.writeFile(inputJsonPath, jsonData);
    const { promisify } = await Promise.resolve().then(() => __importStar(require("util")));
    const execFile = promisify(child_process_1.default.execFile);
    // Generate the witness
    await execFile(witnessExePath, [inputJsonPath, outputWtnsPath]);
    const isOutputWtnsExists = fs_1.default.existsSync(outputWtnsPath);
    if (!isOutputWtnsExists) {
        throw new Error(`Error executing ${witnessExePath} ${inputJsonPath} ${outputWtnsPath}`);
    }
    // Generate the proof
    await execFile(rapidsnarkExePath, [zkeyPath, outputWtnsPath, proofJsonPath, publicJsonPath]);
    const isProofJsonPathExists = fs_1.default.existsSync(proofJsonPath);
    if (!isProofJsonPathExists) {
        throw new Error(`Error executing ${rapidsnarkExePath} ${zkeyPath} ${outputWtnsPath} ${proofJsonPath} ${publicJsonPath}`);
    }
    // Read the proof and public inputs
    const proof = JSON.parse(await fs_1.default.promises.readFile(proofJsonPath).then((res) => res.toString()));
    const publicSignals = JSON.parse(await fs_1.default.promises.readFile(publicJsonPath).then((res) => res.toString()));
    // remove all artifacts
    await Promise.all([proofJsonPath, publicJsonPath, inputJsonPath, outputWtnsPath].map(unlinkFile));
    // remove tmp directory
    await fs_1.default.promises.rmdir(tmpPath);
    return { proof, publicSignals };
};
exports.genProof = genProof;
async function unlinkFile(filepath) {
    const isFileExists = fs_1.default.existsSync(filepath);
    if (isFileExists) {
        await fs_1.default.promises.unlink(filepath);
    }
}
/**
 * Verify a zk-SNARK proof using snarkjs
 * @param publicInputs - the public inputs to the circuit
 * @param proof - the proof
 * @param vk - the verification key
 * @param cleanup - whether to cleanup the threads or not
 * @returns whether the proof is valid or not
 */
const verifyProof = async (publicInputs, proof, vk, cleanup = true) => {
    const isValid = await snarkjs_1.groth16.verify(vk, publicInputs, proof);
    if (cleanup) {
        await (0, utils_1.cleanThreads)();
    }
    return isValid;
};
exports.verifyProof = verifyProof;
/**
 * Extract the Verification Key from a zKey
 * @param zkeyPath - the path to the zKey
 * @param cleanup - whether to cleanup the threads or not
 * @returns the verification key
 */
const extractVk = async (zkeyPath, cleanup = true) => snarkjs_1.zKey
    .exportVerificationKey(zkeyPath)
    .then((vk) => vk)
    .finally(() => {
    if (cleanup) {
        (0, utils_1.cleanThreads)();
    }
});
exports.extractVk = extractVk;
//# sourceMappingURL=proofs.js.map