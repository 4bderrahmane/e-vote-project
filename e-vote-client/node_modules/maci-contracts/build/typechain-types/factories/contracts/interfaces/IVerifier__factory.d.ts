import { type ContractRunner } from "ethers";
import type { IVerifier, IVerifierInterface } from "../../../contracts/interfaces/IVerifier";
export declare class IVerifier__factory {
    static readonly abi: readonly [{
        readonly inputs: readonly [{
            readonly internalType: "uint256[8]";
            readonly name: "_proof";
            readonly type: "uint256[8]";
        }, {
            readonly components: readonly [{
                readonly components: readonly [{
                    readonly internalType: "uint256";
                    readonly name: "x";
                    readonly type: "uint256";
                }, {
                    readonly internalType: "uint256";
                    readonly name: "y";
                    readonly type: "uint256";
                }];
                readonly internalType: "struct Pairing.G1Point";
                readonly name: "alpha1";
                readonly type: "tuple";
            }, {
                readonly components: readonly [{
                    readonly internalType: "uint256[2]";
                    readonly name: "x";
                    readonly type: "uint256[2]";
                }, {
                    readonly internalType: "uint256[2]";
                    readonly name: "y";
                    readonly type: "uint256[2]";
                }];
                readonly internalType: "struct Pairing.G2Point";
                readonly name: "beta2";
                readonly type: "tuple";
            }, {
                readonly components: readonly [{
                    readonly internalType: "uint256[2]";
                    readonly name: "x";
                    readonly type: "uint256[2]";
                }, {
                    readonly internalType: "uint256[2]";
                    readonly name: "y";
                    readonly type: "uint256[2]";
                }];
                readonly internalType: "struct Pairing.G2Point";
                readonly name: "gamma2";
                readonly type: "tuple";
            }, {
                readonly components: readonly [{
                    readonly internalType: "uint256[2]";
                    readonly name: "x";
                    readonly type: "uint256[2]";
                }, {
                    readonly internalType: "uint256[2]";
                    readonly name: "y";
                    readonly type: "uint256[2]";
                }];
                readonly internalType: "struct Pairing.G2Point";
                readonly name: "delta2";
                readonly type: "tuple";
            }, {
                readonly components: readonly [{
                    readonly internalType: "uint256";
                    readonly name: "x";
                    readonly type: "uint256";
                }, {
                    readonly internalType: "uint256";
                    readonly name: "y";
                    readonly type: "uint256";
                }];
                readonly internalType: "struct Pairing.G1Point[]";
                readonly name: "ic";
                readonly type: "tuple[]";
            }];
            readonly internalType: "struct SnarkCommon.VerifyingKey";
            readonly name: "vk";
            readonly type: "tuple";
        }, {
            readonly internalType: "uint256[]";
            readonly name: "inputs";
            readonly type: "uint256[]";
        }];
        readonly name: "verify";
        readonly outputs: readonly [{
            readonly internalType: "bool";
            readonly name: "";
            readonly type: "bool";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }];
    static createInterface(): IVerifierInterface;
    static connect(address: string, runner?: ContractRunner | null): IVerifier;
}
//# sourceMappingURL=IVerifier__factory.d.ts.map