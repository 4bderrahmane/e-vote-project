import { type ContractRunner } from "ethers";
import type { IPollFactory, IPollFactoryInterface } from "../../../contracts/interfaces/IPollFactory";
export declare class IPollFactory__factory {
    static readonly abi: readonly [{
        readonly inputs: readonly [{
            readonly internalType: "uint256";
            readonly name: "_duration";
            readonly type: "uint256";
        }, {
            readonly components: readonly [{
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
            readonly internalType: "struct Params.TreeDepths";
            readonly name: "_treeDepths";
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
            readonly name: "_coordinatorPubKey";
            readonly type: "tuple";
        }, {
            readonly internalType: "address";
            readonly name: "_maci";
            readonly type: "address";
        }, {
            readonly internalType: "uint256";
            readonly name: "_emptyBallotRoot";
            readonly type: "uint256";
        }];
        readonly name: "deploy";
        readonly outputs: readonly [{
            readonly internalType: "address";
            readonly name: "";
            readonly type: "address";
        }];
        readonly stateMutability: "nonpayable";
        readonly type: "function";
    }];
    static createInterface(): IPollFactoryInterface;
    static connect(address: string, runner?: ContractRunner | null): IPollFactory;
}
//# sourceMappingURL=IPollFactory__factory.d.ts.map