import type { HardhatRuntimeEnvironment } from "hardhat/types";
/**
 * @notice Contract verifier allows to verify contract using hardhat-etherscan plugin.
 */
export declare class ContractVerifier {
    /**
     * Hardhat runtime environment
     */
    private hre;
    /**
     * Initialize class properties
     *
     * @param hre - Hardhat runtime environment
     */
    constructor(hre: HardhatRuntimeEnvironment);
    /**
     * Verify contract through etherscan
     *
     * @param address - contract address
     * @param constructorArguments - stringified constructor arguments
     * @param libraries - stringified libraries which can't be detected automatically
     * @returns
     */
    verify(address: string, constructorArguments: string, contract?: string, libraries?: string): Promise<[boolean, string]>;
}
//# sourceMappingURL=ContractVerifier.d.ts.map