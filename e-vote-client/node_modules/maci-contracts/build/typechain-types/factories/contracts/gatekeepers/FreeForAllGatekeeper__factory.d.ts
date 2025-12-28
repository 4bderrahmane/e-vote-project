import { ContractFactory, ContractTransactionResponse } from "ethers";
import type { Signer, ContractDeployTransaction, ContractRunner } from "ethers";
import type { PayableOverrides } from "../../../common";
import type { FreeForAllGatekeeper, FreeForAllGatekeeperInterface } from "../../../contracts/gatekeepers/FreeForAllGatekeeper";
type FreeForAllGatekeeperConstructorParams = [signer?: Signer] | ConstructorParameters<typeof ContractFactory>;
export declare class FreeForAllGatekeeper__factory extends ContractFactory {
    constructor(...args: FreeForAllGatekeeperConstructorParams);
    getDeployTransaction(overrides?: PayableOverrides & {
        from?: string;
    }): Promise<ContractDeployTransaction>;
    deploy(overrides?: PayableOverrides & {
        from?: string;
    }): Promise<FreeForAllGatekeeper & {
        deploymentTransaction(): ContractTransactionResponse;
    }>;
    connect(runner: ContractRunner | null): FreeForAllGatekeeper__factory;
    static readonly bytecode = "0x608060405261023a806100136000396000f3fe608060405234801561001057600080fd5b50600436106100415760003560e01c806313e65cf31461004657806324b8fbf614610059578063cea9a2631461006b575b600080fd5b6100576100543660046100bc565b50565b005b6100576100673660046100f4565b5050565b604080518082018252600a815269119c9959519bdc905b1b60b21b6020820152905161009791906101b6565b60405180910390f35b80356001600160a01b03811681146100b757600080fd5b919050565b6000602082840312156100ce57600080fd5b6100d7826100a0565b9392505050565b634e487b7160e01b600052604160045260246000fd5b6000806040838503121561010757600080fd5b610110836100a0565b9150602083013567ffffffffffffffff8082111561012d57600080fd5b818501915085601f83011261014157600080fd5b813581811115610153576101536100de565b604051601f8201601f19908116603f0116810190838211818310171561017b5761017b6100de565b8160405282815288602084870101111561019457600080fd5b8260208601602083013760006020848301015280955050505050509250929050565b600060208083528351808285015260005b818110156101e3578581018301518582016040015282016101c7565b506000604082860101526040601f19601f830116850101925050509291505056fea26469706673582212209bd1c5e869bfc84e59a119a4ed6f7d56698f61392e93e094e56c724cfe64ae1d64736f6c63430008140033";
    static readonly abi: readonly [{
        readonly inputs: readonly [];
        readonly stateMutability: "payable";
        readonly type: "constructor";
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
        readonly inputs: readonly [{
            readonly internalType: "address";
            readonly name: "_address";
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
    static createInterface(): FreeForAllGatekeeperInterface;
    static connect(address: string, runner?: ContractRunner | null): FreeForAllGatekeeper;
}
export {};
//# sourceMappingURL=FreeForAllGatekeeper__factory.d.ts.map