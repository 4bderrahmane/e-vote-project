import { type ContractRunner } from "ethers";
import type { ISemaphore, ISemaphoreInterface } from "../../../contracts/interfaces/ISemaphore";
export declare class ISemaphore__factory {
    static readonly abi: readonly [{
        readonly inputs: readonly [{
            readonly internalType: "uint256";
            readonly name: "groupId";
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
    static createInterface(): ISemaphoreInterface;
    static connect(address: string, runner?: ContractRunner | null): ISemaphore;
}
//# sourceMappingURL=ISemaphore__factory.d.ts.map