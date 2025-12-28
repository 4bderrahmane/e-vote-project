import type { BaseContract, BigNumberish, BytesLike, FunctionFragment, Result, Interface, EventFragment, AddressLike, ContractRunner, ContractMethod, Listener } from "ethers";
import type { TypedContractEvent, TypedDeferredTopicFilter, TypedEventLog, TypedLogDescription, TypedListener, TypedContractMethod } from "../../common";
export interface SemaphoreGatekeeperInterface extends Interface {
    getFunction(nameOrSignature: "getTrait" | "groupId" | "maci" | "owner" | "register" | "registeredIdentities" | "renounceOwnership" | "semaphoreContract" | "setMaciInstance" | "transferOwnership"): FunctionFragment;
    getEvent(nameOrSignatureOrTopic: "OwnershipTransferred"): EventFragment;
    encodeFunctionData(functionFragment: "getTrait", values?: undefined): string;
    encodeFunctionData(functionFragment: "groupId", values?: undefined): string;
    encodeFunctionData(functionFragment: "maci", values?: undefined): string;
    encodeFunctionData(functionFragment: "owner", values?: undefined): string;
    encodeFunctionData(functionFragment: "register", values: [AddressLike, BytesLike]): string;
    encodeFunctionData(functionFragment: "registeredIdentities", values: [BigNumberish]): string;
    encodeFunctionData(functionFragment: "renounceOwnership", values?: undefined): string;
    encodeFunctionData(functionFragment: "semaphoreContract", values?: undefined): string;
    encodeFunctionData(functionFragment: "setMaciInstance", values: [AddressLike]): string;
    encodeFunctionData(functionFragment: "transferOwnership", values: [AddressLike]): string;
    decodeFunctionResult(functionFragment: "getTrait", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "groupId", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "maci", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "owner", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "register", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "registeredIdentities", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "renounceOwnership", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "semaphoreContract", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "setMaciInstance", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "transferOwnership", data: BytesLike): Result;
}
export declare namespace OwnershipTransferredEvent {
    type InputTuple = [previousOwner: AddressLike, newOwner: AddressLike];
    type OutputTuple = [previousOwner: string, newOwner: string];
    interface OutputObject {
        previousOwner: string;
        newOwner: string;
    }
    type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
    type Filter = TypedDeferredTopicFilter<Event>;
    type Log = TypedEventLog<Event>;
    type LogDescription = TypedLogDescription<Event>;
}
export interface SemaphoreGatekeeper extends BaseContract {
    connect(runner?: ContractRunner | null): SemaphoreGatekeeper;
    waitForDeployment(): Promise<this>;
    interface: SemaphoreGatekeeperInterface;
    queryFilter<TCEvent extends TypedContractEvent>(event: TCEvent, fromBlockOrBlockhash?: string | number | undefined, toBlock?: string | number | undefined): Promise<Array<TypedEventLog<TCEvent>>>;
    queryFilter<TCEvent extends TypedContractEvent>(filter: TypedDeferredTopicFilter<TCEvent>, fromBlockOrBlockhash?: string | number | undefined, toBlock?: string | number | undefined): Promise<Array<TypedEventLog<TCEvent>>>;
    on<TCEvent extends TypedContractEvent>(event: TCEvent, listener: TypedListener<TCEvent>): Promise<this>;
    on<TCEvent extends TypedContractEvent>(filter: TypedDeferredTopicFilter<TCEvent>, listener: TypedListener<TCEvent>): Promise<this>;
    once<TCEvent extends TypedContractEvent>(event: TCEvent, listener: TypedListener<TCEvent>): Promise<this>;
    once<TCEvent extends TypedContractEvent>(filter: TypedDeferredTopicFilter<TCEvent>, listener: TypedListener<TCEvent>): Promise<this>;
    listeners<TCEvent extends TypedContractEvent>(event: TCEvent): Promise<Array<TypedListener<TCEvent>>>;
    listeners(eventName?: string): Promise<Array<Listener>>;
    removeAllListeners<TCEvent extends TypedContractEvent>(event?: TCEvent): Promise<this>;
    getTrait: TypedContractMethod<[], [string], "view">;
    groupId: TypedContractMethod<[], [bigint], "view">;
    maci: TypedContractMethod<[], [string], "view">;
    owner: TypedContractMethod<[], [string], "view">;
    register: TypedContractMethod<[
        arg0: AddressLike,
        _data: BytesLike
    ], [
        void
    ], "nonpayable">;
    registeredIdentities: TypedContractMethod<[
        arg0: BigNumberish
    ], [
        boolean
    ], "view">;
    renounceOwnership: TypedContractMethod<[], [void], "nonpayable">;
    semaphoreContract: TypedContractMethod<[], [string], "view">;
    setMaciInstance: TypedContractMethod<[
        _maci: AddressLike
    ], [
        void
    ], "nonpayable">;
    transferOwnership: TypedContractMethod<[
        newOwner: AddressLike
    ], [
        void
    ], "nonpayable">;
    getFunction<T extends ContractMethod = ContractMethod>(key: string | FunctionFragment): T;
    getFunction(nameOrSignature: "getTrait"): TypedContractMethod<[], [string], "view">;
    getFunction(nameOrSignature: "groupId"): TypedContractMethod<[], [bigint], "view">;
    getFunction(nameOrSignature: "maci"): TypedContractMethod<[], [string], "view">;
    getFunction(nameOrSignature: "owner"): TypedContractMethod<[], [string], "view">;
    getFunction(nameOrSignature: "register"): TypedContractMethod<[
        arg0: AddressLike,
        _data: BytesLike
    ], [
        void
    ], "nonpayable">;
    getFunction(nameOrSignature: "registeredIdentities"): TypedContractMethod<[arg0: BigNumberish], [boolean], "view">;
    getFunction(nameOrSignature: "renounceOwnership"): TypedContractMethod<[], [void], "nonpayable">;
    getFunction(nameOrSignature: "semaphoreContract"): TypedContractMethod<[], [string], "view">;
    getFunction(nameOrSignature: "setMaciInstance"): TypedContractMethod<[_maci: AddressLike], [void], "nonpayable">;
    getFunction(nameOrSignature: "transferOwnership"): TypedContractMethod<[newOwner: AddressLike], [void], "nonpayable">;
    getEvent(key: "OwnershipTransferred"): TypedContractEvent<OwnershipTransferredEvent.InputTuple, OwnershipTransferredEvent.OutputTuple, OwnershipTransferredEvent.OutputObject>;
    filters: {
        "OwnershipTransferred(address,address)": TypedContractEvent<OwnershipTransferredEvent.InputTuple, OwnershipTransferredEvent.OutputTuple, OwnershipTransferredEvent.OutputObject>;
        OwnershipTransferred: TypedContractEvent<OwnershipTransferredEvent.InputTuple, OwnershipTransferredEvent.OutputTuple, OwnershipTransferredEvent.OutputObject>;
    };
}
//# sourceMappingURL=SemaphoreGatekeeper.d.ts.map