"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.doesPathExist = exports.resetContractAddresses = exports.readContractAddress = exports.storeContractAddress = exports.readJSONFile = void 0;
const fs_1 = __importDefault(require("fs"));
const constants_1 = require("./constants");
const theme_1 = require("./theme");
/**
 * Read a JSON file from disk
 * @param path - the path of the file
 * @returns the JSON object
 */
const readJSONFile = async (path) => {
    const isExists = fs_1.default.existsSync(path);
    if (!isExists) {
        (0, theme_1.logError)(`File ${path} does not exist`);
    }
    return JSON.parse(await fs_1.default.promises.readFile(path).then((res) => res.toString()));
};
exports.readJSONFile = readJSONFile;
/**
 * Store a contract address to the local address store file
 * @param contractName - the name of the contract
 * @param address - the address of the contract
 */
const storeContractAddress = async (contractName, address, network = "default") => {
    // if it does not exist yet, then create it
    const isContractAddressesStoreExists = fs_1.default.existsSync(constants_1.contractAddressesStore);
    if (!isContractAddressesStoreExists) {
        await fs_1.default.promises.writeFile(constants_1.contractAddressesStore, "{}");
    }
    const contractAddrs = await (0, exports.readJSONFile)(constants_1.contractAddressesStore);
    if (!contractAddrs[network]) {
        contractAddrs[network] = {};
    }
    contractAddrs[network][contractName] = address;
    await fs_1.default.promises.writeFile(constants_1.contractAddressesStore, JSON.stringify(contractAddrs, null, 4));
};
exports.storeContractAddress = storeContractAddress;
/**
 * Read a contract address from the local address store file
 * @param contractName - the name of the contract
 * @returns the contract address or a undefined if it does not exist
 */
const readContractAddress = async (contractName, network = "default") => {
    try {
        const result = await (0, exports.readJSONFile)(constants_1.contractAddressesStore);
        return result[network]?.[contractName] || "";
    }
    catch (error) {
        return "";
    }
};
exports.readContractAddress = readContractAddress;
/**
 * Delete the content of the contract address file
 */
const resetContractAddresses = async () => {
    await fs_1.default.promises.writeFile(constants_1.contractAddressesStore, JSON.stringify({}, null, 4));
};
exports.resetContractAddresses = resetContractAddresses;
/**
 * Check if an array of paths exist on the local file system
 * @param paths - the array of paths to check
 * @returns an array of boolean and string,
 * where the boolean indicates whether all paths exist, and the string
 * is the path that does not exist
 */
const doesPathExist = (paths) => {
    const notFoundPath = paths.find((path) => !fs_1.default.existsSync(path));
    return notFoundPath ? [false, notFoundPath] : [true, null];
};
exports.doesPathExist = doesPathExist;
//# sourceMappingURL=storage.js.map