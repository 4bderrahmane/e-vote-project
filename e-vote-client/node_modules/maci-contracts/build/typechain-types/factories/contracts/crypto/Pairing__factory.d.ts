import { ContractFactory, ContractTransactionResponse } from "ethers";
import type { Signer, ContractDeployTransaction, ContractRunner } from "ethers";
import type { NonPayableOverrides } from "../../../common";
import type { Pairing, PairingInterface } from "../../../contracts/crypto/Pairing";
type PairingConstructorParams = [signer?: Signer] | ConstructorParameters<typeof ContractFactory>;
export declare class Pairing__factory extends ContractFactory {
    constructor(...args: PairingConstructorParams);
    getDeployTransaction(overrides?: NonPayableOverrides & {
        from?: string;
    }): Promise<ContractDeployTransaction>;
    deploy(overrides?: NonPayableOverrides & {
        from?: string;
    }): Promise<Pairing & {
        deploymentTransaction(): ContractTransactionResponse;
    }>;
    connect(runner: ContractRunner | null): Pairing__factory;
    static readonly bytecode = "0x60a6610038600b82828239805160001a607314602b57634e487b7160e01b600052600060045260246000fd5b30600052607381538281f3fe730000000000000000000000000000000000000000301460806040526004361060335760003560e01c80638d532908146038575b600080fd5b605e7f30644e72e131a029b85045b68181585d97816a916871ca8d3c208c16d87cfd4781565b60405190815260200160405180910390f3fea26469706673582212206c4c4cd23edbd4e78a4a3ed02551b30034c538185c222fd3d030efb2ff18764064736f6c63430008140033";
    static readonly abi: readonly [{
        readonly inputs: readonly [];
        readonly name: "PairingAddFailed";
        readonly type: "error";
    }, {
        readonly inputs: readonly [];
        readonly name: "PairingMulFailed";
        readonly type: "error";
    }, {
        readonly inputs: readonly [];
        readonly name: "PairingOpcodeFailed";
        readonly type: "error";
    }, {
        readonly inputs: readonly [];
        readonly name: "PRIME_Q";
        readonly outputs: readonly [{
            readonly internalType: "uint256";
            readonly name: "";
            readonly type: "uint256";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }];
    static createInterface(): PairingInterface;
    static connect(address: string, runner?: ContractRunner | null): Pairing;
}
export {};
//# sourceMappingURL=Pairing__factory.d.ts.map