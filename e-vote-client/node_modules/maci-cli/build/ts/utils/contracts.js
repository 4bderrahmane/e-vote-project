"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.currentBlockTimestamp = exports.contractExists = void 0;
/**
 * Small utility function to check whether a contract exists at a given address
 * @param provider - the provider to use to interact with the chain
 * @param address - the address of the contract to check
 * @returns a boolean indicating whether the contract exists
 */
const contractExists = async (provider, address) => {
    const code = await provider.getCode(address);
    return code.length > 2;
};
exports.contractExists = contractExists;
/**
 * Small utility to retrieve the current block timestamp from the blockchain
 * @param provider the provider to use to interact with the chain
 * @returns the current block timestamp
 */
const currentBlockTimestamp = async (provider) => {
    const blockNum = await provider.getBlockNumber();
    const block = await provider.getBlock(blockNum);
    return Number(block?.timestamp);
};
exports.currentBlockTimestamp = currentBlockTimestamp;
//# sourceMappingURL=contracts.js.map