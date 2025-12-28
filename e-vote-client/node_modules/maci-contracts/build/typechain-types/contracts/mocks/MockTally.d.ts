import type { BaseContract, BigNumberish, BytesLike, FunctionFragment, Result, Interface, ContractRunner, ContractMethod, Listener } from "ethers";
import type { TypedContractEvent, TypedDeferredTopicFilter, TypedEventLog, TypedListener, TypedContractMethod } from "../../common";
export interface MockTallyInterface extends Interface {
    getFunction(nameOrSignature: "flipReturnValue" | "returnValue" | "verifyPerVOSpentVoiceCredits" | "verifySpentVoiceCredits"): FunctionFragment;
    encodeFunctionData(functionFragment: "flipReturnValue", values?: undefined): string;
    encodeFunctionData(functionFragment: "returnValue", values?: undefined): string;
    encodeFunctionData(functionFragment: "verifyPerVOSpentVoiceCredits", values: [
        BigNumberish,
        BigNumberish,
        BigNumberish[][],
        BigNumberish,
        BigNumberish,
        BigNumberish,
        BigNumberish
    ]): string;
    encodeFunctionData(functionFragment: "verifySpentVoiceCredits", values: [BigNumberish, BigNumberish, BigNumberish, BigNumberish]): string;
    decodeFunctionResult(functionFragment: "flipReturnValue", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "returnValue", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "verifyPerVOSpentVoiceCredits", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "verifySpentVoiceCredits", data: BytesLike): Result;
}
export interface MockTally extends BaseContract {
    connect(runner?: ContractRunner | null): MockTally;
    waitForDeployment(): Promise<this>;
    interface: MockTallyInterface;
    queryFilter<TCEvent extends TypedContractEvent>(event: TCEvent, fromBlockOrBlockhash?: string | number | undefined, toBlock?: string | number | undefined): Promise<Array<TypedEventLog<TCEvent>>>;
    queryFilter<TCEvent extends TypedContractEvent>(filter: TypedDeferredTopicFilter<TCEvent>, fromBlockOrBlockhash?: string | number | undefined, toBlock?: string | number | undefined): Promise<Array<TypedEventLog<TCEvent>>>;
    on<TCEvent extends TypedContractEvent>(event: TCEvent, listener: TypedListener<TCEvent>): Promise<this>;
    on<TCEvent extends TypedContractEvent>(filter: TypedDeferredTopicFilter<TCEvent>, listener: TypedListener<TCEvent>): Promise<this>;
    once<TCEvent extends TypedContractEvent>(event: TCEvent, listener: TypedListener<TCEvent>): Promise<this>;
    once<TCEvent extends TypedContractEvent>(filter: TypedDeferredTopicFilter<TCEvent>, listener: TypedListener<TCEvent>): Promise<this>;
    listeners<TCEvent extends TypedContractEvent>(event: TCEvent): Promise<Array<TypedListener<TCEvent>>>;
    listeners(eventName?: string): Promise<Array<Listener>>;
    removeAllListeners<TCEvent extends TypedContractEvent>(event?: TCEvent): Promise<this>;
    flipReturnValue: TypedContractMethod<[], [void], "nonpayable">;
    returnValue: TypedContractMethod<[], [boolean], "view">;
    verifyPerVOSpentVoiceCredits: TypedContractMethod<[
        _voteOptionIndex: BigNumberish,
        _spent: BigNumberish,
        _spentProof: BigNumberish[][],
        _spentSalt: BigNumberish,
        _voteOptionTreeDepth: BigNumberish,
        _spentVoiceCreditsHash: BigNumberish,
        _resultCommitment: BigNumberish
    ], [
        boolean
    ], "view">;
    verifySpentVoiceCredits: TypedContractMethod<[
        _totalSpent: BigNumberish,
        _totalSpentSalt: BigNumberish,
        _resultCommitment: BigNumberish,
        _perVOSpentVoiceCreditsHash: BigNumberish
    ], [
        boolean
    ], "view">;
    getFunction<T extends ContractMethod = ContractMethod>(key: string | FunctionFragment): T;
    getFunction(nameOrSignature: "flipReturnValue"): TypedContractMethod<[], [void], "nonpayable">;
    getFunction(nameOrSignature: "returnValue"): TypedContractMethod<[], [boolean], "view">;
    getFunction(nameOrSignature: "verifyPerVOSpentVoiceCredits"): TypedContractMethod<[
        _voteOptionIndex: BigNumberish,
        _spent: BigNumberish,
        _spentProof: BigNumberish[][],
        _spentSalt: BigNumberish,
        _voteOptionTreeDepth: BigNumberish,
        _spentVoiceCreditsHash: BigNumberish,
        _resultCommitment: BigNumberish
    ], [
        boolean
    ], "view">;
    getFunction(nameOrSignature: "verifySpentVoiceCredits"): TypedContractMethod<[
        _totalSpent: BigNumberish,
        _totalSpentSalt: BigNumberish,
        _resultCommitment: BigNumberish,
        _perVOSpentVoiceCreditsHash: BigNumberish
    ], [
        boolean
    ], "view">;
    filters: {};
}
//# sourceMappingURL=MockTally.d.ts.map