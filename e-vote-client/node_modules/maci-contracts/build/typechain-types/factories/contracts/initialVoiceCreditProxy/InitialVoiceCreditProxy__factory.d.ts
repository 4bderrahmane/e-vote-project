import { type ContractRunner } from "ethers";
import type { InitialVoiceCreditProxy, InitialVoiceCreditProxyInterface } from "../../../contracts/initialVoiceCreditProxy/InitialVoiceCreditProxy";
export declare class InitialVoiceCreditProxy__factory {
    static readonly abi: readonly [{
        readonly inputs: readonly [{
            readonly internalType: "address";
            readonly name: "_user";
            readonly type: "address";
        }, {
            readonly internalType: "bytes";
            readonly name: "_data";
            readonly type: "bytes";
        }];
        readonly name: "getVoiceCredits";
        readonly outputs: readonly [{
            readonly internalType: "uint256";
            readonly name: "";
            readonly type: "uint256";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }];
    static createInterface(): InitialVoiceCreditProxyInterface;
    static connect(address: string, runner?: ContractRunner | null): InitialVoiceCreditProxy;
}
//# sourceMappingURL=InitialVoiceCreditProxy__factory.d.ts.map