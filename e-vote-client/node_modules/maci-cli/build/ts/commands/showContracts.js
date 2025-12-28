"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.showContracts = void 0;
const fs_1 = __importDefault(require("fs"));
const utils_1 = require("../utils");
/**
 * Utility to print all contracts that have been deployed using maci-cli
 * @param quiet - whether to log the output
 */
const showContracts = (quiet = false) => {
    (0, utils_1.banner)(quiet);
    if (!fs_1.default.existsSync(utils_1.contractAddressesStore)) {
        (0, utils_1.logError)("No contracts have been deployed yet");
    }
    const data = JSON.parse(fs_1.default.readFileSync(utils_1.contractAddressesStore, "utf8").toString());
    Object.entries(data).forEach(([key, value]) => {
        (0, utils_1.logGreen)(quiet, (0, utils_1.info)(`${key}: ${value}`));
    });
};
exports.showContracts = showContracts;
//# sourceMappingURL=showContracts.js.map