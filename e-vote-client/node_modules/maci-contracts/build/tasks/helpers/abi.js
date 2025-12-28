"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.linkPoseidonLibraries = void 0;
/**
 * Create linked contract addresses object
 *
 * @param poseidonT3ContractAddress - PoseidonT3 contract address
 * @param poseidonT4ContractAddress - PoseidonT4 contract address
 * @param poseidonT5ContractAddress - PoseidonT5 contract address
 * @param poseidonT6ContractAddress - PoseidonT6 contract address
 * @returns
 */
const linkPoseidonLibraries = (poseidonT3ContractAddress, poseidonT4ContractAddress, poseidonT5ContractAddress, poseidonT6ContractAddress) => ({
    "contracts/crypto/PoseidonT3.sol:PoseidonT3": poseidonT3ContractAddress,
    "contracts/crypto/PoseidonT4.sol:PoseidonT4": poseidonT4ContractAddress,
    "contracts/crypto/PoseidonT5.sol:PoseidonT5": poseidonT5ContractAddress,
    "contracts/crypto/PoseidonT6.sol:PoseidonT6": poseidonT6ContractAddress,
});
exports.linkPoseidonLibraries = linkPoseidonLibraries;
//# sourceMappingURL=abi.js.map