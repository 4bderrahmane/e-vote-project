import type { BaseContract, BigNumberish, BytesLike, FunctionFragment, Result, Interface, AddressLike, ContractRunner, ContractMethod, Listener } from "ethers";
import type { TypedContractEvent, TypedDeferredTopicFilter, TypedEventLog, TypedListener, TypedContractMethod } from "../../common";
export interface MockHatsProtocolInterface extends Interface {
    getFunction(nameOrSignature: "isWearerOfHat"): FunctionFragment;
    encodeFunctionData(functionFragment: "isWearerOfHat", values: [AddressLike, BigNumberish]): string;
    decodeFunctionResult(functionFragment: "isWearerOfHat", data: BytesLike): Result;
}
export interface MockHatsProtocol extends BaseContract {
    connect(runner?: ContractRunner | null): MockHatsProtocol;
    waitForDeployment(): Promise<this>;
    interface: MockHatsProtocolInterface;
    queryFilter<TCEvent extends TypedContractEvent>(event: TCEvent, fromBlockOrBlockhash?: string | number | undefined, toBlock?: string | number | undefined): Promise<Array<TypedEventLog<TCEvent>>>;
    queryFilter<TCEvent extends TypedContractEvent>(filter: TypedDeferredTopicFilter<TCEvent>, fromBlockOrBlockhash?: string | number | undefined, toBlock?: string | number | undefined): Promise<Array<TypedEventLog<TCEvent>>>;
    on<TCEvent extends TypedContractEvent>(event: TCEvent, listener: TypedListener<TCEvent>): Promise<this>;
    on<TCEvent extends TypedContractEvent>(filter: TypedDeferredTopicFilter<TCEvent>, listener: TypedListener<TCEvent>): Promise<this>;
    once<TCEvent extends TypedContractEvent>(event: TCEvent, listener: TypedListener<TCEvent>): Promise<this>;
    once<TCEvent extends TypedContractEvent>(filter: TypedDeferredTopicFilter<TCEvent>, listener: TypedListener<TCEvent>): Promise<this>;
    listeners<TCEvent extends TypedContractEvent>(event: TCEvent): Promise<Array<TypedListener<TCEvent>>>;
    listeners(eventName?: string): Promise<Array<Listener>>;
    removeAllListeners<TCEvent extends TypedContractEvent>(event?: TCEvent): Promise<this>;
    isWearerOfHat: TypedContractMethod<[
        account: AddressLike,
        hat: BigNumberish
    ], [
        boolean
    ], "view">;
    getFunction<T extends ContractMethod = ContractMethod>(key: string | FunctionFragment): T;
    getFunction(nameOrSignature: "isWearerOfHat"): TypedContractMethod<[
        account: AddressLike,
        hat: BigNumberish
    ], [
        boolean
    ], "view">;
    filters: {};
}
//# sourceMappingURL=MockHatsProtocol.d.ts.map