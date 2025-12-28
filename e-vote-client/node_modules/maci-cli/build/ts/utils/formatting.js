"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.asHex = void 0;
/**
 * Convert a value to its hex representation
 * @param val - the value to convert
 * @returns the value converted as a hex string
 */
const asHex = (val) => `0x${BigInt(val).toString(16)}`;
exports.asHex = asHex;
//# sourceMappingURL=formatting.js.map