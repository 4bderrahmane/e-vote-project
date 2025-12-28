"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateZkeys = void 0;
const circomkit_1 = require("circomkit");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const utils_1 = require("./utils");
/**
 * Generate the zkeys for MACI's circuits using circomkit
 * @dev This should only be used for testing purposes, or to generate the genesis zkey
 * for a new trusted setup ceremony. Never use zkeys that have not undergone a ceremony
 * in production.
 * @param outPath - the path to the output folder
 */
const generateZkeys = async (outputPath) => {
    // read circomkit config files
    const configFilePath = path_1.default.resolve(__dirname, "..", "circomkit.json");
    const circomKitConfig = JSON.parse(await fs_1.default.promises.readFile(configFilePath, "utf-8"));
    const circuitsConfigPath = path_1.default.resolve(__dirname, "..", "circom", "circuits.json");
    const circuitsConfigContent = JSON.parse(await fs_1.default.promises.readFile(circuitsConfigPath, "utf-8"));
    const circuitsConfigs = Object.entries(circuitsConfigContent).map(([name, config]) => ({
        name,
        ...config,
    }));
    const outPath = outputPath ? path_1.default.resolve(outputPath) : undefined;
    // update the output directory
    if (outPath) {
        circomKitConfig.dirBuild = outPath;
        circomKitConfig.dirPtau = outPath;
    }
    const circomkitInstance = new circomkit_1.Circomkit({
        ...circomKitConfig,
        verbose: false,
    });
    // loop through each circuit config and compile them
    // eslint-disable-next-line @typescript-eslint/prefer-for-of
    for (let i = 0; i < circuitsConfigs.length; i += 1) {
        const circuit = circuitsConfigs[i];
        // eslint-disable-next-line no-console
        console.log(`Generating zKey for ${circuit.name}...`);
        // eslint-disable-next-line no-await-in-loop
        const { proverKeyPath } = await circomkitInstance.setup(circuit.name);
        // rename the zkey
        const zkeyPath = path_1.default.resolve(circomKitConfig.dirBuild, circuit.name, `${circuit.name}.0.zkey`);
        // eslint-disable-next-line no-await-in-loop
        await fs_1.default.promises.rename(proverKeyPath, zkeyPath);
    }
    // clean up the threads so we can exit
    await (0, utils_1.cleanThreads)();
};
exports.generateZkeys = generateZkeys;
if (require.main === module) {
    (async () => {
        const outputPathIndex = process.argv.indexOf("--outPath");
        if (outputPathIndex === -1) {
            await (0, exports.generateZkeys)();
        }
        else {
            const outputFolder = process.argv[process.argv.indexOf("--outPath") + 1];
            await (0, exports.generateZkeys)(outputFolder);
        }
    })();
}
//# sourceMappingURL=genZkeys.js.map