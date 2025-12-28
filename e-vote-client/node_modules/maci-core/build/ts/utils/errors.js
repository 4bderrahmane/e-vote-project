"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProcessMessageError = exports.ProcessMessageErrors = void 0;
/**
 * An enum describing the possible errors that can occur
 * in Poll.processMessage()
 */
var ProcessMessageErrors;
(function (ProcessMessageErrors) {
    ProcessMessageErrors["InvalidCommand"] = "invalid command";
    ProcessMessageErrors["InvalidStateLeafIndex"] = "invalid state leaf index";
    ProcessMessageErrors["InvalidSignature"] = "invalid signature";
    ProcessMessageErrors["InvalidNonce"] = "invalid nonce";
    ProcessMessageErrors["InsufficientVoiceCredits"] = "insufficient voice credits";
    ProcessMessageErrors["InvalidVoteOptionIndex"] = "invalid vote option index";
    ProcessMessageErrors["FailedDecryption"] = "failed decryption due to either wrong encryption public key or corrupted ciphertext";
})(ProcessMessageErrors || (exports.ProcessMessageErrors = ProcessMessageErrors = {}));
/**
 * A class which extends the Error class
 * which is to be used when an error occurs
 * in Poll.processMessage()
 */
class ProcessMessageError extends Error {
    /**
     * Generate a new instance of the ProcessMessageError class
     * @param code - the error code
     */
    constructor(code) {
        super(code);
        this.code = code;
        this.name = this.constructor.name;
    }
}
exports.ProcessMessageError = ProcessMessageError;
//# sourceMappingURL=errors.js.map