import { type ContractRunner } from "ethers";
import type { IHats, IHatsInterface } from "../../../contracts/interfaces/IHats";
export declare class IHats__factory {
    static readonly abi: readonly [{
        readonly inputs: readonly [{
            readonly internalType: "uint256";
            readonly name: "_admin";
            readonly type: "uint256";
        }, {
            readonly internalType: "string";
            readonly name: "_details";
            readonly type: "string";
        }, {
            readonly internalType: "uint32";
            readonly name: "_maxSupply";
            readonly type: "uint32";
        }, {
            readonly internalType: "address";
            readonly name: "_eligibility";
            readonly type: "address";
        }, {
            readonly internalType: "address";
            readonly name: "_toggle";
            readonly type: "address";
        }, {
            readonly internalType: "bool";
            readonly name: "_mutable";
            readonly type: "bool";
        }, {
            readonly internalType: "string";
            readonly name: "_imageURI";
            readonly type: "string";
        }];
        readonly name: "createHat";
        readonly outputs: readonly [{
            readonly internalType: "uint256";
            readonly name: "";
            readonly type: "uint256";
        }];
        readonly stateMutability: "nonpayable";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "address";
            readonly name: "account";
            readonly type: "address";
        }, {
            readonly internalType: "uint256";
            readonly name: "hat";
            readonly type: "uint256";
        }];
        readonly name: "isWearerOfHat";
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
            readonly name: "_hatId";
            readonly type: "uint256";
        }, {
            readonly internalType: "address";
            readonly name: "_wearer";
            readonly type: "address";
        }];
        readonly name: "mintHat";
        readonly outputs: readonly [{
            readonly internalType: "bool";
            readonly name: "success";
            readonly type: "bool";
        }];
        readonly stateMutability: "nonpayable";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "address";
            readonly name: "_target";
            readonly type: "address";
        }, {
            readonly internalType: "string";
            readonly name: "_details";
            readonly type: "string";
        }, {
            readonly internalType: "string";
            readonly name: "_imageURI";
            readonly type: "string";
        }];
        readonly name: "mintTopHat";
        readonly outputs: readonly [{
            readonly internalType: "uint256";
            readonly name: "";
            readonly type: "uint256";
        }];
        readonly stateMutability: "nonpayable";
        readonly type: "function";
    }];
    static createInterface(): IHatsInterface;
    static connect(address: string, runner?: ContractRunner | null): IHats;
}
//# sourceMappingURL=IHats__factory.d.ts.map