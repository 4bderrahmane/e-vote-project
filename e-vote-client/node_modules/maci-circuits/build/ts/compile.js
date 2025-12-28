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
exports.compileCircuits = void 0;
const circomkit_1 = require("circomkit");
const child_process_1 = __importDefault(require("child_process"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
/**
 * Compile MACI's circuits using circomkit
 * and setup the dir structure
 * @param cWitness - whether to compile to the c witness generator
 * or not
 * @param outputPath - the path to the output folder
 * @returns the build directory
 */
const compileCircuits = async (cWitness, outputPath) => {
    // read circomkit config files
    const configFilePath = path_1.default.resolve(__dirname, "..", "circomkit.json");
    const circomKitConfig = JSON.parse(await fs_1.default.promises.readFile(configFilePath, "utf-8"));
    const circuitsConfigPath = path_1.default.resolve(__dirname, "..", "circom", "circuits.json");
    const circuitsConfigContent = JSON.parse(await fs_1.default.promises.readFile(circuitsConfigPath, "utf-8"));
    const circuitsConfigs = Object.entries(circuitsConfigContent).map(([name, config]) => ({
        name,
        ...config,
    }));
    // generate the absolute path to the output folder
    const outputPathUpdated = outputPath ? path_1.default.resolve(outputPath) : undefined;
    // set the config based on whether to compile the c witness or no
    if (cWitness) {
        circomKitConfig.cWitness = true;
    }
    else {
        circomKitConfig.cWitness = false;
    }
    // update the build directory if we have an output path
    if (outputPathUpdated) {
        circomKitConfig.dirBuild = outputPathUpdated;
        circomKitConfig.dirPtau = outputPathUpdated;
    }
    // create an instance of circomkit with a custom config
    const circomkitInstance = new circomkit_1.Circomkit({
        ...circomKitConfig,
        verbose: false,
    });
    const { promisify } = await Promise.resolve().then(() => __importStar(require("util")));
    const execFile = promisify(child_process_1.default.execFile);
    // loop through each circuit config and compile them
    // eslint-disable-next-line @typescript-eslint/prefer-for-of
    for (let i = 0; i < circuitsConfigs.length; i += 1) {
        const circuit = circuitsConfigs[i];
        // eslint-disable-next-line no-console
        console.log(`Compiling ${circuit.name}...`);
        // eslint-disable-next-line no-await-in-loop
        const outPath = await circomkitInstance.compile(circuit.name, circuit);
        // if the circuit is compiled with a c witness, then let's run make in the directory
        if (cWitness) {
            try {
                // build
                // eslint-disable-next-line no-await-in-loop
                await execFile("bash", ["-c", `cd ${outPath}/${circuit.name}_cpp && make`]);
            }
            catch (error) {
                throw new Error(`Failed to compile the c witness for ${circuit.name}`);
            }
        }
    }
    // return the build directory
    return circomKitConfig.dirBuild;
};
exports.compileCircuits = compileCircuits;
if (require.main === module) {
    (async () => {
        // check if we want to compile the c witness or not
        const cWitness = process.argv.includes("--cWitness");
        // the output path is the next argument after the --outPath flag
        // and is not mandatory
        const outputPathIndex = process.argv.indexOf("--outPath");
        if (outputPathIndex === -1) {
            await (0, exports.compileCircuits)(cWitness);
        }
        else {
            const outputFolder = process.argv[outputPathIndex + 1];
            await (0, exports.compileCircuits)(cWitness, outputFolder);
        }
    })();
}
//# sourceMappingURL=compile.js.map