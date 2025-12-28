import { ContractFactory, ContractTransactionResponse } from "ethers";
import type { Signer, BigNumberish, ContractDeployTransaction, ContractRunner } from "ethers";
import type { PayableOverrides } from "../../../common";
import type { ConstantInitialVoiceCreditProxy, ConstantInitialVoiceCreditProxyInterface } from "../../../contracts/initialVoiceCreditProxy/ConstantInitialVoiceCreditProxy";
type ConstantInitialVoiceCreditProxyConstructorParams = [signer?: Signer] | ConstructorParameters<typeof ContractFactory>;
export declare class ConstantInitialVoiceCreditProxy__factory extends ContractFactory {
    constructor(...args: ConstantInitialVoiceCreditProxyConstructorParams);
    getDeployTransaction(_balance: BigNumberish, overrides?: PayableOverrides & {
        from?: string;
    }): Promise<ContractDeployTransaction>;
    deploy(_balance: BigNumberish, overrides?: PayableOverrides & {
        from?: string;
    }): Promise<ConstantInitialVoiceCreditProxy & {
        deploymentTransaction(): ContractTransactionResponse;
    }>;
    connect(runner: ContractRunner | null): ConstantInitialVoiceCreditProxy__factory;
    static readonly bytecode = "0x60a06040526040516101f03803806101f08339810160408190526100229161002a565b608052610043565b60006020828403121561003c57600080fd5b5051919050565b60805161019361005d6000396000604001526101936000f3fe608060405234801561001057600080fd5b506004361061002b5760003560e01c8063b36543a914610030575b600080fd5b61006561003e36600461008d565b7f000000000000000000000000000000000000000000000000000000000000000092915050565b60405190815260200160405180910390f35b634e487b7160e01b600052604160045260246000fd5b600080604083850312156100a057600080fd5b82356001600160a01b03811681146100b757600080fd5b9150602083013567ffffffffffffffff808211156100d457600080fd5b818501915085601f8301126100e857600080fd5b8135818111156100fa576100fa610077565b604051601f8201601f19908116603f0116810190838211818310171561012257610122610077565b8160405282815288602084870101111561013b57600080fd5b826020860160208301376000602084830101528095505050505050925092905056fea264697066735822122095d5cb0ca81edc480cd2a686afb853eda440eab7cbd96dea87a18becec18e1c564736f6c63430008140033";
    static readonly abi: readonly [{
        readonly inputs: readonly [{
            readonly internalType: "uint256";
            readonly name: "_balance";
            readonly type: "uint256";
        }];
        readonly stateMutability: "payable";
        readonly type: "constructor";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "address";
            readonly name: "";
            readonly type: "address";
        }, {
            readonly internalType: "bytes";
            readonly name: "";
            readonly type: "bytes";
        }];
        readonly name: "getVoiceCredits";
        readonly outputs: readonly [{
            readonly internalType: "uint256";
            readonly name: "";
            readonly type: "uint256";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }];
    static createInterface(): ConstantInitialVoiceCreditProxyInterface;
    static connect(address: string, runner?: ContractRunner | null): ConstantInitialVoiceCreditProxy;
}
export {};
//# sourceMappingURL=ConstantInitialVoiceCreditProxy__factory.d.ts.map