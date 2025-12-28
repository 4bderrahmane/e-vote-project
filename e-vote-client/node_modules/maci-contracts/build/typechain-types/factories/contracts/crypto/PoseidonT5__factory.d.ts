import { ContractFactory, ContractTransactionResponse } from "ethers";
import type { Signer, ContractDeployTransaction, ContractRunner } from "ethers";
import type { NonPayableOverrides } from "../../../common";
import type { PoseidonT5, PoseidonT5Interface } from "../../../contracts/crypto/PoseidonT5";
type PoseidonT5ConstructorParams = [signer?: Signer] | ConstructorParameters<typeof ContractFactory>;
export declare class PoseidonT5__factory extends ContractFactory {
    constructor(...args: PoseidonT5ConstructorParams);
    getDeployTransaction(overrides?: NonPayableOverrides & {
        from?: string;
    }): Promise<ContractDeployTransaction>;
    deploy(overrides?: NonPayableOverrides & {
        from?: string;
    }): Promise<PoseidonT5 & {
        deploymentTransaction(): ContractTransactionResponse;
    }>;
    connect(runner: ContractRunner | null): PoseidonT5__factory;
    static readonly bytecode = "0x61011761003a600b82828239805160001a60731461002d57634e487b7160e01b600052600060045260246000fd5b30600052607381538281f3fe730000000000000000000000000000000000000000301460806040526004361060335760003560e01c8063248f6677146038575b600080fd5b60496043366004605b565b50600090565b60405190815260200160405180910390f35b600060808284031215606c57600080fd5b82601f830112607a57600080fd5b6040516080810181811067ffffffffffffffff8211171560aa57634e487b7160e01b600052604160045260246000fd5b60405280608084018581111560be57600080fd5b845b8181101560d657803583526020928301920160c0565b50919594505050505056fea2646970667358221220122537a7d9abc12eea2c96db2a66c3be1bb30b1bfa2f95078dac6569d52e0a8064736f6c63430008140033";
    static readonly abi: readonly [{
        readonly inputs: readonly [{
            readonly internalType: "uint256[4]";
            readonly name: "input";
            readonly type: "uint256[4]";
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
    static createInterface(): PoseidonT5Interface;
    static connect(address: string, runner?: ContractRunner | null): PoseidonT5;
}
export {};
//# sourceMappingURL=PoseidonT5__factory.d.ts.map