import type { Provider } from "ethers";
/**
 * Small utility function to check whether a contract exists at a given address
 * @param provider - the provider to use to interact with the chain
 * @param address - the address of the contract to check
 * @returns a boolean indicating whether the contract exists
 */
export declare const contractExists: (provider: Provider, address: string) => Promise<boolean>;
/**
 * Small utility to retrieve the current block timestamp from the blockchain
 * @param provider the provider to use to interact with the chain
 * @returns the current block timestamp
 */
export declare const currentBlockTimestamp: (provider: Provider) => Promise<number>;
//# sourceMappingURL=contracts.d.ts.map