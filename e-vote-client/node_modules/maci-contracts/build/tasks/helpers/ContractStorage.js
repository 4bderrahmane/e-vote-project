"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContractStorage = void 0;
/* eslint-disable import/no-extraneous-dependencies, no-console */
const lowdb_1 = __importDefault(require("lowdb"));
const FileSync_1 = __importDefault(require("lowdb/adapters/FileSync"));
const LocalStorage_1 = __importDefault(require("lowdb/adapters/LocalStorage"));
const path_1 = __importDefault(require("path"));
/**
 * @notice Contract storage keeps all deployed contracts with addresses, arguments in the json file.
 * This class is using for incremental deployment and verification.
 */
class ContractStorage {
    /**
     * Initialize class properties only once
     */
    constructor(storagePath) {
        /**
         * Set contract verification in the json file
         *
         * @param address - contract address
         * @param network - selected network
         * @param verified - verified or not
         */
        this.setVerified = (address, network, verified) => {
            this.db.set(`${network}.verified.${address}`, verified).write();
        };
        this.db = (0, lowdb_1.default)(typeof window !== "undefined"
            ? new LocalStorage_1.default("deployed-contracts")
            : new FileSync_1.default(storagePath ?? path_1.default.resolve(process.cwd(), "./deployed-contracts.json")));
    }
    /**
     * Get singleton object
     *
     * @param storagePath - path to the storage file
     * @returns {ContractStorage} singleton object
     */
    static getInstance(storagePath) {
        if (!ContractStorage.INSTANCE) {
            ContractStorage.INSTANCE = new ContractStorage(storagePath);
        }
        return ContractStorage.INSTANCE;
    }
    /**
     * Register contract and save contract address, constructor args in the json file
     *
     * @param {IRegisterContract} args - register arguments
     */
    async register({ id, key, contract, network, args, name }) {
        const contractAddress = await contract.getAddress();
        const deploymentTx = contract.deploymentTransaction();
        const contractId = String(id);
        console.log(`*** ${contractId} ***\n`);
        console.log(`Network: ${network}`);
        console.log(`contract address: ${contractAddress}`);
        if (deploymentTx) {
            console.log(`tx: ${deploymentTx.hash}`);
            console.log(`deployer address: ${deploymentTx.from}`);
            console.log(`gas price: ${deploymentTx.gasPrice}`);
            console.log(`gas used: ${deploymentTx.gasLimit}`);
        }
        console.log(`\n******`);
        console.log();
        const logEntry = {
            id: contractId,
            deploymentTxHash: deploymentTx?.hash,
        };
        if (args !== undefined) {
            logEntry.verify = {
                name,
                args: JSON.stringify(args),
            };
        }
        this.db.set(`${network}.instance.${contractAddress}`, logEntry).write();
        const namedEntry = this.db.get(`${network}.named.${contractId}${key !== undefined ? `.${key}` : ""}`).value();
        const count = namedEntry?.count ?? 0;
        this.db
            .set(`${network}.named.${contractId}${key !== undefined ? `.${key}` : ""}`, {
            address: contractAddress,
            count: count + 1,
        })
            .write();
    }
    /**
     * Get contract instances from the json file
     *
     * @param network - selected network
     * @returns {[string, IStorageInstanceEntry][]} storage instance entries
     */
    getInstances(network) {
        const collection = this.db.get(`${network}.instance`);
        const value = collection.value();
        return Object.entries(value || []);
    }
    /**
     * Check if contract is verified or not locally
     *
     * @param address - contract address
     * @param network - selected network
     * @returns contract verified or not
     */
    getVerified(address, network) {
        return this.db.get(`${network}.verified.${address}`).value();
    }
    /**
     * Get deployment arguments from the json file
     *
     * @param id - contract name
     * @param network - selected network
     * @param key - contract key
     * @returns deployment arguments
     */
    getContractArgs(id, network, key) {
        const address = this.getAddress(id, network, key);
        const collection = this.db.get(`${network}.instance.${address}`);
        const instanceEntry = collection.value();
        if (!instanceEntry?.verify?.args) {
            return undefined;
        }
        return JSON.parse(instanceEntry.verify.args);
    }
    /**
     * Get contract address by name from the json file
     *
     * @param id - contract name
     * @param network - selected network
     * @returns contract address
     */
    getAddress(id, network, key) {
        const collection = this.db.get(`${network}.named.${id}${key !== undefined ? `.${key}` : ""}`);
        const namedEntry = collection.value();
        return namedEntry?.address;
    }
    /**
     * Get contract address by name from the json file
     *
     * @param id - contract name
     * @param network - selected network
     * @throws {Error} if there is no address the error will be thrown
     * @returns contract address
     */
    mustGetAddress(id, network, key) {
        const address = this.getAddress(id, network, key);
        if (!address) {
            throw new Error(`Contract ${id} is not saved`);
        }
        return address;
    }
    /**
     * Get Contract Deployment Transaction Hash
     */
    getDeploymentTxHash(id, network, address) {
        const collection = this.db.get(`${network}.instance.${address}`);
        const instanceEntry = collection.value();
        if (instanceEntry?.id !== id) {
            throw new Error(`Contract ${id} with address ${address} and network ${network} not found.`);
        }
        return instanceEntry.deploymentTxHash;
    }
    /**
     * Get contract from the json file with sizes and multi count
     *
     * @param deployer - deployer address
     * @param network - selected network
     * @returns {[entries: Map<string, string>, length: number, multiCount: number]}
     */
    printContracts(deployer, network) {
        console.log("Contracts deployed at", network, "by", deployer);
        console.log("---------------------------------");
        const entryMap = new Map();
        const { named, instance } = this.db.get(network).value();
        const namedEntries = Object.entries(named || {});
        const instanceEntries = Object.entries(instance || {});
        let multiCount = 0;
        namedEntries.forEach(([key, value]) => {
            if (key.startsWith("~")) {
                return;
            }
            if (typeof value.count === "number" && typeof value.address === "string") {
                if (value.count > 1) {
                    console.log(`\t${key}: N=${value.count}`);
                    multiCount += 1;
                }
                else {
                    console.log(`\t${key}: ${value.address}`);
                    entryMap.set(key, value.address);
                }
            }
            else {
                const entries = Object.entries(value);
                entries.forEach(([id, nested]) => {
                    if (nested.count > 1) {
                        console.log(`\t${key}-${id}: N=${nested.count}`);
                        multiCount += 1;
                    }
                    else {
                        console.log(`\t${key}-${id}: ${nested.address}`);
                        entryMap.set(key, nested.address);
                    }
                });
            }
        });
        console.log("---------------------------------");
        console.log("N# Contracts:", entryMap.size + multiCount, "/", instanceEntries.length);
        return [entryMap, instanceEntries.length, multiCount];
    }
    /**
     * Clean json file for selected network
     *
     * @param network - selected network
     */
    cleanup(network) {
        this.db.set(network, {}).write();
    }
}
exports.ContractStorage = ContractStorage;
//# sourceMappingURL=ContractStorage.js.map