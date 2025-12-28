"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NOTHING_UP_MY_SLEEVE = exports.SNARK_FIELD_SIZE = void 0;
const baby_jubjub_1 = require("@zk-kit/baby-jubjub");
const ethers_1 = require("ethers");
const assert_1 = __importDefault(require("assert"));
exports.SNARK_FIELD_SIZE = baby_jubjub_1.r;
// A nothing-up-my-sleeve zero value
// Should be equal to 8370432830353022751713833565135785980866757267633941821328460903436894336785
exports.NOTHING_UP_MY_SLEEVE = BigInt((0, ethers_1.keccak256)((0, ethers_1.toUtf8Bytes)("Maci"))) % exports.SNARK_FIELD_SIZE;
(0, assert_1.default)(exports.NOTHING_UP_MY_SLEEVE === BigInt("8370432830353022751713833565135785980866757267633941821328460903436894336785"));
//# sourceMappingURL=constants.js.map