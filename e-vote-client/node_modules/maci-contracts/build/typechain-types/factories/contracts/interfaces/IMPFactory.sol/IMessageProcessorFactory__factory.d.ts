import { type ContractRunner } from "ethers";
import type { IMessageProcessorFactory, IMessageProcessorFactoryInterface } from "../../../../contracts/interfaces/IMPFactory.sol/IMessageProcessorFactory";
export declare class IMessageProcessorFactory__factory {
    static readonly abi: readonly [{
        readonly inputs: readonly [{
            readonly internalType: "address";
            readonly name: "_verifier";
            readonly type: "address";
        }, {
            readonly internalType: "address";
            readonly name: "_vkRegistry";
            readonly type: "address";
        }, {
            readonly internalType: "address";
            readonly name: "_poll";
            readonly type: "address";
        }, {
            readonly internalType: "address";
            readonly name: "_owner";
            readonly type: "address";
        }, {
            readonly internalType: "enum DomainObjs.Mode";
            readonly name: "_mode";
            readonly type: "uint8";
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
    static createInterface(): IMessageProcessorFactoryInterface;
    static connect(address: string, runner?: ContractRunner | null): IMessageProcessorFactory;
}
//# sourceMappingURL=IMessageProcessorFactory__factory.d.ts.map