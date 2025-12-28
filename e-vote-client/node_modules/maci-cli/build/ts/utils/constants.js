"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.oldContractAddressesStore = exports.contractAddressesStore = exports.oldContractAddressStoreName = exports.contractAddressStoreName = void 0;
const path_1 = __importDefault(require("path"));
// local file name where we are storing the contract addresses
exports.contractAddressStoreName = "contractAddresses.json";
// local file name where we are storing a previous deployment's contract addresses
exports.oldContractAddressStoreName = "contractAddresses.old.json";
// local file path where we are storing the contract addresses
exports.contractAddressesStore = path_1.default.resolve(__dirname, "..", "..", exports.contractAddressStoreName);
// local file path where we are storing a previous deployment's contract addresses
exports.oldContractAddressesStore = path_1.default.resolve(__dirname, "..", "..", exports.oldContractAddressStoreName);
//# sourceMappingURL=constants.js.map