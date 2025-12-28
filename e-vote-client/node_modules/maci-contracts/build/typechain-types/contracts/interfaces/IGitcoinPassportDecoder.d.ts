import type { BaseContract, BigNumberish, BytesLike, FunctionFragment, Result, Interface, AddressLike, ContractRunner, ContractMethod, Listener } from "ethers";
import type { TypedContractEvent, TypedDeferredTopicFilter, TypedEventLog, TypedListener, TypedContractMethod } from "../../common";
export type CredentialStruct = {
    provider: string;
    hash: BytesLike;
    time: BigNumberish;
    expirationTime: BigNumberish;
};
export type CredentialStructOutput = [
    provider: string,
    hash: string,
    time: bigint,
    expirationTime: bigint
] & {
    provider: string;
    hash: string;
    time: bigint;
    expirationTime: bigint;
};
export interface IGitcoinPassportDecoderInterface extends Interface {
    getFunction(nameOrSignature: "getPassport" | "getScore" | "isHuman"): FunctionFragment;
    encodeFunctionData(functionFragment: "getPassport", values: [AddressLike]): string;
    encodeFunctionData(functionFragment: "getScore", values: [AddressLike]): string;
    encodeFunctionData(functionFragment: "isHuman", values: [AddressLike]): string;
    decodeFunctionResult(functionFragment: "getPassport", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "getScore", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "isHuman", data: BytesLike): Result;
}
export interface IGitcoinPassportDecoder extends BaseContract {
    connect(runner?: ContractRunner | null): IGitcoinPassportDecoder;
    waitForDeployment(): Promise<this>;
    interface: IGitcoinPassportDecoderInterface;
    queryFilter<TCEvent extends TypedContractEvent>(event: TCEvent, fromBlockOrBlockhash?: string | number | undefined, toBlock?: string | number | undefined): Promise<Array<TypedEventLog<TCEvent>>>;
    queryFilter<TCEvent extends TypedContractEvent>(filter: TypedDeferredTopicFilter<TCEvent>, fromBlockOrBlockhash?: string | number | undefined, toBlock?: string | number | undefined): Promise<Array<TypedEventLog<TCEvent>>>;
    on<TCEvent extends TypedContractEvent>(event: TCEvent, listener: TypedListener<TCEvent>): Promise<this>;
    on<TCEvent extends TypedContractEvent>(filter: TypedDeferredTopicFilter<TCEvent>, listener: TypedListener<TCEvent>): Promise<this>;
    once<TCEvent extends TypedContractEvent>(event: TCEvent, listener: TypedListener<TCEvent>): Promise<this>;
    once<TCEvent extends TypedContractEvent>(filter: TypedDeferredTopicFilter<TCEvent>, listener: TypedListener<TCEvent>): Promise<this>;
    listeners<TCEvent extends TypedContractEvent>(event: TCEvent): Promise<Array<TypedListener<TCEvent>>>;
    listeners(eventName?: string): Promise<Array<Listener>>;
    removeAllListeners<TCEvent extends TypedContractEvent>(event?: TCEvent): Promise<this>;
    getPassport: TypedContractMethod<[
        user: AddressLike
    ], [
        CredentialStructOutput[]
    ], "nonpayable">;
    getScore: TypedContractMethod<[user: AddressLike], [bigint], "view">;
    isHuman: TypedContractMethod<[user: AddressLike], [boolean], "view">;
    getFunction<T extends ContractMethod = ContractMethod>(key: string | FunctionFragment): T;
    getFunction(nameOrSignature: "getPassport"): TypedContractMethod<[
        user: AddressLike
    ], [
        CredentialStructOutput[]
    ], "nonpayable">;
    getFunction(nameOrSignature: "getScore"): TypedContractMethod<[user: AddressLike], [bigint], "view">;
    getFunction(nameOrSignature: "isHuman"): TypedContractMethod<[user: AddressLike], [boolean], "view">;
    filters: {};
}
//# sourceMappingURL=IGitcoinPassportDecoder.d.ts.map