"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("@nomicfoundation/hardhat-toolbox");
const dotenv_1 = require("dotenv");
const path_1 = __importDefault(require("path"));
const defaults_1 = require("./ts/utils/defaults");
(0, dotenv_1.config)();
const parentDir = __dirname.includes("build") ? ".." : "";
const config = {
    defaultNetwork: "localhost",
    networks: {
        localhost: {
            url: process.env.ETH_PROVIDER || defaults_1.DEFAULT_ETH_PROVIDER,
            accounts: [process.env.ETH_SK || defaults_1.DEFAULT_ETH_SK],
            loggingEnabled: false,
        },
    },
    paths: {
        sources: path_1.default.resolve(__dirname, parentDir, "../contracts/contracts"),
        artifacts: path_1.default.resolve(__dirname, parentDir, "../contracts/artifacts"),
    },
};
exports.default = config;
//# sourceMappingURL=hardhat.config.js.map