import type { BaseContract, BytesLike, FunctionFragment, Result, Interface, ContractRunner, ContractMethod, Listener } from "ethers";
import type { TypedContractEvent, TypedDeferredTopicFilter, TypedEventLog, TypedListener, TypedContractMethod } from "../../../common";
export interface CurveBabyJubJubInterface extends Interface {
    getFunction(nameOrSignature: "A" | "D" | "Q"): FunctionFragment;
    encodeFunctionData(functionFragment: "A", values?: undefined): string;
    encodeFunctionData(functionFragment: "D", values?: undefined): string;
    encodeFunctionData(functionFragment: "Q", values?: undefined): string;
    decodeFunctionResult(functionFragment: "A", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "D", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "Q", data: BytesLike): Result;
}
export interface CurveBabyJubJub extends BaseContract {
    connect(runner?: ContractRunner | null): CurveBabyJubJub;
    waitForDeployment(): Promise<this>;
    interface: CurveBabyJubJubInterface;
    queryFilter<TCEvent extends TypedContractEvent>(event: TCEvent, fromBlockOrBlockhash?: string | number | undefined, toBlock?: string | number | undefined): Promise<Array<TypedEventLog<TCEvent>>>;
    queryFilter<TCEvent extends TypedContractEvent>(filter: TypedDeferredTopicFilter<TCEvent>, fromBlockOrBlockhash?: string | number | undefined, toBlock?: string | number | undefined): Promise<Array<TypedEventLog<TCEvent>>>;
    on<TCEvent extends TypedContractEvent>(event: TCEvent, listener: TypedListener<TCEvent>): Promise<this>;
    on<TCEvent extends TypedContractEvent>(filter: TypedDeferredTopicFilter<TCEvent>, listener: TypedListener<TCEvent>): Promise<this>;
    once<TCEvent extends TypedContractEvent>(event: TCEvent, listener: TypedListener<TCEvent>): Promise<this>;
    once<TCEvent extends TypedContractEvent>(filter: TypedDeferredTopicFilter<TCEvent>, listener: TypedListener<TCEvent>): Promise<this>;
    listeners<TCEvent extends TypedContractEvent>(event: TCEvent): Promise<Array<TypedListener<TCEvent>>>;
    listeners(eventName?: string): Promise<Array<Listener>>;
    removeAllListeners<TCEvent extends TypedContractEvent>(event?: TCEvent): Promise<this>;
    A: TypedContractMethod<[], [bigint], "view">;
    D: TypedContractMethod<[], [bigint], "view">;
    Q: TypedContractMethod<[], [bigint], "view">;
    getFunction<T extends ContractMethod = ContractMethod>(key: string | FunctionFragment): T;
    getFunction(nameOrSignature: "A"): TypedContractMethod<[], [bigint], "view">;
    getFunction(nameOrSignature: "D"): TypedContractMethod<[], [bigint], "view">;
    getFunction(nameOrSignature: "Q"): TypedContractMethod<[], [bigint], "view">;
    filters: {};
}
//# sourceMappingURL=CurveBabyJubJub.d.ts.map