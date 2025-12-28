import { ContractFactory, ContractTransactionResponse } from "ethers";
import type { Signer, BigNumberish, AddressLike, ContractDeployTransaction, ContractRunner } from "ethers";
import type { PayableOverrides } from "../../../common";
import type { GitcoinPassportGatekeeper, GitcoinPassportGatekeeperInterface } from "../../../contracts/gatekeepers/GitcoinPassportGatekeeper";
type GitcoinPassportGatekeeperConstructorParams = [signer?: Signer] | ConstructorParameters<typeof ContractFactory>;
export declare class GitcoinPassportGatekeeper__factory extends ContractFactory {
    constructor(...args: GitcoinPassportGatekeeperConstructorParams);
    getDeployTransaction(_passportDecoder: AddressLike, _thresholdScore: BigNumberish, overrides?: PayableOverrides & {
        from?: string;
    }): Promise<ContractDeployTransaction>;
    deploy(_passportDecoder: AddressLike, _thresholdScore: BigNumberish, overrides?: PayableOverrides & {
        from?: string;
    }): Promise<GitcoinPassportGatekeeper & {
        deploymentTransaction(): ContractTransactionResponse;
    }>;
    connect(runner: ContractRunner | null): GitcoinPassportGatekeeper__factory;
    static readonly bytecode = "0x60c060405260405161079c38038061079c833981016040819052610022916100df565b338061004857604051631e4fbdf760e01b81526000600482015260240160405180910390fd5b6100518161008f565b506001600160a01b0382166100795760405163d92e233d60e01b815260040160405180910390fd5b6001600160a01b0390911660805260a052610119565b600080546001600160a01b038381166001600160a01b0319831681178455604051919092169283917f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e09190a35050565b600080604083850312156100f257600080fd5b82516001600160a01b038116811461010957600080fd5b6020939093015192949293505050565b60805160a05161065161014b6000396000818160b3015261035a0152600081816101c501526102eb01526106516000f3fe608060405234801561001057600080fd5b50600436106100a95760003560e01c806335815b951161007157806335815b951461016e578063715018a6146101765780638da5cb5b1461017e578063cea9a2631461018f578063d237884e146101c0578063f2fde38b146101e757600080fd5b8063019d0bb4146100ae5780630e50cee5146100e857806313e65cf31461011b57806324b8fbf61461013057806334a0922c14610143575b600080fd5b6100d57f000000000000000000000000000000000000000000000000000000000000000081565b6040519081526020015b60405180910390f35b61010b6100f6366004610498565b60026020526000908152604090205460ff1681565b60405190151581526020016100df565b61012e610129366004610498565b6101fa565b005b61012e61013e3660046104d0565b61024b565b600154610156906001600160a01b031681565b6040516001600160a01b0390911681526020016100df565b6100d5606481565b61012e6103a8565b6000546001600160a01b0316610156565b604080518082018252600f81526e11da5d18dbda5b94185cdcdc1bdc9d608a1b602082015290516100df9190610592565b6101567f000000000000000000000000000000000000000000000000000000000000000081565b61012e6101f5366004610498565b6103bc565b6102026103ff565b6001600160a01b0381166102295760405163d92e233d60e01b815260040160405180910390fd5b600180546001600160a01b0319166001600160a01b0392909216919091179055565b6001546001600160a01b0316331461027657604051630346d90560e21b815260040160405180910390fd5b6001600160a01b03821660009081526002602052604090205460ff16156102b057604051630ea075bf60e21b815260040160405180910390fd5b6001600160a01b03828116600081815260026020526040808220805460ff1916600117905551630d47875d60e41b81526004810192909252917f0000000000000000000000000000000000000000000000000000000000000000169063d47875d090602401602060405180830381865afa158015610332573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061035691906105e0565b90507f00000000000000000000000000000000000000000000000000000000000000006103846064836105f9565b10156103a357604051630e94124b60e01b815260040160405180910390fd5b505050565b6103b06103ff565b6103ba600061042c565b565b6103c46103ff565b6001600160a01b0381166103f357604051631e4fbdf760e01b8152600060048201526024015b60405180910390fd5b6103fc8161042c565b50565b6000546001600160a01b031633146103ba5760405163118cdaa760e01b81523360048201526024016103ea565b600080546001600160a01b038381166001600160a01b0319831681178455604051919092169283917f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e09190a35050565b80356001600160a01b038116811461049357600080fd5b919050565b6000602082840312156104aa57600080fd5b6104b38261047c565b9392505050565b634e487b7160e01b600052604160045260246000fd5b600080604083850312156104e357600080fd5b6104ec8361047c565b9150602083013567ffffffffffffffff8082111561050957600080fd5b818501915085601f83011261051d57600080fd5b81358181111561052f5761052f6104ba565b604051601f8201601f19908116603f01168101908382118183101715610557576105576104ba565b8160405282815288602084870101111561057057600080fd5b8260208601602083013760006020848301015280955050505050509250929050565b600060208083528351808285015260005b818110156105bf578581018301518582016040015282016105a3565b506000604082860101526040601f19601f8301168501019250505092915050565b6000602082840312156105f257600080fd5b5051919050565b60008261061657634e487b7160e01b600052601260045260246000fd5b50049056fea26469706673582212206218c2aa8a16970e4fcecc5181a9928836b3549de8cdc9d896e72b37756d153564736f6c63430008140033";
    static readonly abi: readonly [{
        readonly inputs: readonly [{
            readonly internalType: "address";
            readonly name: "_passportDecoder";
            readonly type: "address";
        }, {
            readonly internalType: "uint256";
            readonly name: "_thresholdScore";
            readonly type: "uint256";
        }];
        readonly stateMutability: "payable";
        readonly type: "constructor";
    }, {
        readonly inputs: readonly [];
        readonly name: "AlreadyRegistered";
        readonly type: "error";
    }, {
        readonly inputs: readonly [];
        readonly name: "OnlyMACI";
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
        readonly name: "ScoreTooLow";
        readonly type: "error";
    }, {
        readonly inputs: readonly [];
        readonly name: "ZeroAddress";
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
        readonly name: "FACTOR";
        readonly outputs: readonly [{
            readonly internalType: "uint256";
            readonly name: "";
            readonly type: "uint256";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
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
        readonly inputs: readonly [];
        readonly name: "maci";
        readonly outputs: readonly [{
            readonly internalType: "address";
            readonly name: "";
            readonly type: "address";
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
        readonly name: "passportDecoder";
        readonly outputs: readonly [{
            readonly internalType: "contract IGitcoinPassportDecoder";
            readonly name: "";
            readonly type: "address";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "address";
            readonly name: "_user";
            readonly type: "address";
        }, {
            readonly internalType: "bytes";
            readonly name: "";
            readonly type: "bytes";
        }];
        readonly name: "register";
        readonly outputs: readonly [];
        readonly stateMutability: "nonpayable";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "address";
            readonly name: "";
            readonly type: "address";
        }];
        readonly name: "registeredUsers";
        readonly outputs: readonly [{
            readonly internalType: "bool";
            readonly name: "";
            readonly type: "bool";
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
            readonly internalType: "address";
            readonly name: "_maci";
            readonly type: "address";
        }];
        readonly name: "setMaciInstance";
        readonly outputs: readonly [];
        readonly stateMutability: "nonpayable";
        readonly type: "function";
    }, {
        readonly inputs: readonly [];
        readonly name: "thresholdScore";
        readonly outputs: readonly [{
            readonly internalType: "uint256";
            readonly name: "";
            readonly type: "uint256";
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
    }];
    static createInterface(): GitcoinPassportGatekeeperInterface;
    static connect(address: string, runner?: ContractRunner | null): GitcoinPassportGatekeeper;
}
export {};
//# sourceMappingURL=GitcoinPassportGatekeeper__factory.d.ts.map