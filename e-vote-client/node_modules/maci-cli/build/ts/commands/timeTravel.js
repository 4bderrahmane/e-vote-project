"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.timeTravel = void 0;
const utils_1 = require("../utils");
/**
 * Utility to travel in time when using a local blockchain
 * @param seconds - the number of seconds to travel in time
 * @param quiet - whether to log the output
 */
const timeTravel = async ({ seconds, signer, quiet = true }) => {
    (0, utils_1.banner)(quiet);
    try {
        // send the instructions to the provider
        await signer.provider.send("evm_increaseTime", [Number(seconds)]);
        await signer.provider.send("evm_mine", []);
        (0, utils_1.logGreen)(quiet, (0, utils_1.success)(`Fast-forwarded ${seconds} seconds`));
    }
    catch (error) {
        (0, utils_1.logError)(error.message);
    }
};
exports.timeTravel = timeTravel;
//# sourceMappingURL=timeTravel.js.map