import { type ContractRunner } from "ethers";
import type { AccQueueQuinary, AccQueueQuinaryInterface } from "../../../contracts/trees/AccQueueQuinary";
export declare class AccQueueQuinary__factory {
    static readonly abi: readonly [{
        readonly inputs: readonly [];
        readonly name: "DepthCannotBeZero";
        readonly type: "error";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "uint256";
            readonly name: "_depth";
            readonly type: "uint256";
        }, {
            readonly internalType: "uint256";
            readonly name: "max";
            readonly type: "uint256";
        }];
        readonly name: "DepthTooLarge";
        readonly type: "error";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "uint256";
            readonly name: "_depth";
            readonly type: "uint256";
        }, {
            readonly internalType: "uint256";
            readonly name: "min";
            readonly type: "uint256";
        }];
        readonly name: "DepthTooSmall";
        readonly type: "error";
    }, {
        readonly inputs: readonly [];
        readonly name: "InvalidHashLength";
        readonly type: "error";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "uint256";
            readonly name: "_index";
            readonly type: "uint256";
        }];
        readonly name: "InvalidIndex";
        readonly type: "error";
    }, {
        readonly inputs: readonly [];
        readonly name: "InvalidLevel";
        readonly type: "error";
    }, {
        readonly inputs: readonly [];
        readonly name: "NothingToMerge";
        readonly type: "error";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "address";
            readonly name: "owner";
            readonly type: "address";
        }];
        readonly name: "OwnableInvalidOwner";
        readonly type: "error";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "address";
            readonly name: "account";
            readonly type: "address";
        }];
        readonly name: "OwnableUnauthorizedAccount";
        readonly type: "error";
    }, {
        readonly inputs: readonly [];
        readonly name: "SubDepthCannotBeZero";
        readonly type: "error";
    }, {
        readonly inputs: readonly [];
        readonly name: "SubTreesAlreadyMerged";
        readonly type: "error";
    }, {
        readonly inputs: readonly [];
        readonly name: "SubTreesNotMerged";
        readonly type: "error";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "uint256";
            readonly name: "_subDepth";
            readonly type: "uint256";
        }, {
            readonly internalType: "uint256";
            readonly name: "max";
            readonly type: "uint256";
        }];
        readonly name: "SubdepthTooLarge";
        readonly type: "error";
    }, {
        readonly anonymous: false;
        readonly inputs: readonly [{
            readonly indexed: true;
            readonly internalType: "address";
            readonly name: "previousOwner";
            readonly type: "address";
        }, {
            readonly indexed: true;
            readonly internalType: "address";
            readonly name: "newOwner";
            readonly type: "address";
        }];
        readonly name: "OwnershipTransferred";
        readonly type: "event";
    }, {
        readonly inputs: readonly [];
        readonly name: "MAX_DEPTH";
        readonly outputs: readonly [{
            readonly internalType: "uint256";
            readonly name: "";
            readonly type: "uint256";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [];
        readonly name: "calcMinHeight";
        readonly outputs: readonly [{
            readonly internalType: "uint256";
            readonly name: "depth";
            readonly type: "uint256";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "uint256";
            readonly name: "_leaf";
            readonly type: "uint256";
        }];
        readonly name: "enqueue";
        readonly outputs: readonly [{
            readonly internalType: "uint256";
            readonly name: "leafIndex";
            readonly type: "uint256";
        }];
        readonly stateMutability: "nonpayable";
        readonly type: "function";
    }, {
        readonly inputs: readonly [];
        readonly name: "fill";
        readonly outputs: readonly [];
        readonly stateMutability: "nonpayable";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "uint256";
            readonly name: "_depth";
            readonly type: "uint256";
        }];
        readonly name: "getMainRoot";
        readonly outputs: readonly [{
            readonly internalType: "uint256";
            readonly name: "mainRoot";
            readonly type: "uint256";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [];
        readonly name: "getSmallSRTroot";
        readonly outputs: readonly [{
            readonly internalType: "uint256";
            readonly name: "smallSubTreeRoot";
            readonly type: "uint256";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [];
        readonly name: "getSrIndices";
        readonly outputs: readonly [{
            readonly internalType: "uint256";
            readonly name: "next";
            readonly type: "uint256";
        }, {
            readonly internalType: "uint256";
            readonly name: "current";
            readonly type: "uint256";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "uint256";
            readonly name: "_index";
            readonly type: "uint256";
        }];
        readonly name: "getSubRoot";
        readonly outputs: readonly [{
            readonly internalType: "uint256";
            readonly name: "subRoot";
            readonly type: "uint256";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "uint256[2]";
            readonly name: "array";
            readonly type: "uint256[2]";
        }];
        readonly name: "hash2";
        readonly outputs: readonly [{
            readonly internalType: "uint256";
            readonly name: "result";
            readonly type: "uint256";
        }];
        readonly stateMutability: "pure";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "uint256[3]";
            readonly name: "array";
            readonly type: "uint256[3]";
        }];
        readonly name: "hash3";
        readonly outputs: readonly [{
            readonly internalType: "uint256";
            readonly name: "result";
            readonly type: "uint256";
        }];
        readonly stateMutability: "pure";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "uint256[4]";
            readonly name: "array";
            readonly type: "uint256[4]";
        }];
        readonly name: "hash4";
        readonly outputs: readonly [{
            readonly internalType: "uint256";
            readonly name: "result";
            readonly type: "uint256";
        }];
        readonly stateMutability: "pure";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "uint256[5]";
            readonly name: "array";
            readonly type: "uint256[5]";
        }];
        readonly name: "hash5";
        readonly outputs: readonly [{
            readonly internalType: "uint256";
            readonly name: "result";
            readonly type: "uint256";
        }];
        readonly stateMutability: "pure";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "uint256";
            readonly name: "left";
            readonly type: "uint256";
        }, {
            readonly internalType: "uint256";
            readonly name: "right";
            readonly type: "uint256";
        }];
        readonly name: "hashLeftRight";
        readonly outputs: readonly [{
            readonly internalType: "uint256";
            readonly name: "result";
            readonly type: "uint256";
        }];
        readonly stateMutability: "pure";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "uint256";
            readonly name: "_level";
            readonly type: "uint256";
        }, {
            readonly internalType: "uint256";
            readonly name: "_leaf";
            readonly type: "uint256";
        }];
        readonly name: "hashLevelLeaf";
        readonly outputs: readonly [{
            readonly internalType: "uint256";
            readonly name: "hashed";
            readonly type: "uint256";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "uint256";
            readonly name: "_subRoot";
            readonly type: "uint256";
        }];
        readonly name: "insertSubTree";
        readonly outputs: readonly [];
        readonly stateMutability: "nonpayable";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "uint256";
            readonly name: "_depth";
            readonly type: "uint256";
        }];
        readonly name: "merge";
        readonly outputs: readonly [{
            readonly internalType: "uint256";
            readonly name: "root";
            readonly type: "uint256";
        }];
        readonly stateMutability: "nonpayable";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "uint256";
            readonly name: "_numSrQueueOps";
            readonly type: "uint256";
        }];
        readonly name: "mergeSubRoots";
        readonly outputs: readonly [];
        readonly stateMutability: "nonpayable";
        readonly type: "function";
    }, {
        readonly inputs: readonly [];
        readonly name: "numLeaves";
        readonly outputs: readonly [{
            readonly internalType: "uint256";
            readonly name: "";
            readonly type: "uint256";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [];
        readonly name: "owner";
        readonly outputs: readonly [{
            readonly internalType: "address";
            readonly name: "";
            readonly type: "address";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [];
        readonly name: "renounceOwnership";
        readonly outputs: readonly [];
        readonly stateMutability: "nonpayable";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "uint256[]";
            readonly name: "array";
            readonly type: "uint256[]";
        }];
        readonly name: "sha256Hash";
        readonly outputs: readonly [{
            readonly internalType: "uint256";
            readonly name: "result";
            readonly type: "uint256";
        }];
        readonly stateMutability: "pure";
        readonly type: "function";
    }, {
        readonly inputs: readonly [];
        readonly name: "subTreesMerged";
        readonly outputs: readonly [{
            readonly internalType: "bool";
            readonly name: "";
            readonly type: "bool";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "address";
            readonly name: "newOwner";
            readonly type: "address";
        }];
        readonly name: "transferOwnership";
        readonly outputs: readonly [];
        readonly stateMutability: "nonpayable";
        readonly type: "function";
    }, {
        readonly inputs: readonly [];
        readonly name: "treeMerged";
        readonly outputs: readonly [{
            readonly internalType: "bool";
            readonly name: "";
            readonly type: "bool";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }];
    static createInterface(): AccQueueQuinaryInterface;
    static connect(address: string, runner?: ContractRunner | null): AccQueueQuinary;
}
//# sourceMappingURL=AccQueueQuinary__factory.d.ts.map