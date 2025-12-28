import type { BaseContract, BytesLike, FunctionFragment, Result, Interface, EventFragment, AddressLike, ContractRunner, ContractMethod, Listener } from "ethers";
import type { TypedContractEvent, TypedDeferredTopicFilter, TypedEventLog, TypedLogDescription, TypedListener, TypedContractMethod } from "../../common";
export interface GitcoinPassportGatekeeperInterface extends Interface {
    getFunction(nameOrSignature: "FACTOR" | "getTrait" | "maci" | "owner" | "passportDecoder" | "register" | "registeredUsers" | "renounceOwnership" | "setMaciInstance" | "thresholdScore" | "transferOwnership"): FunctionFragment;
    getEvent(nameOrSignatureOrTopic: "OwnershipTransferred"): EventFragment;
    encodeFunctionData(functionFragment: "FACTOR", values?: undefined): string;
    encodeFunctionData(functionFragment: "getTrait", values?: undefined): string;
    encodeFunctionData(functionFragment: "maci", values?: undefined): string;
    encodeFunctionData(functionFragment: "owner", values?: undefined): string;
    encodeFunctionData(functionFragment: "passportDecoder", values?: undefined): string;
    encodeFunctionData(functionFragment: "register", values: [AddressLike, BytesLike]): string;
    encodeFunctionData(functionFragment: "registeredUsers", values: [AddressLike]): string;
    encodeFunctionData(functionFragment: "renounceOwnership", values?: undefined): string;
    encodeFunctionData(functionFragment: "setMaciInstance", values: [AddressLike]): string;
    encodeFunctionData(functionFragment: "thresholdScore", values?: undefined): string;
    encodeFunctionData(functionFragment: "transferOwnership", values: [AddressLike]): string;
    decodeFunctionResult(functionFragment: "FACTOR", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "getTrait", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "maci", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "owner", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "passportDecoder", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "register", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "registeredUsers", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "renounceOwnership", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "setMaciInstance", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "thresholdScore", data: BytesLike): Result;
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
export interface GitcoinPassportGatekeeper extends BaseContract {
    connect(runner?: ContractRunner | null): GitcoinPassportGatekeeper;
    waitForDeployment(): Promise<this>;
    interface: GitcoinPassportGatekeeperInterface;
    queryFilter<TCEvent extends TypedContractEvent>(event: TCEvent, fromBlockOrBlockhash?: string | number | undefined, toBlock?: string | number | undefined): Promise<Array<TypedEventLog<TCEvent>>>;
    queryFilter<TCEvent extends TypedContractEvent>(filter: TypedDeferredTopicFilter<TCEvent>, fromBlockOrBlockhash?: string | number | undefined, toBlock?: string | number | undefined): Promise<Array<TypedEventLog<TCEvent>>>;
    on<TCEvent extends TypedContractEvent>(event: TCEvent, listener: TypedListener<TCEvent>): Promise<this>;
    on<TCEvent extends TypedContractEvent>(filter: TypedDeferredTopicFilter<TCEvent>, listener: TypedListener<TCEvent>): Promise<this>;
    once<TCEvent extends TypedContractEvent>(event: TCEvent, listener: TypedListener<TCEvent>): Promise<this>;
    once<TCEvent extends TypedContractEvent>(filter: TypedDeferredTopicFilter<TCEvent>, listener: TypedListener<TCEvent>): Promise<this>;
    listeners<TCEvent extends TypedContractEvent>(event: TCEvent): Promise<Array<TypedListener<TCEvent>>>;
    listeners(eventName?: string): Promise<Array<Listener>>;
    removeAllListeners<TCEvent extends TypedContractEvent>(event?: TCEvent): Promise<this>;
    FACTOR: TypedContractMethod<[], [bigint], "view">;
    getTrait: TypedContractMethod<[], [string], "view">;
    maci: TypedContractMethod<[], [string], "view">;
    owner: TypedContractMethod<[], [string], "view">;
    passportDecoder: TypedContractMethod<[], [string], "view">;
    register: TypedContractMethod<[
        _user: AddressLike,
        arg1: BytesLike
    ], [
        void
    ], "nonpayable">;
    registeredUsers: TypedContractMethod<[arg0: AddressLike], [boolean], "view">;
    renounceOwnership: TypedContractMethod<[], [void], "nonpayable">;
    setMaciInstance: TypedContractMethod<[
        _maci: AddressLike
    ], [
        void
    ], "nonpayable">;
    thresholdScore: TypedContractMethod<[], [bigint], "view">;
    transferOwnership: TypedContractMethod<[
        newOwner: AddressLike
    ], [
        void
    ], "nonpayable">;
    getFunction<T extends ContractMethod = ContractMethod>(key: string | FunctionFragment): T;
    getFunction(nameOrSignature: "FACTOR"): TypedContractMethod<[], [bigint], "view">;
    getFunction(nameOrSignature: "getTrait"): TypedContractMethod<[], [string], "view">;
    getFunction(nameOrSignature: "maci"): TypedContractMethod<[], [string], "view">;
    getFunction(nameOrSignature: "owner"): TypedContractMethod<[], [string], "view">;
    getFunction(nameOrSignature: "passportDecoder"): TypedContractMethod<[], [string], "view">;
    getFunction(nameOrSignature: "register"): TypedContractMethod<[
        _user: AddressLike,
        arg1: BytesLike
    ], [
        void
    ], "nonpayable">;
    getFunction(nameOrSignature: "registeredUsers"): TypedContractMethod<[arg0: AddressLike], [boolean], "view">;
    getFunction(nameOrSignature: "renounceOwnership"): TypedContractMethod<[], [void], "nonpayable">;
    getFunction(nameOrSignature: "setMaciInstance"): TypedContractMethod<[_maci: AddressLike], [void], "nonpayable">;
    getFunction(nameOrSignature: "thresholdScore"): TypedContractMethod<[], [bigint], "view">;
    getFunction(nameOrSignature: "transferOwnership"): TypedContractMethod<[newOwner: AddressLike], [void], "nonpayable">;
    getEvent(key: "OwnershipTransferred"): TypedContractEvent<OwnershipTransferredEvent.InputTuple, OwnershipTransferredEvent.OutputTuple, OwnershipTransferredEvent.OutputObject>;
    filters: {
        "OwnershipTransferred(address,address)": TypedContractEvent<OwnershipTransferredEvent.InputTuple, OwnershipTransferredEvent.OutputTuple, OwnershipTransferredEvent.OutputObject>;
        OwnershipTransferred: TypedContractEvent<OwnershipTransferredEvent.InputTuple, OwnershipTransferredEvent.OutputTuple, OwnershipTransferredEvent.OutputObject>;
    };
}
//# sourceMappingURL=GitcoinPassportGatekeeper.d.ts.map