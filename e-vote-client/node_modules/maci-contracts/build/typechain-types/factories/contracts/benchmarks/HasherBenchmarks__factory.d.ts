import { ContractFactory, ContractTransactionResponse } from "ethers";
import type { Signer, ContractDeployTransaction, ContractRunner } from "ethers";
import type { NonPayableOverrides } from "../../../common";
import type { HasherBenchmarks, HasherBenchmarksInterface } from "../../../contracts/benchmarks/HasherBenchmarks";
type HasherBenchmarksConstructorParams = [linkLibraryAddresses: HasherBenchmarksLibraryAddresses, signer?: Signer] | ConstructorParameters<typeof ContractFactory>;
export declare class HasherBenchmarks__factory extends ContractFactory {
    constructor(...args: HasherBenchmarksConstructorParams);
    static linkBytecode(linkLibraryAddresses: HasherBenchmarksLibraryAddresses): string;
    getDeployTransaction(overrides?: NonPayableOverrides & {
        from?: string;
    }): Promise<ContractDeployTransaction>;
    deploy(overrides?: NonPayableOverrides & {
        from?: string;
    }): Promise<HasherBenchmarks & {
        deploymentTransaction(): ContractTransactionResponse;
    }>;
    connect(runner: ContractRunner | null): HasherBenchmarks__factory;
    static readonly bytecode = "0x608060405234801561001057600080fd5b5061077a806100206000396000f3fe608060405234801561001057600080fd5b50600436106100885760003560e01c80639cfced971161005b5780639cfced97146100eb578063a1b0f257146100fe578063a3b4717c14610111578063bea140b31461012457600080fd5b80633dfb88b21461008d57806358bfc379146100b25780635bb93995146100c557806362a361bb146100d8575b600080fd5b6100a061009b3660046103a8565b610137565b60405190815260200160405180910390f35b6100a06100c0366004610426565b6101b8565b6100a06100d33660046104cc565b610252565b6100a06100e63660046104ee565b610277565b6100a06100f9366004610549565b6102b1565b6100a061010c3660046104cc565b6102eb565b6100a061011f366004610549565b6102fe565b6100a06101323660046105a2565b610309565b60405163248f667760e01b815260009073__$ce9c2c925f157047e54fa833ec4e61409f$__9063248f6677906101719085906004016105fb565b602060405180830381865af415801561018e573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906101b2919061062c565b92915050565b60007f30644e72e131a029b85045b68181585d2833e84879b9709143e1f593f00000016002836040516020016101ee9190610645565b60408051601f19818403018152908290526102089161067b565b602060405180830381855afa158015610225573d6000803e3d6000fd5b5050506040513d601f19601f82011682018060405250810190610248919061062c565b6101b291906106aa565b600061025c610343565b8381526020810183905261026f81610277565b949350505050565b6040516314d2f97b60e11b815260009073__$6574937f64fc1d7710ec0e28b7a36713bb$__906329a5f2f6906101719085906004016106cc565b604051630926f44b60e31b815260009073__$20527677031d76601747626a9845039fe4$__90634937a258906101719085906004016106f4565b60006102f78383610252565b9392505050565b60006101b2826102b1565b6040516304b98e1d60e31b815260009073__$dc01a9744591ab014bc46a3b7671cdaefb$__906325cc70e89061017190859060040161071c565b60405180604001604052806002906020820280368337509192915050565b634e487b7160e01b600052604160045260246000fd5b604051601f8201601f1916810167ffffffffffffffff811182821017156103a0576103a0610361565b604052919050565b6000608082840312156103ba57600080fd5b82601f8301126103c957600080fd5b6040516080810181811067ffffffffffffffff821117156103ec576103ec610361565b60405280608084018581111561040157600080fd5b845b8181101561041b578035835260209283019201610403565b509195945050505050565b6000602080838503121561043957600080fd5b823567ffffffffffffffff8082111561045157600080fd5b818501915085601f83011261046557600080fd5b81358181111561047757610477610361565b8060051b9150610488848301610377565b81815291830184019184810190888411156104a257600080fd5b938501935b838510156104c0578435825293850193908501906104a7565b98975050505050505050565b600080604083850312156104df57600080fd5b50508035926020909101359150565b60006040828403121561050057600080fd5b82601f83011261050f57600080fd5b6040516040810181811067ffffffffffffffff8211171561053257610532610361565b806040525080604084018581111561040157600080fd5b600060a0828403121561055b57600080fd5b82601f83011261056a57600080fd5b60405160a0810181811067ffffffffffffffff8211171561058d5761058d610361565b6040528060a084018581111561040157600080fd5b6000606082840312156105b457600080fd5b82601f8301126105c357600080fd5b6040516060810181811067ffffffffffffffff821117156105e6576105e6610361565b60405280606084018581111561040157600080fd5b60808101818360005b6004811015610623578151835260209283019290910190600101610604565b50505092915050565b60006020828403121561063e57600080fd5b5051919050565b815160009082906020808601845b8381101561066f57815185529382019390820190600101610653565b50929695505050505050565b6000825160005b8181101561069c5760208186018101518583015201610682565b506000920191825250919050565b6000826106c757634e487b7160e01b600052601260045260246000fd5b500690565b60408101818360005b60028110156106235781518352602092830192909101906001016106d5565b60a08101818360005b60058110156106235781518352602092830192909101906001016106fd565b60608101818360005b600381101561062357815183526020928301929091019060010161072556fea2646970667358221220d57bcc4941a4c54499449a58a63e001d8bd38573d5dd17483a97c4fc23ef366c64736f6c63430008140033";
    static readonly abi: readonly [{
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
            readonly internalType: "uint256[5]";
            readonly name: "array";
            readonly type: "uint256[5]";
        }];
        readonly name: "hash5Benchmark";
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
            readonly internalType: "uint256";
            readonly name: "_left";
            readonly type: "uint256";
        }, {
            readonly internalType: "uint256";
            readonly name: "_right";
            readonly type: "uint256";
        }];
        readonly name: "hashLeftRightBenchmark";
        readonly outputs: readonly [{
            readonly internalType: "uint256";
            readonly name: "result";
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
    static createInterface(): HasherBenchmarksInterface;
    static connect(address: string, runner?: ContractRunner | null): HasherBenchmarks;
}
export interface HasherBenchmarksLibraryAddresses {
    ["contracts/crypto/PoseidonT5.sol:PoseidonT5"]: string;
    ["contracts/crypto/PoseidonT3.sol:PoseidonT3"]: string;
    ["contracts/crypto/PoseidonT6.sol:PoseidonT6"]: string;
    ["contracts/crypto/PoseidonT4.sol:PoseidonT4"]: string;
}
export {};
//# sourceMappingURL=HasherBenchmarks__factory.d.ts.map