import { ContractFactory, ContractTransactionResponse } from "ethers";
import type { Signer, ContractDeployTransaction, ContractRunner } from "ethers";
import type { NonPayableOverrides } from "../../../common";
import type { Hasher, HasherInterface } from "../../../contracts/crypto/Hasher";
type HasherConstructorParams = [linkLibraryAddresses: HasherLibraryAddresses, signer?: Signer] | ConstructorParameters<typeof ContractFactory>;
export declare class Hasher__factory extends ContractFactory {
    constructor(...args: HasherConstructorParams);
    static linkBytecode(linkLibraryAddresses: HasherLibraryAddresses): string;
    getDeployTransaction(overrides?: NonPayableOverrides & {
        from?: string;
    }): Promise<ContractDeployTransaction>;
    deploy(overrides?: NonPayableOverrides & {
        from?: string;
    }): Promise<Hasher & {
        deploymentTransaction(): ContractTransactionResponse;
    }>;
    connect(runner: ContractRunner | null): Hasher__factory;
    static readonly bytecode = "0x608060405234801561001057600080fd5b50610710806100206000396000f3fe608060405234801561001057600080fd5b50600436106100625760003560e01c80633dfb88b21461006757806358bfc3791461008c5780635bb939951461009f57806362a361bb146100b25780639cfced97146100c5578063bea140b3146100d8575b600080fd5b61007a61007536600461033e565b6100eb565b60405190815260200160405180910390f35b61007a61009a3660046103bc565b61016c565b61007a6100ad366004610462565b610206565b61007a6100c0366004610484565b61022b565b61007a6100d33660046104df565b610265565b61007a6100e6366004610538565b61029f565b60405163248f667760e01b815260009073__$ce9c2c925f157047e54fa833ec4e61409f$__9063248f667790610125908590600401610591565b602060405180830381865af4158015610142573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061016691906105c2565b92915050565b60007f30644e72e131a029b85045b68181585d2833e84879b9709143e1f593f00000016002836040516020016101a291906105db565b60408051601f19818403018152908290526101bc91610611565b602060405180830381855afa1580156101d9573d6000803e3d6000fd5b5050506040513d601f19601f820116820180604052508101906101fc91906105c2565b6101669190610640565b60006102106102d9565b838152602081018390526102238161022b565b949350505050565b6040516314d2f97b60e11b815260009073__$6574937f64fc1d7710ec0e28b7a36713bb$__906329a5f2f690610125908590600401610662565b604051630926f44b60e31b815260009073__$20527677031d76601747626a9845039fe4$__90634937a2589061012590859060040161068a565b6040516304b98e1d60e31b815260009073__$dc01a9744591ab014bc46a3b7671cdaefb$__906325cc70e8906101259085906004016106b2565b60405180604001604052806002906020820280368337509192915050565b634e487b7160e01b600052604160045260246000fd5b604051601f8201601f1916810167ffffffffffffffff81118282101715610336576103366102f7565b604052919050565b60006080828403121561035057600080fd5b82601f83011261035f57600080fd5b6040516080810181811067ffffffffffffffff82111715610382576103826102f7565b60405280608084018581111561039757600080fd5b845b818110156103b1578035835260209283019201610399565b509195945050505050565b600060208083850312156103cf57600080fd5b823567ffffffffffffffff808211156103e757600080fd5b818501915085601f8301126103fb57600080fd5b81358181111561040d5761040d6102f7565b8060051b915061041e84830161030d565b818152918301840191848101908884111561043857600080fd5b938501935b838510156104565784358252938501939085019061043d565b98975050505050505050565b6000806040838503121561047557600080fd5b50508035926020909101359150565b60006040828403121561049657600080fd5b82601f8301126104a557600080fd5b6040516040810181811067ffffffffffffffff821117156104c8576104c86102f7565b806040525080604084018581111561039757600080fd5b600060a082840312156104f157600080fd5b82601f83011261050057600080fd5b60405160a0810181811067ffffffffffffffff82111715610523576105236102f7565b6040528060a084018581111561039757600080fd5b60006060828403121561054a57600080fd5b82601f83011261055957600080fd5b6040516060810181811067ffffffffffffffff8211171561057c5761057c6102f7565b60405280606084018581111561039757600080fd5b60808101818360005b60048110156105b957815183526020928301929091019060010161059a565b50505092915050565b6000602082840312156105d457600080fd5b5051919050565b815160009082906020808601845b83811015610605578151855293820193908201906001016105e9565b50929695505050505050565b6000825160005b818110156106325760208186018101518583015201610618565b506000920191825250919050565b60008261065d57634e487b7160e01b600052601260045260246000fd5b500690565b60408101818360005b60028110156105b957815183526020928301929091019060010161066b565b60a08101818360005b60058110156105b9578151835260209283019290910190600101610693565b60608101818360005b60038110156105b95781518352602092830192909101906001016106bb56fea26469706673582212202d93a33405d37c4ff5982ba79129dd6e9cbb3b71c55e5f5f117936fc7a991ea764736f6c63430008140033";
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
    static createInterface(): HasherInterface;
    static connect(address: string, runner?: ContractRunner | null): Hasher;
}
export interface HasherLibraryAddresses {
    ["contracts/crypto/PoseidonT5.sol:PoseidonT5"]: string;
    ["contracts/crypto/PoseidonT3.sol:PoseidonT3"]: string;
    ["contracts/crypto/PoseidonT6.sol:PoseidonT6"]: string;
    ["contracts/crypto/PoseidonT4.sol:PoseidonT4"]: string;
}
export {};
//# sourceMappingURL=Hasher__factory.d.ts.map