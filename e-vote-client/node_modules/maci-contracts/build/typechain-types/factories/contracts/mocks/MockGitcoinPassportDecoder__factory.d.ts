import { ContractFactory, ContractTransactionResponse } from "ethers";
import type { Signer, ContractDeployTransaction, ContractRunner } from "ethers";
import type { NonPayableOverrides } from "../../../common";
import type { MockGitcoinPassportDecoder, MockGitcoinPassportDecoderInterface } from "../../../contracts/mocks/MockGitcoinPassportDecoder";
type MockGitcoinPassportDecoderConstructorParams = [signer?: Signer] | ConstructorParameters<typeof ContractFactory>;
export declare class MockGitcoinPassportDecoder__factory extends ContractFactory {
    constructor(...args: MockGitcoinPassportDecoderConstructorParams);
    getDeployTransaction(overrides?: NonPayableOverrides & {
        from?: string;
    }): Promise<ContractDeployTransaction>;
    deploy(overrides?: NonPayableOverrides & {
        from?: string;
    }): Promise<MockGitcoinPassportDecoder & {
        deploymentTransaction(): ContractTransactionResponse;
    }>;
    connect(runner: ContractRunner | null): MockGitcoinPassportDecoder__factory;
    static readonly bytecode = "0x608060405234801561001057600080fd5b5060fb8061001f6000396000f3fe6080604052348015600f57600080fd5b5060043610603c5760003560e01c806329044119146041578063d47875d0146053578063efedc669146077575b600080fd5b6051604c366004607f565b600055565b005b6065605e3660046097565b5060005490565b60405190815260200160405180910390f35b606560005481565b600060208284031215609057600080fd5b5035919050565b60006020828403121560a857600080fd5b81356001600160a01b038116811460be57600080fd5b939250505056fea264697066735822122003f4e74ef27811e264ed65fdfb552cdd0e69be400e0414fced510522b170329464736f6c63430008140033";
    static readonly abi: readonly [{
        readonly inputs: readonly [{
            readonly internalType: "uint256";
            readonly name: "newScore";
            readonly type: "uint256";
        }];
        readonly name: "changeScore";
        readonly outputs: readonly [];
        readonly stateMutability: "nonpayable";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "address";
            readonly name: "_user";
            readonly type: "address";
        }];
        readonly name: "getScore";
        readonly outputs: readonly [{
            readonly internalType: "uint256";
            readonly name: "";
            readonly type: "uint256";
        }];
        readonly stateMutability: "nonpayable";
        readonly type: "function";
    }, {
        readonly inputs: readonly [];
        readonly name: "score";
        readonly outputs: readonly [{
            readonly internalType: "uint256";
            readonly name: "";
            readonly type: "uint256";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }];
    static createInterface(): MockGitcoinPassportDecoderInterface;
    static connect(address: string, runner?: ContractRunner | null): MockGitcoinPassportDecoder;
}
export {};
//# sourceMappingURL=MockGitcoinPassportDecoder__factory.d.ts.map