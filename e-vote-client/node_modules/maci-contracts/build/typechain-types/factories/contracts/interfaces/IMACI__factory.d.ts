import { type ContractRunner } from "ethers";
import type { IMACI, IMACIInterface } from "../../../contracts/interfaces/IMACI";
export declare class IMACI__factory {
    static readonly abi: readonly [{
        readonly inputs: readonly [];
        readonly name: "getStateTreeRoot";
        readonly outputs: readonly [{
            readonly internalType: "uint256";
            readonly name: "";
            readonly type: "uint256";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [];
        readonly name: "numSignUps";
        readonly outputs: readonly [{
            readonly internalType: "uint256";
            readonly name: "";
            readonly type: "uint256";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [];
        readonly name: "stateTreeDepth";
        readonly outputs: readonly [{
            readonly internalType: "uint8";
            readonly name: "";
            readonly type: "uint8";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }];
    static createInterface(): IMACIInterface;
    static connect(address: string, runner?: ContractRunner | null): IMACI;
}
//# sourceMappingURL=IMACI__factory.d.ts.map