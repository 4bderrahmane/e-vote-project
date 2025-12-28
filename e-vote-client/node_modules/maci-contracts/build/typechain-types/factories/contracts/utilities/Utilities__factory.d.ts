import { ContractFactory, ContractTransactionResponse } from "ethers";
import type { Signer, ContractDeployTransaction, ContractRunner } from "ethers";
import type { NonPayableOverrides } from "../../../common";
import type { Utilities, UtilitiesInterface } from "../../../contracts/utilities/Utilities";
type UtilitiesConstructorParams = [linkLibraryAddresses: UtilitiesLibraryAddresses, signer?: Signer] | ConstructorParameters<typeof ContractFactory>;
export declare class Utilities__factory extends ContractFactory {
    constructor(...args: UtilitiesConstructorParams);
    static linkBytecode(linkLibraryAddresses: UtilitiesLibraryAddresses): string;
    getDeployTransaction(overrides?: NonPayableOverrides & {
        from?: string;
    }): Promise<ContractDeployTransaction>;
    deploy(overrides?: NonPayableOverrides & {
        from?: string;
    }): Promise<Utilities & {
        deploymentTransaction(): ContractTransactionResponse;
    }>;
    connect(runner: ContractRunner | null): Utilities__factory;
    static readonly bytecode = "0x608060405234801561001057600080fd5b50610bae806100206000396000f3fe608060405234801561001057600080fd5b506004361061009e5760003560e01c80637d0a81c8116100665780637d0a81c81461011c5780638a2a3dfb1461012f5780639cfced9714610142578063bea140b314610155578063edbfe83f1461016857600080fd5b80633dfb88b2146100a357806358bfc379146100c95780635bb93995146100dc57806362a361bb146100ef578063683f3dc314610102575b600080fd5b6100b66100b1366004610630565b61018a565b6040519081526020015b60405180910390f35b6100b66100d73660046106ae565b61020b565b6100b66100ea366004610754565b6102a5565b6100b66100fd366004610776565b6102ca565b61010a600a81565b60405160ff90911681526020016100c0565b6100b661012a366004610820565b610304565b6100b661013d366004610882565b610344565b6100b6610150366004610931565b610412565b6100b661016336600461098a565b61044c565b61017b610176366004610776565b610486565b6040516100c0939291906109e3565b60405163248f667760e01b815260009073__$ce9c2c925f157047e54fa833ec4e61409f$__9063248f6677906101c4908590600401610a2f565b602060405180830381865af41580156101e1573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906102059190610a60565b92915050565b60007f30644e72e131a029b85045b68181585d2833e84879b9709143e1f593f00000016002836040516020016102419190610a79565b60408051601f198184030181529082905261025b91610aaf565b602060405180830381855afa158015610278573d6000803e3d6000fd5b5050506040513d601f19601f8201168201806040525081019061029b9190610a60565b6102059190610ade565b60006102af61052e565b838152602081018390526102c2816102ca565b949350505050565b6040516314d2f97b60e11b815260009073__$6574937f64fc1d7710ec0e28b7a36713bb$__906329a5f2f6906101c4908590600401610b00565b600061030e61054c565b825151815282516020908101518183015283015181600260200201526040830151606082015261033d8161018a565b9392505050565b600061034e61056a565b835151815283516020908101519082015283516040908101519082015283516060908101519082015283516080908101519082015261038b61056a565b845160a001518152845160c001516020820152845160e0015160408083019190915285516101000151606083015285516101200151608080840191909152815190810190915261040990806103df85610412565b81526020016103ed84610412565b815260200186600001518152602001866020015181525061018a565b95945050505050565b604051630926f44b60e31b815260009073__$20527677031d76601747626a9845039fe4$__90634937a258906101c4908590600401610b28565b6040516304b98e1d60e31b815260009073__$dc01a9744591ab014bc46a3b7671cdaefb$__906325cc70e8906101c4908590600401610b50565b61048e610588565b604080518082019091526000808252602082015260006104ac6105a0565b84518152602080860151828201526040805180820182527f171e826ad4a870fd925e0bf0e87884e70e080879c2205ef10114f28a3b6f6dd781527f2bd407d897fbbca9f88adfd2d15252e69de8c1564eb4d3d27162e259172f1a1d81840152815192830190915282825290945092506105258484610344565b93959294505050565b60405180604001604052806002906020820280368337509192915050565b60405180608001604052806004906020820280368337509192915050565b6040518060a001604052806005906020820280368337509192915050565b604051806020016040528061059b6105a0565b905290565b604051806101400160405280600a906020820280368337509192915050565b634e487b7160e01b600052604160045260246000fd5b604051610140810167ffffffffffffffff811182821017156105f9576105f96105bf565b60405290565b604051601f8201601f1916810167ffffffffffffffff81118282101715610628576106286105bf565b604052919050565b60006080828403121561064257600080fd5b82601f83011261065157600080fd5b6040516080810181811067ffffffffffffffff82111715610674576106746105bf565b60405280608084018581111561068957600080fd5b845b818110156106a357803583526020928301920161068b565b509195945050505050565b600060208083850312156106c157600080fd5b823567ffffffffffffffff808211156106d957600080fd5b818501915085601f8301126106ed57600080fd5b8135818111156106ff576106ff6105bf565b8060051b91506107108483016105ff565b818152918301840191848101908884111561072a57600080fd5b938501935b838510156107485784358252938501939085019061072f565b98975050505050505050565b6000806040838503121561076757600080fd5b50508035926020909101359150565b60006040828403121561078857600080fd5b82601f83011261079757600080fd5b6040516040810181811067ffffffffffffffff821117156107ba576107ba6105bf565b806040525080604084018581111561068957600080fd5b6000604082840312156107e357600080fd5b6040516040810181811067ffffffffffffffff82111715610806576108066105bf565b604052823581526020928301359281019290925250919050565b60006080828403121561083257600080fd5b6040516060810181811067ffffffffffffffff82111715610855576108556105bf565b60405261086284846107d1565b815260408301356020820152606083013560408201528091505092915050565b60008082840361018081121561089757600080fd5b610140808212156108a757600080fd5b6040519150602080830183811067ffffffffffffffff821117156108cd576108cd6105bf565b604052601f860187136108df57600080fd5b6108e76105d5565b9186019180888411156108f957600080fd5b875b8481101561091257803583529183019183016108fb565b5080855250505081935061092686826107d1565b925050509250929050565b600060a0828403121561094357600080fd5b82601f83011261095257600080fd5b60405160a0810181811067ffffffffffffffff82111715610975576109756105bf565b6040528060a084018581111561068957600080fd5b60006060828403121561099c57600080fd5b82601f8301126109ab57600080fd5b6040516060810181811067ffffffffffffffff821117156109ce576109ce6105bf565b60405280606084018581111561068957600080fd5b83516101a08201908260005b600a811015610a0e5782518252602092830192909101906001016109ef565b50508451610140840152506020909301516101608201526101800152919050565b60808101818360005b6004811015610a57578151835260209283019290910190600101610a38565b50505092915050565b600060208284031215610a7257600080fd5b5051919050565b815160009082906020808601845b83811015610aa357815185529382019390820190600101610a87565b50929695505050505050565b6000825160005b81811015610ad05760208186018101518583015201610ab6565b506000920191825250919050565b600082610afb57634e487b7160e01b600052601260045260246000fd5b500690565b60408101818360005b6002811015610a57578151835260209283019290910190600101610b09565b60a08101818360005b6005811015610a57578151835260209283019290910190600101610b31565b60608101818360005b6003811015610a57578151835260209283019290910190600101610b5956fea2646970667358221220cdaa539bf38f6745cd6010fbb5d716fa0ec04e00852a765548e3f1d86e492fca64736f6c63430008140033";
    static readonly abi: readonly [{
        readonly inputs: readonly [];
        readonly name: "InvalidMessage";
        readonly type: "error";
    }, {
        readonly inputs: readonly [];
        readonly name: "MESSAGE_DATA_LENGTH";
        readonly outputs: readonly [{
            readonly internalType: "uint8";
            readonly name: "";
            readonly type: "uint8";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "uint256[2]";
            readonly name: "array";
            readonly type: "uint256[2]";
        }];
        readonly name: "hash2";
        readonly outputs: readonly [{
            readonly internalType: "uint256";
            readonly name: "result";
            readonly type: "uint256";
        }];
        readonly stateMutability: "pure";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "uint256[3]";
            readonly name: "array";
            readonly type: "uint256[3]";
        }];
        readonly name: "hash3";
        readonly outputs: readonly [{
            readonly internalType: "uint256";
            readonly name: "result";
            readonly type: "uint256";
        }];
        readonly stateMutability: "pure";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "uint256[4]";
            readonly name: "array";
            readonly type: "uint256[4]";
        }];
        readonly name: "hash4";
        readonly outputs: readonly [{
            readonly internalType: "uint256";
            readonly name: "result";
            readonly type: "uint256";
        }];
        readonly stateMutability: "pure";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "uint256[5]";
            readonly name: "array";
            readonly type: "uint256[5]";
        }];
        readonly name: "hash5";
        readonly outputs: readonly [{
            readonly internalType: "uint256";
            readonly name: "result";
            readonly type: "uint256";
        }];
        readonly stateMutability: "pure";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "uint256";
            readonly name: "left";
            readonly type: "uint256";
        }, {
            readonly internalType: "uint256";
            readonly name: "right";
            readonly type: "uint256";
        }];
        readonly name: "hashLeftRight";
        readonly outputs: readonly [{
            readonly internalType: "uint256";
            readonly name: "result";
            readonly type: "uint256";
        }];
        readonly stateMutability: "pure";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly components: readonly [{
                readonly internalType: "uint256[10]";
                readonly name: "data";
                readonly type: "uint256[10]";
            }];
            readonly internalType: "struct DomainObjs.Message";
            readonly name: "_message";
            readonly type: "tuple";
        }, {
            readonly components: readonly [{
                readonly internalType: "uint256";
                readonly name: "x";
                readonly type: "uint256";
            }, {
                readonly internalType: "uint256";
                readonly name: "y";
                readonly type: "uint256";
            }];
            readonly internalType: "struct DomainObjs.PubKey";
            readonly name: "_encPubKey";
            readonly type: "tuple";
        }];
        readonly name: "hashMessageAndEncPubKey";
        readonly outputs: readonly [{
            readonly internalType: "uint256";
            readonly name: "msgHash";
            readonly type: "uint256";
        }];
        readonly stateMutability: "pure";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly components: readonly [{
                readonly components: readonly [{
                    readonly internalType: "uint256";
                    readonly name: "x";
                    readonly type: "uint256";
                }, {
                    readonly internalType: "uint256";
                    readonly name: "y";
                    readonly type: "uint256";
                }];
                readonly internalType: "struct DomainObjs.PubKey";
                readonly name: "pubKey";
                readonly type: "tuple";
            }, {
                readonly internalType: "uint256";
                readonly name: "voiceCreditBalance";
                readonly type: "uint256";
            }, {
                readonly internalType: "uint256";
                readonly name: "timestamp";
                readonly type: "uint256";
            }];
            readonly internalType: "struct DomainObjs.StateLeaf";
            readonly name: "_stateLeaf";
            readonly type: "tuple";
        }];
        readonly name: "hashStateLeaf";
        readonly outputs: readonly [{
            readonly internalType: "uint256";
            readonly name: "ciphertext";
            readonly type: "uint256";
        }];
        readonly stateMutability: "pure";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "uint256[2]";
            readonly name: "dataToPad";
            readonly type: "uint256[2]";
        }];
        readonly name: "padAndHashMessage";
        readonly outputs: readonly [{
            readonly components: readonly [{
                readonly internalType: "uint256[10]";
                readonly name: "data";
                readonly type: "uint256[10]";
            }];
            readonly internalType: "struct DomainObjs.Message";
            readonly name: "message";
            readonly type: "tuple";
        }, {
            readonly components: readonly [{
                readonly internalType: "uint256";
                readonly name: "x";
                readonly type: "uint256";
            }, {
                readonly internalType: "uint256";
                readonly name: "y";
                readonly type: "uint256";
            }];
            readonly internalType: "struct DomainObjs.PubKey";
            readonly name: "padKey";
            readonly type: "tuple";
        }, {
            readonly internalType: "uint256";
            readonly name: "msgHash";
            readonly type: "uint256";
        }];
        readonly stateMutability: "pure";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "uint256[]";
            readonly name: "array";
            readonly type: "uint256[]";
        }];
        readonly name: "sha256Hash";
        readonly outputs: readonly [{
            readonly internalType: "uint256";
            readonly name: "result";
            readonly type: "uint256";
        }];
        readonly stateMutability: "pure";
        readonly type: "function";
    }];
    static createInterface(): UtilitiesInterface;
    static connect(address: string, runner?: ContractRunner | null): Utilities;
}
export interface UtilitiesLibraryAddresses {
    ["contracts/crypto/PoseidonT5.sol:PoseidonT5"]: string;
    ["contracts/crypto/PoseidonT3.sol:PoseidonT3"]: string;
    ["contracts/crypto/PoseidonT6.sol:PoseidonT6"]: string;
    ["contracts/crypto/PoseidonT4.sol:PoseidonT4"]: string;
}
export {};
//# sourceMappingURL=Utilities__factory.d.ts.map