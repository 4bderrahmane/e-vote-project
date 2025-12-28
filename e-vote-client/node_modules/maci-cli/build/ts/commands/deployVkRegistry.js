"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deployVkRegistryContract = void 0;
const maci_contracts_1 = require("maci-contracts");
const fs_1 = __importDefault(require("fs"));
const utils_1 = require("../utils");
/**
 * Deploy the vkRegistry contract
 * @param quiet - whether to print the contract address
 */
const deployVkRegistryContract = async ({ signer, quiet = true }) => {
    (0, utils_1.banner)(quiet);
    // assume that the vkRegistry contract is the first one to be deployed
    const isContractAddressesStoreExists = fs_1.default.existsSync(utils_1.contractAddressesStore);
    if (isContractAddressesStoreExists) {
        await fs_1.default.promises.rename(utils_1.contractAddressesStore, utils_1.oldContractAddressesStore);
        await (0, utils_1.resetContractAddresses)();
    }
    const network = await signer.provider?.getNetwork();
    // deploy and store the address
    const vkRegistry = await (0, maci_contracts_1.deployVkRegistry)(signer, true);
    const vkRegistryAddress = await vkRegistry.getAddress();
    await (0, utils_1.storeContractAddress)("VkRegistry", vkRegistryAddress, network?.name);
    (0, utils_1.logGreen)(quiet, (0, utils_1.success)(`VkRegistry deployed at: ${vkRegistryAddress}`));
    return vkRegistryAddress;
};
exports.deployVkRegistryContract = deployVkRegistryContract;
//# sourceMappingURL=deployVkRegistry.js.map