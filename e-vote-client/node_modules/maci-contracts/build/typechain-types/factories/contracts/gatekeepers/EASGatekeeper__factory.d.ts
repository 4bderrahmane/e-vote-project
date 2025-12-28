import { ContractFactory, ContractTransactionResponse } from "ethers";
import type { Signer, BytesLike, AddressLike, ContractDeployTransaction, ContractRunner } from "ethers";
import type { PayableOverrides } from "../../../common";
import type { EASGatekeeper, EASGatekeeperInterface } from "../../../contracts/gatekeepers/EASGatekeeper";
type EASGatekeeperConstructorParams = [signer?: Signer] | ConstructorParameters<typeof ContractFactory>;
export declare class EASGatekeeper__factory extends ContractFactory {
    constructor(...args: EASGatekeeperConstructorParams);
    getDeployTransaction(_eas: AddressLike, _attester: AddressLike, _schema: BytesLike, overrides?: PayableOverrides & {
        from?: string;
    }): Promise<ContractDeployTransaction>;
    deploy(_eas: AddressLike, _attester: AddressLike, _schema: BytesLike, overrides?: PayableOverrides & {
        from?: string;
    }): Promise<EASGatekeeper & {
        deploymentTransaction(): ContractTransactionResponse;
    }>;
    connect(runner: ContractRunner | null): EASGatekeeper__factory;
    static readonly bytecode = "0x60e0604052604051610a83380380610a8383398101604081905261002291610113565b338061004857604051631e4fbdf760e01b81526000600482015260240160405180910390fd5b610051816100a7565b506001600160a01b038316158061006f57506001600160a01b038216155b1561008d5760405163d92e233d60e01b815260040160405180910390fd5b6001600160a01b0392831660805260a0521660c05261014f565b600080546001600160a01b038381166001600160a01b0319831681178455604051919092169283917f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e09190a35050565b80516001600160a01b038116811461010e57600080fd5b919050565b60008060006060848603121561012857600080fd5b610131846100f7565b925061013f602085016100f7565b9150604084015190509250925092565b60805160a05160c0516108f06101936000396000818161013e01526103bf0152600081816101dd015261037b01526000818161016d015261030801526108f06000f3fe608060405234801561001057600080fd5b50600436106100a95760003560e01c8063715018a611610071578063715018a6146101605780638150864d146101685780638da5cb5b1461018f578063cea9a263146101a0578063f2fde38b146101c5578063f8895cc8146101d857600080fd5b8063013209db146100ae57806313e65cf3146100e657806324b8fbf6146100fb57806334a0922c1461010e57806347b0c3b314610139575b600080fd5b6100d16100bc366004610550565b60026020526000908152604090205460ff1681565b60405190151581526020015b60405180910390f35b6100f96100f436600461057e565b61020d565b005b6100f961010936600461063b565b61025e565b600154610121906001600160a01b031681565b6040516001600160a01b0390911681526020016100dd565b6101217f000000000000000000000000000000000000000000000000000000000000000081565b6100f961047c565b6101217f000000000000000000000000000000000000000000000000000000000000000081565b6000546001600160a01b0316610121565b604080518082018252600381526245415360e81b602082015290516100dd91906106f2565b6100f96101d336600461057e565b610490565b6101ff7f000000000000000000000000000000000000000000000000000000000000000081565b6040519081526020016100dd565b6102156104d3565b6001600160a01b03811661023c5760405163d92e233d60e01b815260040160405180910390fd5b600180546001600160a01b0319166001600160a01b0392909216919091179055565b6000818060200190518101906102749190610725565b6001549091506001600160a01b031633146102a257604051630346d90560e21b815260040160405180910390fd5b60008181526002602052604090205460ff16156102d257604051630ea075bf60e21b815260040160405180910390fd5b600081815260026020526040808220805460ff19166001179055516328c44a9960e21b8152600481018390526001600160a01b037f0000000000000000000000000000000000000000000000000000000000000000169063a3112a6490602401600060405180830381865afa15801561034f573d6000803e3d6000fd5b505050506040513d6000823e601f3d908101601f1916820160405261037791908101906107c3565b90507f00000000000000000000000000000000000000000000000000000000000000008160200151146103bd57604051635f9bd90760e11b815260040160405180910390fd5b7f00000000000000000000000000000000000000000000000000000000000000006001600160a01b03168160e001516001600160a01b0316146104135760405163cd74a32b60e01b815260040160405180910390fd5b608081015167ffffffffffffffff161561044057604051637b6227e960e11b815260040160405180910390fd5b836001600160a01b03168160c001516001600160a01b03161461047657604051633f97208360e11b815260040160405180910390fd5b50505050565b6104846104d3565b61048e6000610500565b565b6104986104d3565b6001600160a01b0381166104c757604051631e4fbdf760e01b8152600060048201526024015b60405180910390fd5b6104d081610500565b50565b6000546001600160a01b0316331461048e5760405163118cdaa760e01b81523360048201526024016104be565b600080546001600160a01b038381166001600160a01b0319831681178455604051919092169283917f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e09190a35050565b60006020828403121561056257600080fd5b5035919050565b6001600160a01b03811681146104d057600080fd5b60006020828403121561059057600080fd5b813561059b81610569565b9392505050565b634e487b7160e01b600052604160045260246000fd5b604051610140810167ffffffffffffffff811182821017156105dc576105dc6105a2565b60405290565b604051601f8201601f1916810167ffffffffffffffff8111828210171561060b5761060b6105a2565b604052919050565b600067ffffffffffffffff82111561062d5761062d6105a2565b50601f01601f191660200190565b6000806040838503121561064e57600080fd5b823561065981610569565b9150602083013567ffffffffffffffff81111561067557600080fd5b8301601f8101851361068657600080fd5b803561069961069482610613565b6105e2565b8181528660208385010111156106ae57600080fd5b816020840160208301376000602083830101528093505050509250929050565b60005b838110156106e95781810151838201526020016106d1565b50506000910152565b60208152600082518060208401526107118160408501602087016106ce565b601f01601f19169190910160400192915050565b60006020828403121561073757600080fd5b5051919050565b805167ffffffffffffffff8116811461075657600080fd5b919050565b805161075681610569565b8051801515811461075657600080fd5b600082601f83011261078757600080fd5b815161079561069482610613565b8181528460208386010111156107aa57600080fd5b6107bb8260208301602087016106ce565b949350505050565b6000602082840312156107d557600080fd5b815167ffffffffffffffff808211156107ed57600080fd5b90830190610140828603121561080257600080fd5b61080a6105b8565b82518152602083015160208201526108246040840161073e565b60408201526108356060840161073e565b60608201526108466080840161073e565b608082015260a083015160a082015261086160c0840161075b565b60c082015261087260e0840161075b565b60e0820152610100610885818501610766565b90820152610120838101518381111561089d57600080fd5b6108a988828701610776565b91830191909152509594505050505056fea2646970667358221220af59228b1918373d948d7a5621780c824140e369c93730c8ed885df82bce58f264736f6c63430008140033";
    static readonly abi: readonly [{
        readonly inputs: readonly [{
            readonly internalType: "address";
            readonly name: "_eas";
            readonly type: "address";
        }, {
            readonly internalType: "address";
            readonly name: "_attester";
            readonly type: "address";
        }, {
            readonly internalType: "bytes32";
            readonly name: "_schema";
            readonly type: "bytes32";
        }];
        readonly stateMutability: "payable";
        readonly type: "constructor";
    }, {
        readonly inputs: readonly [];
        readonly name: "AlreadyRegistered";
        readonly type: "error";
    }, {
        readonly inputs: readonly [];
        readonly name: "AttestationRevoked";
        readonly type: "error";
    }, {
        readonly inputs: readonly [];
        readonly name: "AttesterNotTrusted";
        readonly type: "error";
    }, {
        readonly inputs: readonly [];
        readonly name: "InvalidSchema";
        readonly type: "error";
    }, {
        readonly inputs: readonly [];
        readonly name: "NotYourAttestation";
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
        readonly name: "attester";
        readonly outputs: readonly [{
            readonly internalType: "address";
            readonly name: "";
            readonly type: "address";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [];
        readonly name: "eas";
        readonly outputs: readonly [{
            readonly internalType: "contract IEAS";
            readonly name: "";
            readonly type: "address";
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
            readonly internalType: "bytes32";
            readonly name: "";
            readonly type: "bytes32";
        }];
        readonly name: "registeredAttestations";
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
        readonly inputs: readonly [];
        readonly name: "schema";
        readonly outputs: readonly [{
            readonly internalType: "bytes32";
            readonly name: "";
            readonly type: "bytes32";
        }];
        readonly stateMutability: "view";
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
    static createInterface(): EASGatekeeperInterface;
    static connect(address: string, runner?: ContractRunner | null): EASGatekeeper;
}
export {};
//# sourceMappingURL=EASGatekeeper__factory.d.ts.map