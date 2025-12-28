import { ContractFactory, ContractTransactionResponse } from "ethers";
import type { Signer, ContractDeployTransaction, ContractRunner } from "ethers";
import type { NonPayableOverrides } from "../../../common";
import type { CommonUtilities, CommonUtilitiesInterface } from "../../../contracts/utilities/CommonUtilities";
type CommonUtilitiesConstructorParams = [signer?: Signer] | ConstructorParameters<typeof ContractFactory>;
export declare class CommonUtilities__factory extends ContractFactory {
    constructor(...args: CommonUtilitiesConstructorParams);
    getDeployTransaction(overrides?: NonPayableOverrides & {
        from?: string;
    }): Promise<ContractDeployTransaction>;
    deploy(overrides?: NonPayableOverrides & {
        from?: string;
    }): Promise<CommonUtilities & {
        deploymentTransaction(): ContractTransactionResponse;
    }>;
    connect(runner: ContractRunner | null): CommonUtilities__factory;
    static readonly bytecode = "0x6080604052348015600f57600080fd5b50603f80601d6000396000f3fe6080604052600080fdfea26469706673582212202a13aae2d5ec1c8faa90df5edbe5ef4572f4412888802687cf7ef6c9474e305064736f6c63430008140033";
    static readonly abi: readonly [{
        readonly inputs: readonly [];
        readonly name: "VotingPeriodNotPassed";
        readonly type: "error";
    }];
    static createInterface(): CommonUtilitiesInterface;
    static connect(address: string, runner?: ContractRunner | null): CommonUtilities;
}
export {};
//# sourceMappingURL=CommonUtilities__factory.d.ts.map