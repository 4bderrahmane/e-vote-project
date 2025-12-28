import { ContractFactory, ContractTransactionResponse } from "ethers";
import type { Signer, ContractDeployTransaction, ContractRunner } from "ethers";
import type { NonPayableOverrides } from "../../../common";
import type { PoseidonT4, PoseidonT4Interface } from "../../../contracts/crypto/PoseidonT4";
type PoseidonT4ConstructorParams = [signer?: Signer] | ConstructorParameters<typeof ContractFactory>;
export declare class PoseidonT4__factory extends ContractFactory {
    constructor(...args: PoseidonT4ConstructorParams);
    getDeployTransaction(overrides?: NonPayableOverrides & {
        from?: string;
    }): Promise<ContractDeployTransaction>;
    deploy(overrides?: NonPayableOverrides & {
        from?: string;
    }): Promise<PoseidonT4 & {
        deploymentTransaction(): ContractTransactionResponse;
    }>;
    connect(runner: ContractRunner | null): PoseidonT4__factory;
    static readonly bytecode = "0x61011761003a600b82828239805160001a60731461002d57634e487b7160e01b600052600060045260246000fd5b30600052607381538281f3fe730000000000000000000000000000000000000000301460806040526004361060335760003560e01c806325cc70e8146038575b600080fd5b60496043366004605b565b50600090565b60405190815260200160405180910390f35b600060608284031215606c57600080fd5b82601f830112607a57600080fd5b6040516060810181811067ffffffffffffffff8211171560aa57634e487b7160e01b600052604160045260246000fd5b60405280606084018581111560be57600080fd5b845b8181101560d657803583526020928301920160c0565b50919594505050505056fea26469706673582212200ae5631a79ff5903c3f2f0f13a1b2fc86f08a7b788e88a74425b1452199d362364736f6c63430008140033";
    static readonly abi: readonly [{
        readonly inputs: readonly [{
            readonly internalType: "uint256[3]";
            readonly name: "input";
            readonly type: "uint256[3]";
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
    static createInterface(): PoseidonT4Interface;
    static connect(address: string, runner?: ContractRunner | null): PoseidonT4;
}
export {};
//# sourceMappingURL=PoseidonT4__factory.d.ts.map