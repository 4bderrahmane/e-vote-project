import { type ContractRunner } from "ethers";
import type { ITally, ITallyInterface } from "../../../contracts/interfaces/ITally";
export declare class ITally__factory {
    static readonly abi: readonly [{
        readonly inputs: readonly [{
            readonly internalType: "uint256";
            readonly name: "_voteOptionIndex";
            readonly type: "uint256";
        }, {
            readonly internalType: "uint256";
            readonly name: "_spent";
            readonly type: "uint256";
        }, {
            readonly internalType: "uint256[][]";
            readonly name: "_spentProof";
            readonly type: "uint256[][]";
        }, {
            readonly internalType: "uint256";
            readonly name: "_spentSalt";
            readonly type: "uint256";
        }, {
            readonly internalType: "uint8";
            readonly name: "_voteOptionTreeDepth";
            readonly type: "uint8";
        }, {
            readonly internalType: "uint256";
            readonly name: "_spentVoiceCreditsHash";
            readonly type: "uint256";
        }, {
            readonly internalType: "uint256";
            readonly name: "_resultCommitment";
            readonly type: "uint256";
        }];
        readonly name: "verifyPerVOSpentVoiceCredits";
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
            readonly name: "_totalSpent";
            readonly type: "uint256";
        }, {
            readonly internalType: "uint256";
            readonly name: "_totalSpentSalt";
            readonly type: "uint256";
        }, {
            readonly internalType: "uint256";
            readonly name: "_resultCommitment";
            readonly type: "uint256";
        }, {
            readonly internalType: "uint256";
            readonly name: "_perVOSpentVoiceCreditsHash";
            readonly type: "uint256";
        }];
        readonly name: "verifySpentVoiceCredits";
        readonly outputs: readonly [{
            readonly internalType: "bool";
            readonly name: "";
            readonly type: "bool";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }];
    static createInterface(): ITallyInterface;
    static connect(address: string, runner?: ContractRunner | null): ITally;
}
//# sourceMappingURL=ITally__factory.d.ts.map