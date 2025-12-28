import { ContractFactory, ContractTransactionResponse } from "ethers";
import type { Signer, ContractDeployTransaction, ContractRunner } from "ethers";
import type { NonPayableOverrides } from "../../../common";
import type { PoseidonT3, PoseidonT3Interface } from "../../../contracts/crypto/PoseidonT3";
type PoseidonT3ConstructorParams = [signer?: Signer] | ConstructorParameters<typeof ContractFactory>;
export declare class PoseidonT3__factory extends ContractFactory {
    constructor(...args: PoseidonT3ConstructorParams);
    getDeployTransaction(overrides?: NonPayableOverrides & {
        from?: string;
    }): Promise<ContractDeployTransaction>;
    deploy(overrides?: NonPayableOverrides & {
        from?: string;
    }): Promise<PoseidonT3 & {
        deploymentTransaction(): ContractTransactionResponse;
    }>;
    connect(runner: ContractRunner | null): PoseidonT3__factory;
    static readonly bytecode = "0x61011961003a600b82828239805160001a60731461002d57634e487b7160e01b600052600060045260246000fd5b30600052607381538281f3fe730000000000000000000000000000000000000000301460806040526004361060335760003560e01c806329a5f2f6146038575b600080fd5b60496043366004605b565b50600090565b60405190815260200160405180910390f35b600060408284031215606c57600080fd5b82601f830112607a57600080fd5b6040516040810181811067ffffffffffffffff8211171560aa57634e487b7160e01b600052604160045260246000fd5b806040525080604084018581111560c057600080fd5b845b8181101560d857803583526020928301920160c2565b50919594505050505056fea2646970667358221220d6fbcd4df20e27bd214ebe4a9da18fb613f8b83616e591267082dd5b58dfdbf264736f6c63430008140033";
    static readonly abi: readonly [{
        readonly inputs: readonly [{
            readonly internalType: "uint256[2]";
            readonly name: "input";
            readonly type: "uint256[2]";
        }];
        readonly name: "poseidon";
        readonly outputs: readonly [{
            readonly internalType: "uint256";
            readonly name: "";
            readonly type: "uint256";
        }];
        readonly stateMutability: "pure";
        readonly type: "function";
    }];
    static createInterface(): PoseidonT3Interface;
    static connect(address: string, runner?: ContractRunner | null): PoseidonT3;
}
export {};
//# sourceMappingURL=PoseidonT3__factory.d.ts.map