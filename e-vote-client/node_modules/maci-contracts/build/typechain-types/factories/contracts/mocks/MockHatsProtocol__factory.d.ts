import { ContractFactory, ContractTransactionResponse } from "ethers";
import type { Signer, ContractDeployTransaction, ContractRunner } from "ethers";
import type { NonPayableOverrides } from "../../../common";
import type { MockHatsProtocol, MockHatsProtocolInterface } from "../../../contracts/mocks/MockHatsProtocol";
type MockHatsProtocolConstructorParams = [signer?: Signer] | ConstructorParameters<typeof ContractFactory>;
export declare class MockHatsProtocol__factory extends ContractFactory {
    constructor(...args: MockHatsProtocolConstructorParams);
    getDeployTransaction(overrides?: NonPayableOverrides & {
        from?: string;
    }): Promise<ContractDeployTransaction>;
    deploy(overrides?: NonPayableOverrides & {
        from?: string;
    }): Promise<MockHatsProtocol & {
        deploymentTransaction(): ContractTransactionResponse;
    }>;
    connect(runner: ContractRunner | null): MockHatsProtocol__factory;
    static readonly bytecode = "0x608060405234801561001057600080fd5b5060e18061001f6000396000f3fe6080604052348015600f57600080fd5b506004361060285760003560e01c80634352409a14602d575b600080fd5b603c60383660046075565b6050565b604051901515815260200160405180910390f35b6000816001148060605750816002145b15606b57506001606f565b5060005b92915050565b60008060408385031215608757600080fd5b82356001600160a01b0381168114609d57600080fd5b94602093909301359350505056fea26469706673582212207d45a50f06b1149af0da715f7f897dd3bf6e1f188d7d27177d41eba0e2ea331664736f6c63430008140033";
    static readonly abi: readonly [{
        readonly inputs: readonly [{
            readonly internalType: "address";
            readonly name: "account";
            readonly type: "address";
        }, {
            readonly internalType: "uint256";
            readonly name: "hat";
            readonly type: "uint256";
        }];
        readonly name: "isWearerOfHat";
        readonly outputs: readonly [{
            readonly internalType: "bool";
            readonly name: "";
            readonly type: "bool";
        }];
        readonly stateMutability: "pure";
        readonly type: "function";
    }];
    static createInterface(): MockHatsProtocolInterface;
    static connect(address: string, runner?: ContractRunner | null): MockHatsProtocol;
}
export {};
//# sourceMappingURL=MockHatsProtocol__factory.d.ts.map