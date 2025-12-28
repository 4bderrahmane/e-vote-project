import { type ContractRunner } from "ethers";
import type { SignUpGatekeeper, SignUpGatekeeperInterface } from "../../../contracts/gatekeepers/SignUpGatekeeper";
export declare class SignUpGatekeeper__factory {
    static readonly abi: readonly [{
        readonly inputs: readonly [];
        readonly name: "getTrait";
        readonly outputs: readonly [{
            readonly internalType: "string";
            readonly name: "";
            readonly type: "string";
        }];
        readonly stateMutability: "pure";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "address";
            readonly name: "_user";
            readonly type: "address";
        }, {
            readonly internalType: "bytes";
            readonly name: "_data";
            readonly type: "bytes";
        }];
        readonly name: "register";
        readonly outputs: readonly [];
        readonly stateMutability: "nonpayable";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "address";
            readonly name: "_maci";
            readonly type: "address";
        }];
        readonly name: "setMaciInstance";
        readonly outputs: readonly [];
        readonly stateMutability: "nonpayable";
        readonly type: "function";
    }];
    static createInterface(): SignUpGatekeeperInterface;
    static connect(address: string, runner?: ContractRunner | null): SignUpGatekeeper;
}
//# sourceMappingURL=SignUpGatekeeper__factory.d.ts.map