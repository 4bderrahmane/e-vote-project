"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fundWallet = void 0;
const utils_1 = require("../utils");
/**
 * Fund a new wallet with Ether
 * @param amount - the amount of Ether to send
 * @param address - the address of the wallet to fund
 * @param quiet - whether to log the output
 */
const fundWallet = async ({ amount, address, signer, quiet = true }) => {
    (0, utils_1.banner)(quiet);
    // fund the wallet by sending Ether to it
    try {
        const tx = await signer.sendTransaction({
            to: address,
            value: amount.toString(),
        });
        const receipt = await tx.wait();
        if (receipt?.status !== 1) {
            (0, utils_1.logError)("Transaction failed");
        }
        (0, utils_1.logYellow)(quiet, (0, utils_1.info)(`Transaction hash: ${tx.hash}`));
        (0, utils_1.logGreen)(quiet, (0, utils_1.success)(`Successfully funded ${address} with ${amount} wei`));
    }
    catch (error) {
        (0, utils_1.logError)(error.message);
    }
};
exports.fundWallet = fundWallet;
//# sourceMappingURL=fundWallet.js.map