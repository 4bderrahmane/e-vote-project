import { ContractFactory, ContractTransactionResponse } from "ethers";
import type { Signer, BigNumberish, ContractDeployTransaction, ContractRunner } from "ethers";
import type { NonPayableOverrides } from "../../../common";
import type { MockSemaphore, MockSemaphoreInterface } from "../../../contracts/mocks/MockSemaphore";
type MockSemaphoreConstructorParams = [signer?: Signer] | ConstructorParameters<typeof ContractFactory>;
export declare class MockSemaphore__factory extends ContractFactory {
    constructor(...args: MockSemaphoreConstructorParams);
    getDeployTransaction(_groupId: BigNumberish, overrides?: NonPayableOverrides & {
        from?: string;
    }): Promise<ContractDeployTransaction>;
    deploy(_groupId: BigNumberish, overrides?: NonPayableOverrides & {
        from?: string;
    }): Promise<MockSemaphore & {
        deploymentTransaction(): ContractTransactionResponse;
    }>;
    connect(runner: ContractRunner | null): MockSemaphore__factory;
    static readonly bytecode = "0x60a06040526000805460ff1916600117905534801561001d57600080fd5b506040516101c13803806101c183398101604081905261003c91610044565b60805261005d565b60006020828403121561005657600080fd5b5051919050565b60805161014a6100776000396000609d015261014a6000f3fe608060405234801561001057600080fd5b506004361061004c5760003560e01c80633d45d9ea14610051578063456f41881461006a578063a0f44c9214610098578063c1991219146100cd575b600080fd5b6100686000805460ff19811660ff90911615179055565b005b6100836100783660046100da565b505060005460ff1690565b60405190151581526020015b60405180910390f35b6100bf7f000000000000000000000000000000000000000000000000000000000000000081565b60405190815260200161008f565b6000546100839060ff1681565b6000808284036101c08112156100ef57600080fd5b833592506101a0601f198201121561010657600080fd5b50602083019050925092905056fea2646970667358221220d74eeacf0d0b762af1910473683ec48c6be10535375463cb1467a50889e1144764736f6c63430008140033";
    static readonly abi: readonly [{
        readonly inputs: readonly [{
            readonly internalType: "uint256";
            readonly name: "_groupId";
            readonly type: "uint256";
        }];
        readonly stateMutability: "nonpayable";
        readonly type: "constructor";
    }, {
        readonly inputs: readonly [];
        readonly name: "flipValid";
        readonly outputs: readonly [];
        readonly stateMutability: "nonpayable";
        readonly type: "function";
    }, {
        readonly inputs: readonly [];
        readonly name: "groupId";
        readonly outputs: readonly [{
            readonly internalType: "uint256";
            readonly name: "";
            readonly type: "uint256";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [];
        readonly name: "valid";
        readonly outputs: readonly [{
            readonly internalType: "bool";
            readonly name: "";
            readonly type: "bool";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "uint256";
            readonly name: "_groupId";
            readonly type: "uint256";
        }, {
            readonly components: readonly [{
                readonly internalType: "uint256";
                readonly name: "merkleTreeDepth";
                readonly type: "uint256";
            }, {
                readonly internalType: "uint256";
                readonly name: "merkleTreeRoot";
                readonly type: "uint256";
            }, {
                readonly internalType: "uint256";
                readonly name: "nullifier";
                readonly type: "uint256";
            }, {
                readonly internalType: "uint256";
                readonly name: "message";
                readonly type: "uint256";
            }, {
                readonly internalType: "uint256";
                readonly name: "scope";
                readonly type: "uint256";
            }, {
                readonly internalType: "uint256[8]";
                readonly name: "points";
                readonly type: "uint256[8]";
            }];
            readonly internalType: "struct ISemaphore.SemaphoreProof";
            readonly name: "proof";
            readonly type: "tuple";
        }];
        readonly name: "verifyProof";
        readonly outputs: readonly [{
            readonly internalType: "bool";
            readonly name: "";
            readonly type: "bool";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }];
    static createInterface(): MockSemaphoreInterface;
    static connect(address: string, runner?: ContractRunner | null): MockSemaphore;
}
export {};
//# sourceMappingURL=MockSemaphore__factory.d.ts.map