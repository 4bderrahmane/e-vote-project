/**
 * Read a JSON file from disk
 * @param path - the path of the file
 * @returns the JSON object
 */
export declare const readJSONFile: (path: string) => Promise<Record<string, Record<string, string> | undefined>>;
/**
 * Store a contract address to the local address store file
 * @param contractName - the name of the contract
 * @param address - the address of the contract
 */
export declare const storeContractAddress: (contractName: string, address: string, network?: string) => Promise<void>;
/**
 * Read a contract address from the local address store file
 * @param contractName - the name of the contract
 * @returns the contract address or a undefined if it does not exist
 */
export declare const readContractAddress: (contractName: string, network?: string) => Promise<string>;
/**
 * Delete the content of the contract address file
 */
export declare const resetContractAddresses: () => Promise<void>;
/**
 * Check if an array of paths exist on the local file system
 * @param paths - the array of paths to check
 * @returns an array of boolean and string,
 * where the boolean indicates whether all paths exist, and the string
 * is the path that does not exist
 */
export declare const doesPathExist: (paths: string[]) => [boolean, string | null];
//# sourceMappingURL=storage.d.ts.map