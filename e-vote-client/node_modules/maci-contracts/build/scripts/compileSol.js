"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const circomlibjs_1 = require("circomlibjs");
const hardhat_1 = __importDefault(require("hardhat"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const genZerosContract_1 = require("../ts/genZerosContract");
const PATHS = [
    path_1.default.resolve(__dirname, "..", "artifacts"),
    path_1.default.resolve(__dirname, "..", "cache"),
    path_1.default.resolve(__dirname, "..", "typechain-types"),
];
const NOTHING_UP_MY_SLEEVE_MACI_NUMS = 8370432830353022751713833565135785980866757267633941821328460903436894336785n;
const BLANK_STATE_LEAF = 6769006970205099520508948723718471724660867171122235270773600567925038008762n;
const NUM_ZEROS = 33;
const ZERO_TREES = [
    {
        name: "MerkleBinary0",
        zero: 0n,
        hashLength: 2,
        comment: "Binary tree zeros (0)",
    },
    {
        name: "MerkleBinaryMaci",
        zero: NOTHING_UP_MY_SLEEVE_MACI_NUMS,
        hashLength: 2,
        comment: "Binary tree zeros (Keccak hash of 'Maci')",
    },
    {
        name: "MerkleBinaryBlankSl",
        zero: BLANK_STATE_LEAF,
        hashLength: 2,
        comment: "Binary tree zeros (hash of a blank state leaf)",
    },
    {
        name: "MerkleQuinary0",
        zero: 0n,
        hashLength: 5,
        comment: "Quinary tree zeros (0)",
    },
    {
        name: "MerkleQuinaryMaci",
        zero: NOTHING_UP_MY_SLEEVE_MACI_NUMS,
        hashLength: 5,
        comment: "Quinary tree zeros (Keccak hash of 'Maci')",
    },
    {
        name: "MerkleQuinaryBlankSl",
        zero: BLANK_STATE_LEAF,
        hashLength: 5,
        comment: "Quinary tree zeros (hash of a blank state leaf)",
    },
];
const buildPoseidon = async (numInputs) => {
    await hardhat_1.default.overwriteArtifact(`PoseidonT${numInputs + 1}`, circomlibjs_1.poseidonContract.createCode(numInputs));
};
const buildPoseidonT3 = () => buildPoseidon(2);
const buildPoseidonT4 = () => buildPoseidon(3);
const buildPoseidonT5 = () => buildPoseidon(4);
const buildPoseidonT6 = () => buildPoseidon(5);
async function main() {
    await Promise.all(PATHS.map((filepath) => fs_1.default.existsSync(filepath) && fs_1.default.promises.rm(filepath, { recursive: true })));
    await Promise.all(ZERO_TREES.map(({ name, zero, hashLength, comment }) => (0, genZerosContract_1.genZerosContract)({
        name,
        zeroVal: zero,
        hashLength,
        numZeros: NUM_ZEROS,
        comment,
        useSha256: false,
        subDepth: 0,
    }).then((text) => fs_1.default.promises.writeFile(path_1.default.resolve(__dirname, "..", "contracts/trees/zeros", `${name}.sol`), `${text}\n`))));
    await hardhat_1.default.run("compile");
    await Promise.all([buildPoseidonT3(), buildPoseidonT4(), buildPoseidonT5(), buildPoseidonT6()]);
}
main();
//# sourceMappingURL=compileSol.js.map