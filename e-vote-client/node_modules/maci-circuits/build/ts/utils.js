"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.cleanThreads = exports.isArm = void 0;
const os_1 = __importDefault(require("os"));
/**
 * Check if we are running on an arm chip
 * @returns whether we are running on an arm chip
 */
const isArm = () => os_1.default.arch().includes("arm");
exports.isArm = isArm;
/*
 * https://github.com/iden3/snarkjs/issues/152
 * Need to cleanup the threads to avoid stalling
 */
const cleanThreads = async () => {
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (!globalThis) {
        return;
    }
    const curves = ["curve_bn128", "curve_bls12381"];
    await Promise.all(curves.map((curve) => globalThis[curve]?.terminate()).filter(Boolean));
};
exports.cleanThreads = cleanThreads;
//# sourceMappingURL=utils.js.map