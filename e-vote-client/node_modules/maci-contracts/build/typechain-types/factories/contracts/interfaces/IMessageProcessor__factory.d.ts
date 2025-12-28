import { type ContractRunner } from "ethers";
import type { IMessageProcessor, IMessageProcessorInterface } from "../../../contracts/interfaces/IMessageProcessor";
export declare class IMessageProcessor__factory {
    static readonly abi: readonly [{
        readonly inputs: readonly [{
            readonly internalType: "uint256";
            readonly name: "_currentMessageBatchIndex";
            readonly type: "uint256";
        }, {
            readonly internalType: "uint256";
            readonly name: "_newSbCommitment";
            readonly type: "uint256";
        }];
        readonly name: "getPublicCircuitInputs";
        readonly outputs: readonly [{
            readonly internalType: "uint256[]";
            readonly name: "";
            readonly type: "uint256[]";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [];
        readonly name: "processingComplete";
        readonly outputs: readonly [{
            readonly internalType: "bool";
            readonly name: "";
            readonly type: "bool";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [];
        readonly name: "sbCommitment";
        readonly outputs: readonly [{
            readonly internalType: "uint256";
            readonly name: "";
            readonly type: "uint256";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }];
    static createInterface(): IMessageProcessorInterface;
    static connect(address: string, runner?: ContractRunner | null): IMessageProcessor;
}
//# sourceMappingURL=IMessageProcessor__factory.d.ts.map