"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.uuidToBigInt = uuidToBigInt;
const uuid_1 = require("uuid");
/**
 * Converts a UUID string into a bigint.
 */
function uuidToBigInt(v) {
    // a uuid is just a particular representation of 16 bytes
    const bytes = (0, uuid_1.parse)(v);
    return BigInt(`0x${Buffer.from(bytes).toString("hex")}`);
}
//# sourceMappingURL=numericParser.js.map