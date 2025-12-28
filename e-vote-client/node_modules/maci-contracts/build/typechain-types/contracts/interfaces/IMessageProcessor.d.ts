import type { BaseContract, BigNumberish, BytesLike, FunctionFragment, Result, Interface, ContractRunner, ContractMethod, Listener } from "ethers";
import type { TypedContractEvent, TypedDeferredTopicFilter, TypedEventLog, TypedListener, TypedContractMethod } from "../../common";
export interface IMessageProcessorInterface extends Interface {
    getFunction(nameOrSignature: "getPublicCircuitInputs" | "processingComplete" | "sbCommitment"): FunctionFragment;
    encodeFunctionData(functionFragment: "getPublicCircuitInputs", values: [BigNumberish, BigNumberish]): string;
    encodeFunctionData(functionFragment: "processingComplete", values?: undefined): string;
    encodeFunctionData(functionFragment: "sbCommitment", values?: undefined): string;
    decodeFunctionResult(functionFragment: "getPublicCircuitInputs", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "processingComplete", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "sbCommitment", data: BytesLike): Result;
}
export interface IMessageProcessor extends BaseContract {
    connect(runner?: ContractRunner | null): IMessageProcessor;
    waitForDeployment(): Promise<this>;
    interface: IMessageProcessorInterface;
    queryFilter<TCEvent extends TypedContractEvent>(event: TCEvent, fromBlockOrBlockhash?: string | number | undefined, toBlock?: string | number | undefined): Promise<Array<TypedEventLog<TCEvent>>>;
    queryFilter<TCEvent extends TypedContractEvent>(filter: TypedDeferredTopicFilter<TCEvent>, fromBlockOrBlockhash?: string | number | undefined, toBlock?: string | number | undefined): Promise<Array<TypedEventLog<TCEvent>>>;
    on<TCEvent extends TypedContractEvent>(event: TCEvent, listener: TypedListener<TCEvent>): Promise<this>;
    on<TCEvent extends TypedContractEvent>(filter: TypedDeferredTopicFilter<TCEvent>, listener: TypedListener<TCEvent>): Promise<this>;
    once<TCEvent extends TypedContractEvent>(event: TCEvent, listener: TypedListener<TCEvent>): Promise<this>;
    once<TCEvent extends TypedContractEvent>(filter: TypedDeferredTopicFilter<TCEvent>, listener: TypedListener<TCEvent>): Promise<this>;
    listeners<TCEvent extends TypedContractEvent>(event: TCEvent): Promise<Array<TypedListener<TCEvent>>>;
    listeners(eventName?: string): Promise<Array<Listener>>;
    removeAllListeners<TCEvent extends TypedContractEvent>(event?: TCEvent): Promise<this>;
    getPublicCircuitInputs: TypedContractMethod<[
        _currentMessageBatchIndex: BigNumberish,
        _newSbCommitment: BigNumberish
    ], [
        bigint[]
    ], "view">;
    processingComplete: TypedContractMethod<[], [boolean], "view">;
    sbCommitment: TypedContractMethod<[], [bigint], "view">;
    getFunction<T extends ContractMethod = ContractMethod>(key: string | FunctionFragment): T;
    getFunction(nameOrSignature: "getPublicCircuitInputs"): TypedContractMethod<[
        _currentMessageBatchIndex: BigNumberish,
        _newSbCommitment: BigNumberish
    ], [
        bigint[]
    ], "view">;
    getFunction(nameOrSignature: "processingComplete"): TypedContractMethod<[], [boolean], "view">;
    getFunction(nameOrSignature: "sbCommitment"): TypedContractMethod<[], [bigint], "view">;
    filters: {};
}
//# sourceMappingURL=IMessageProcessor.d.ts.map