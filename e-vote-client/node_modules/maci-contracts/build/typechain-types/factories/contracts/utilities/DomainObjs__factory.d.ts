import { ContractFactory, ContractTransactionResponse } from "ethers";
import type { Signer, ContractDeployTransaction, ContractRunner } from "ethers";
import type { NonPayableOverrides } from "../../../common";
import type { DomainObjs, DomainObjsInterface } from "../../../contracts/utilities/DomainObjs";
type DomainObjsConstructorParams = [signer?: Signer] | ConstructorParameters<typeof ContractFactory>;
export declare class DomainObjs__factory extends ContractFactory {
    constructor(...args: DomainObjsConstructorParams);
    getDeployTransaction(overrides?: NonPayableOverrides & {
        from?: string;
    }): Promise<ContractDeployTransaction>;
    deploy(overrides?: NonPayableOverrides & {
        from?: string;
    }): Promise<DomainObjs & {
        deploymentTransaction(): ContractTransactionResponse;
    }>;
    connect(runner: ContractRunner | null): DomainObjs__factory;
    static readonly bytecode = "0x6080604052348015600f57600080fd5b5060808061001e6000396000f3fe6080604052348015600f57600080fd5b506004361060285760003560e01c8063683f3dc314602d575b600080fd5b6034600a81565b60405160ff909116815260200160405180910390f3fea2646970667358221220dc98258be61847a2c423a159f7df0943c0e2683752a81ab2cb1415b564bd0f1664736f6c63430008140033";
    static readonly abi: readonly [{
        readonly inputs: readonly [];
        readonly name: "MESSAGE_DATA_LENGTH";
        readonly outputs: readonly [{
            readonly internalType: "uint8";
            readonly name: "";
            readonly type: "uint8";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }];
    static createInterface(): DomainObjsInterface;
    static connect(address: string, runner?: ContractRunner | null): DomainObjs;
}
export {};
//# sourceMappingURL=DomainObjs__factory.d.ts.map