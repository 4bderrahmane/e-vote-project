import type { EContracts, IRegisterContract, IStorageInstanceEntry } from "./types";
/**
 * @notice Contract storage keeps all deployed contracts with addresses, arguments in the json file.
 * This class is using for incremental deployment and verification.
 */
export declare class ContractStorage {
    /**
     * Singleton instance for class
     */
    private static INSTANCE?;
    /**
     * Json file database instance
     */
    private db;
    /**
     * Initialize class properties only once
     */
    private constructor();
    /**
     * Get singleton object
     *
     * @param storagePath - path to the storage file
     * @returns {ContractStorage} singleton object
     */
    static getInstance(storagePath?: string): ContractStorage;
    /**
     * Register contract and save contract address, constructor args in the json file
     *
     * @param {IRegisterContract} args - register arguments
     */
    register<ID = EContracts>({ id, key, contract, network, args, name }: IRegisterContract<ID>): Promise<void>;
    /**
     * Get contract instances from the json file
     *
     * @param network - selected network
     * @returns {[string, IStorageInstanceEntry][]} storage instance entries
     */
    getInstances(network: string): [string, IStorageInstanceEntry][];
    /**
     * Check if contract is verified or not locally
     *
     * @param address - contract address
     * @param network - selected network
     * @returns contract verified or not
     */
    getVerified(address: string, network: string): boolean;
    /**
     * Set contract verification in the json file
     *
     * @param address - contract address
     * @param network - selected network
     * @param verified - verified or not
     */
    setVerified: (address: string, network: string, verified: boolean) => void;
    /**
     * Get deployment arguments from the json file
     *
     * @param id - contract name
     * @param network - selected network
     * @param key - contract key
     * @returns deployment arguments
     */
    getContractArgs<ID extends string = EContracts>(id: ID, network: string, key?: string): string[] | undefined;
    /**
     * Get contract address by name from the json file
     *
     * @param id - contract name
     * @param network - selected network
     * @returns contract address
     */
    getAddress<ID extends string = EContracts>(id: ID, network: string, key?: string): string | undefined;
    /**
     * Get contract address by name from the json file
     *
     * @param id - contract name
     * @param network - selected network
     * @throws {Error} if there is no address the error will be thrown
     * @returns contract address
     */
    mustGetAddress<ID extends string = EContracts>(id: ID, network: string, key?: string): string;
    /**
     * Get Contract Deployment Transaction Hash
     */
    getDeploymentTxHash<ID extends string = EContracts>(id: ID, network: string, address: string): string | undefined;
    /**
     * Get contract from the json file with sizes and multi count
     *
     * @param deployer - deployer address
     * @param network - selected network
     * @returns {[entries: Map<string, string>, length: number, multiCount: number]}
     */
    printContracts(deployer: string, network: string): [Map<string, string>, number, number];
    /**
     * Clean json file for selected network
     *
     * @param network - selected network
     */
    cleanup(network: string): void;
}
//# sourceMappingURL=ContractStorage.d.ts.map