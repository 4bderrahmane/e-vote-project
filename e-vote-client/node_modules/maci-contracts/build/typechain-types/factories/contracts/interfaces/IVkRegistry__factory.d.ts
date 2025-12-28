import { type ContractRunner } from "ethers";
import type { IVkRegistry, IVkRegistryInterface } from "../../../contracts/interfaces/IVkRegistry";
export declare class IVkRegistry__factory {
    static readonly abi: readonly [{
        readonly inputs: readonly [{
            readonly internalType: "uint256";
            readonly name: "_stateTreeDepth";
            readonly type: "uint256";
        }, {
            readonly internalType: "uint256";
            readonly name: "_messageTreeDepth";
            readonly type: "uint256";
        }, {
            readonly internalType: "uint256";
            readonly name: "_voteOptionTreeDepth";
            readonly type: "uint256";
        }, {
            readonly internalType: "uint256";
            readonly name: "_messageBatchSize";
            readonly type: "uint256";
        }, {
            readonly internalType: "enum DomainObjs.Mode";
            readonly name: "_mode";
            readonly type: "uint8";
        }];
        readonly name: "getProcessVk";
        readonly outputs: readonly [{
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
            readonly name: "";
            readonly type: "tuple";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "uint256";
            readonly name: "_stateTreeDepth";
            readonly type: "uint256";
        }, {
            readonly internalType: "uint256";
            readonly name: "_intStateTreeDepth";
            readonly type: "uint256";
        }, {
            readonly internalType: "uint256";
            readonly name: "_voteOptionTreeDepth";
            readonly type: "uint256";
        }, {
            readonly internalType: "enum DomainObjs.Mode";
            readonly name: "_mode";
            readonly type: "uint8";
        }];
        readonly name: "getTallyVk";
        readonly outputs: readonly [{
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
            readonly name: "";
            readonly type: "tuple";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }];
    static createInterface(): IVkRegistryInterface;
    static connect(address: string, runner?: ContractRunner | null): IVkRegistry;
}
//# sourceMappingURL=IVkRegistry__factory.d.ts.map