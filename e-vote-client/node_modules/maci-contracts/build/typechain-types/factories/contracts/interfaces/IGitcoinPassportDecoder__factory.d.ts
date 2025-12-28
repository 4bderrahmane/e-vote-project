import { type ContractRunner } from "ethers";
import type { IGitcoinPassportDecoder, IGitcoinPassportDecoderInterface } from "../../../contracts/interfaces/IGitcoinPassportDecoder";
export declare class IGitcoinPassportDecoder__factory {
    static readonly abi: readonly [{
        readonly inputs: readonly [{
            readonly internalType: "address";
            readonly name: "user";
            readonly type: "address";
        }];
        readonly name: "getPassport";
        readonly outputs: readonly [{
            readonly components: readonly [{
                readonly internalType: "string";
                readonly name: "provider";
                readonly type: "string";
            }, {
                readonly internalType: "bytes32";
                readonly name: "hash";
                readonly type: "bytes32";
            }, {
                readonly internalType: "uint64";
                readonly name: "time";
                readonly type: "uint64";
            }, {
                readonly internalType: "uint64";
                readonly name: "expirationTime";
                readonly type: "uint64";
            }];
            readonly internalType: "struct Credential[]";
            readonly name: "";
            readonly type: "tuple[]";
        }];
        readonly stateMutability: "nonpayable";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "address";
            readonly name: "user";
            readonly type: "address";
        }];
        readonly name: "getScore";
        readonly outputs: readonly [{
            readonly internalType: "uint256";
            readonly name: "";
            readonly type: "uint256";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "address";
            readonly name: "user";
            readonly type: "address";
        }];
        readonly name: "isHuman";
        readonly outputs: readonly [{
            readonly internalType: "bool";
            readonly name: "";
            readonly type: "bool";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }];
    static createInterface(): IGitcoinPassportDecoderInterface;
    static connect(address: string, runner?: ContractRunner | null): IGitcoinPassportDecoder;
}
//# sourceMappingURL=IGitcoinPassportDecoder__factory.d.ts.map