"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateSalt = void 0;
const maci_crypto_1 = require("maci-crypto");
/**
 * Run both format check and size check on a salt value
 * @param salt the salt to validate
 * @returns whether it is valid or not
 */
const validateSalt = (salt) => salt < maci_crypto_1.SNARK_FIELD_SIZE;
exports.validateSalt = validateSalt;
//# sourceMappingURL=salt.js.map