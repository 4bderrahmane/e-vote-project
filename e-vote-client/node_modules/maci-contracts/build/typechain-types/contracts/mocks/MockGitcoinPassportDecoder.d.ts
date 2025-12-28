import type { BaseContract, BigNumberish, BytesLike, FunctionFragment, Result, Interface, AddressLike, ContractRunner, ContractMethod, Listener } from "ethers";
import type { TypedContractEvent, TypedDeferredTopicFilter, TypedEventLog, TypedListener, TypedContractMethod } from "../../common";
export interface MockGitcoinPassportDecoderInterface extends Interface {
    getFunction(nameOrSignature: "changeScore" | "getScore" | "score"): FunctionFragment;
    encodeFunctionData(functionFragment: "changeScore", values: [BigNumberish]): string;
    encodeFunctionData(functionFragment: "getScore", values: [AddressLike]): string;
    encodeFunctionData(functionFragment: "score", values?: undefined): string;
    decodeFunctionResult(functionFragment: "changeScore", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "getScore", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "score", data: BytesLike): Result;
}
export interface MockGitcoinPassportDecoder extends BaseContract {
    connect(runner?: ContractRunner | null): MockGitcoinPassportDecoder;
    waitForDeployment(): Promise<this>;
    interface: MockGitcoinPassportDecoderInterface;
    queryFilter<TCEvent extends TypedContractEvent>(event: TCEvent, fromBlockOrBlockhash?: string | number | undefined, toBlock?: string | number | undefined): Promise<Array<TypedEventLog<TCEvent>>>;
    queryFilter<TCEvent extends TypedContractEvent>(filter: TypedDeferredTopicFilter<TCEvent>, fromBlockOrBlockhash?: string | number | undefined, toBlock?: string | number | undefined): Promise<Array<TypedEventLog<TCEvent>>>;
    on<TCEvent extends TypedContractEvent>(event: TCEvent, listener: TypedListener<TCEvent>): Promise<this>;
    on<TCEvent extends TypedContractEvent>(filter: TypedDeferredTopicFilter<TCEvent>, listener: TypedListener<TCEvent>): Promise<this>;
    once<TCEvent extends TypedContractEvent>(event: TCEvent, listener: TypedListener<TCEvent>): Promise<this>;
    once<TCEvent extends TypedContractEvent>(filter: TypedDeferredTopicFilter<TCEvent>, listener: TypedListener<TCEvent>): Promise<this>;
    listeners<TCEvent extends TypedContractEvent>(event: TCEvent): Promise<Array<TypedListener<TCEvent>>>;
    listeners(eventName?: string): Promise<Array<Listener>>;
    removeAllListeners<TCEvent extends TypedContractEvent>(event?: TCEvent): Promise<this>;
    changeScore: TypedContractMethod<[
        newScore: BigNumberish
    ], [
        void
    ], "nonpayable">;
    getScore: TypedContractMethod<[_user: AddressLike], [bigint], "nonpayable">;
    score: TypedContractMethod<[], [bigint], "view">;
    getFunction<T extends ContractMethod = ContractMethod>(key: string | FunctionFragment): T;
    getFunction(nameOrSignature: "changeScore"): TypedContractMethod<[newScore: BigNumberish], [void], "nonpayable">;
    getFunction(nameOrSignature: "getScore"): TypedContractMethod<[_user: AddressLike], [bigint], "nonpayable">;
    getFunction(nameOrSignature: "score"): TypedContractMethod<[], [bigint], "view">;
    filters: {};
}
//# sourceMappingURL=MockGitcoinPassportDecoder.d.ts.map