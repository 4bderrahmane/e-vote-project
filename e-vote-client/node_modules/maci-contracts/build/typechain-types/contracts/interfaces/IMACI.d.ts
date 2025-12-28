import type { BaseContract, BytesLike, FunctionFragment, Result, Interface, ContractRunner, ContractMethod, Listener } from "ethers";
import type { TypedContractEvent, TypedDeferredTopicFilter, TypedEventLog, TypedListener, TypedContractMethod } from "../../common";
export interface IMACIInterface extends Interface {
    getFunction(nameOrSignature: "getStateTreeRoot" | "numSignUps" | "stateTreeDepth"): FunctionFragment;
    encodeFunctionData(functionFragment: "getStateTreeRoot", values?: undefined): string;
    encodeFunctionData(functionFragment: "numSignUps", values?: undefined): string;
    encodeFunctionData(functionFragment: "stateTreeDepth", values?: undefined): string;
    decodeFunctionResult(functionFragment: "getStateTreeRoot", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "numSignUps", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "stateTreeDepth", data: BytesLike): Result;
}
export interface IMACI extends BaseContract {
    connect(runner?: ContractRunner | null): IMACI;
    waitForDeployment(): Promise<this>;
    interface: IMACIInterface;
    queryFilter<TCEvent extends TypedContractEvent>(event: TCEvent, fromBlockOrBlockhash?: string | number | undefined, toBlock?: string | number | undefined): Promise<Array<TypedEventLog<TCEvent>>>;
    queryFilter<TCEvent extends TypedContractEvent>(filter: TypedDeferredTopicFilter<TCEvent>, fromBlockOrBlockhash?: string | number | undefined, toBlock?: string | number | undefined): Promise<Array<TypedEventLog<TCEvent>>>;
    on<TCEvent extends TypedContractEvent>(event: TCEvent, listener: TypedListener<TCEvent>): Promise<this>;
    on<TCEvent extends TypedContractEvent>(filter: TypedDeferredTopicFilter<TCEvent>, listener: TypedListener<TCEvent>): Promise<this>;
    once<TCEvent extends TypedContractEvent>(event: TCEvent, listener: TypedListener<TCEvent>): Promise<this>;
    once<TCEvent extends TypedContractEvent>(filter: TypedDeferredTopicFilter<TCEvent>, listener: TypedListener<TCEvent>): Promise<this>;
    listeners<TCEvent extends TypedContractEvent>(event: TCEvent): Promise<Array<TypedListener<TCEvent>>>;
    listeners(eventName?: string): Promise<Array<Listener>>;
    removeAllListeners<TCEvent extends TypedContractEvent>(event?: TCEvent): Promise<this>;
    getStateTreeRoot: TypedContractMethod<[], [bigint], "view">;
    numSignUps: TypedContractMethod<[], [bigint], "view">;
    stateTreeDepth: TypedContractMethod<[], [bigint], "view">;
    getFunction<T extends ContractMethod = ContractMethod>(key: string | FunctionFragment): T;
    getFunction(nameOrSignature: "getStateTreeRoot"): TypedContractMethod<[], [bigint], "view">;
    getFunction(nameOrSignature: "numSignUps"): TypedContractMethod<[], [bigint], "view">;
    getFunction(nameOrSignature: "stateTreeDepth"): TypedContractMethod<[], [bigint], "view">;
    filters: {};
}
//# sourceMappingURL=IMACI.d.ts.map