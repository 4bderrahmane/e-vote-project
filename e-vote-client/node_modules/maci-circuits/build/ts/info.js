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
exports.info = info;
// eslint-disable-next-line import/no-extraneous-dependencies
const glob_1 = require("glob");
const child_process_1 = __importDefault(require("child_process"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
async function info(zkeysPath) {
    const files = await (0, glob_1.glob)("**/*.r1cs", { cwd: zkeysPath });
    const circuitsConfigPath = path_1.default.resolve(__dirname, "..", "circom", "circuits.json");
    const circuitsConfig = JSON.parse(await fs_1.default.promises.readFile(circuitsConfigPath, "utf-8"));
    const params = files
        .map((file) => ({ config: circuitsConfig[file.split("/")[0]], file }))
        .reduce((acc, { config, file }) => {
        acc[file] = `${config.template} [${config.params?.toString()}]`;
        return acc;
    }, {});
    const { promisify } = await Promise.resolve().then(() => __importStar(require("util")));
    const execFile = promisify(child_process_1.default.execFile);
    const data = [];
    // eslint-disable-next-line @typescript-eslint/prefer-for-of
    for (let index = 0; index < files.length; index += 1) {
        // eslint-disable-next-line no-await-in-loop
        const result = await execFile("snarkjs", ["r1cs", "info", path_1.default.resolve(zkeysPath, files[index])]);
        data.push(result);
    }
    // eslint-disable-next-line no-console
    console.log(data.map(({ stdout }, index) => `${files[index]}\n${params[files[index]]}\n${stdout}`).join("\n"));
}
if (require.main === module) {
    (async () => {
        await info(process.argv[process.argv.indexOf("--zkeys") + 1]);
    })();
}
//# sourceMappingURL=info.js.map