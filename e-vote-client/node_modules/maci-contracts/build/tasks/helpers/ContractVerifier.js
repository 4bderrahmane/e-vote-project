"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContractVerifier = void 0;
/**
 * @notice Contract verifier allows to verify contract using hardhat-etherscan plugin.
 */
class ContractVerifier {
    /**
     * Initialize class properties
     *
     * @param hre - Hardhat runtime environment
     */
    constructor(hre) {
        this.hre = hre;
    }
    /**
     * Verify contract through etherscan
     *
     * @param address - contract address
     * @param constructorArguments - stringified constructor arguments
     * @param libraries - stringified libraries which can't be detected automatically
     * @returns
     */
    async verify(address, constructorArguments, contract, libraries) {
        const params = {
            address,
            constructorArguments: JSON.parse(constructorArguments),
            contract,
        };
        if (libraries) {
            params.libraries = JSON.parse(libraries);
        }
        // Run etherscan task
        const error = await this.hre
            .run("verify:verify", params)
            .then(() => "")
            .catch((err) => {
            if (err.message === "Contract source code already verified") {
                return "";
            }
            return err.message;
        });
        return [!error, error];
    }
}
exports.ContractVerifier = ContractVerifier;
//# sourceMappingURL=ContractVerifier.js.map