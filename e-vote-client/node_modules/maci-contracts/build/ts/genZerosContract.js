"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.genZerosContract = void 0;
const maci_crypto_1 = require("maci-crypto");
const assert_1 = __importDefault(require("assert"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const genZerosContract = async ({ name, zeroVal, hashLength, numZeros, comment, useSha256, subDepth, }) => {
    (0, assert_1.default)(hashLength === 2 || hashLength === 5);
    const template = await fs_1.default.promises
        .readFile(path_1.default.resolve(__dirname, "..", "templates", "MerkleZeros.sol.template"))
        .then((res) => res.toString());
    const hashes = [zeroVal];
    for (let index = 1; index < numZeros; index += 1) {
        const zero = hashes[index - 1];
        let hashed;
        if (useSha256 && index <= subDepth) {
            hashed = (0, maci_crypto_1.sha256Hash)([zero, zero, zero, zero, zero].slice(0, hashLength));
        }
        else if (hashLength === 2) {
            hashed = (0, maci_crypto_1.hashLeftRight)(zero, zero);
        }
        else {
            hashed = (0, maci_crypto_1.hash5)([zero, zero, zero, zero, zero]);
        }
        hashes.push(hashed);
    }
    const zeros = hashes.map((hash, index) => `${"".padStart(4)}zeros[${index}] = uint256(${hash.toString()});`);
    return template
        .replace("<% CONTRACT_NAME %>", name)
        .replace("<% NUM_ZEROS %>", numZeros.toString())
        .replace("<% ZEROS %>", zeros.join("\n"))
        .replace("<% COMMENT %>", comment.trim())
        .trim();
};
exports.genZerosContract = genZerosContract;
//# sourceMappingURL=genZerosContract.js.map