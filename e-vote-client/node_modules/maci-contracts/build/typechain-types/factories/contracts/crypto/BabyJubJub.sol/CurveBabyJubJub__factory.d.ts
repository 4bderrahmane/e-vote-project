import { ContractFactory, ContractTransactionResponse } from "ethers";
import type { Signer, ContractDeployTransaction, ContractRunner } from "ethers";
import type { NonPayableOverrides } from "../../../../common";
import type { CurveBabyJubJub, CurveBabyJubJubInterface } from "../../../../contracts/crypto/BabyJubJub.sol/CurveBabyJubJub";
type CurveBabyJubJubConstructorParams = [signer?: Signer] | ConstructorParameters<typeof ContractFactory>;
export declare class CurveBabyJubJub__factory extends ContractFactory {
    constructor(...args: CurveBabyJubJubConstructorParams);
    getDeployTransaction(overrides?: NonPayableOverrides & {
        from?: string;
    }): Promise<ContractDeployTransaction>;
    deploy(overrides?: NonPayableOverrides & {
        from?: string;
    }): Promise<CurveBabyJubJub & {
        deploymentTransaction(): ContractTransactionResponse;
    }>;
    connect(runner: ContractRunner | null): CurveBabyJubJub__factory;
    static readonly bytecode = "0x60cc610039600b82828239805160001a60731461002c57634e487b7160e01b600052600060045260246000fd5b30600052607381538281f3fe730000000000000000000000000000000000000000301460806040526004361060475760003560e01c80630f529ba214604c578063e493ef8c146067578063f446c1d014608d575b600080fd5b6055620292f881565b60405190815260200160405180910390f35b60557f30644e72e131a029b85045b68181585d2833e84879b9709143e1f593f000000181565b6055620292fc8156fea26469706673582212204ccdf207d7fb8aae388605ddee05708cfd40ea5b84cd4c7e9802089515e8f2e564736f6c63430008140033";
    static readonly abi: readonly [{
        readonly inputs: readonly [];
        readonly name: "A";
        readonly outputs: readonly [{
            readonly internalType: "uint256";
            readonly name: "";
            readonly type: "uint256";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [];
        readonly name: "D";
        readonly outputs: readonly [{
            readonly internalType: "uint256";
            readonly name: "";
            readonly type: "uint256";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [];
        readonly name: "Q";
        readonly outputs: readonly [{
            readonly internalType: "uint256";
            readonly name: "";
            readonly type: "uint256";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }];
    static createInterface(): CurveBabyJubJubInterface;
    static connect(address: string, runner?: ContractRunner | null): CurveBabyJubJub;
}
export {};
//# sourceMappingURL=CurveBabyJubJub__factory.d.ts.map