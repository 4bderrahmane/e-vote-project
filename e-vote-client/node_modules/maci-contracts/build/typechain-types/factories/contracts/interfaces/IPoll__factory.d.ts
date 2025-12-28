import { type ContractRunner } from "ethers";
import type { IPoll, IPollInterface } from "../../../contracts/interfaces/IPoll";
export declare class IPoll__factory {
    static readonly abi: readonly [{
        readonly inputs: readonly [];
        readonly name: "actualStateTreeDepth";
        readonly outputs: readonly [{
            readonly internalType: "uint8";
            readonly name: "";
            readonly type: "uint8";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [];
        readonly name: "coordinatorPubKeyHash";
        readonly outputs: readonly [{
            readonly internalType: "uint256";
            readonly name: "_coordinatorPubKeyHash";
            readonly type: "uint256";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [];
        readonly name: "currentSbCommitment";
        readonly outputs: readonly [{
            readonly internalType: "uint256";
            readonly name: "";
            readonly type: "uint256";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [];
        readonly name: "extContracts";
        readonly outputs: readonly [{
            readonly internalType: "contract IMACI";
            readonly name: "maci";
            readonly type: "address";
        }, {
            readonly internalType: "contract AccQueue";
            readonly name: "messageAq";
            readonly type: "address";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [];
        readonly name: "getDeployTimeAndDuration";
        readonly outputs: readonly [{
            readonly internalType: "uint256";
            readonly name: "_deployTime";
            readonly type: "uint256";
        }, {
            readonly internalType: "uint256";
            readonly name: "_duration";
            readonly type: "uint256";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [];
        readonly name: "mergeMaciState";
        readonly outputs: readonly [];
        readonly stateMutability: "nonpayable";
        readonly type: "function";
    }, {
        readonly inputs: readonly [];
        readonly name: "mergeMessageAq";
        readonly outputs: readonly [];
        readonly stateMutability: "nonpayable";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "uint256";
            readonly name: "_numSrQueueOps";
            readonly type: "uint256";
        }];
        readonly name: "mergeMessageAqSubRoots";
        readonly outputs: readonly [];
        readonly stateMutability: "nonpayable";
        readonly type: "function";
    }, {
        readonly inputs: readonly [];
        readonly name: "numSignUpsAndMessages";
        readonly outputs: readonly [{
            readonly internalType: "uint256";
            readonly name: "numSignups";
            readonly type: "uint256";
        }, {
            readonly internalType: "uint256";
            readonly name: "numMsgs";
            readonly type: "uint256";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly components: readonly [{
                readonly internalType: "uint256[10]";
                readonly name: "data";
                readonly type: "uint256[10]";
            }];
            readonly internalType: "struct DomainObjs.Message";
            readonly name: "_message";
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
            readonly internalType: "struct DomainObjs.PubKey";
            readonly name: "_encPubKey";
            readonly type: "tuple";
        }];
        readonly name: "publishMessage";
        readonly outputs: readonly [];
        readonly stateMutability: "nonpayable";
        readonly type: "function";
    }, {
        readonly inputs: readonly [];
        readonly name: "stateMerged";
        readonly outputs: readonly [{
            readonly internalType: "bool";
            readonly name: "";
            readonly type: "bool";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [];
        readonly name: "treeDepths";
        readonly outputs: readonly [{
            readonly internalType: "uint8";
            readonly name: "intStateTreeDepth";
            readonly type: "uint8";
        }, {
            readonly internalType: "uint8";
            readonly name: "messageTreeSubDepth";
            readonly type: "uint8";
        }, {
            readonly internalType: "uint8";
            readonly name: "messageTreeDepth";
            readonly type: "uint8";
        }, {
            readonly internalType: "uint8";
            readonly name: "voteOptionTreeDepth";
            readonly type: "uint8";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }];
    static createInterface(): IPollInterface;
    static connect(address: string, runner?: ContractRunner | null): IPoll;
}
//# sourceMappingURL=IPoll__factory.d.ts.map