import type { BaseContract, BigNumberish, BytesLike, FunctionFragment, Result, Interface, AddressLike, ContractRunner, ContractMethod, Listener } from "ethers";
import type { TypedContractEvent, TypedDeferredTopicFilter, TypedEventLog, TypedListener, TypedContractMethod } from "../../common";
export declare namespace IEAS {
    type AttestationStruct = {
        uid: BytesLike;
        schema: BytesLike;
        time: BigNumberish;
        expirationTime: BigNumberish;
        revocationTime: BigNumberish;
        refUID: BytesLike;
        recipient: AddressLike;
        attester: AddressLike;
        revocable: boolean;
        data: BytesLike;
    };
    type AttestationStructOutput = [
        uid: string,
        schema: string,
        time: bigint,
        expirationTime: bigint,
        revocationTime: bigint,
        refUID: string,
        recipient: string,
        attester: string,
        revocable: boolean,
        data: string
    ] & {
        uid: string;
        schema: string;
        time: bigint;
        expirationTime: bigint;
        revocationTime: bigint;
        refUID: string;
        recipient: string;
        attester: string;
        revocable: boolean;
        data: string;
    };
}
export interface MockEASInterface extends Interface {
    getFunction(nameOrSignature: "attester" | "getAttestation" | "recipient" | "schema"): FunctionFragment;
    encodeFunctionData(functionFragment: "attester", values?: undefined): string;
    encodeFunctionData(functionFragment: "getAttestation", values: [BytesLike]): string;
    encodeFunctionData(functionFragment: "recipient", values?: undefined): string;
    encodeFunctionData(functionFragment: "schema", values?: undefined): string;
    decodeFunctionResult(functionFragment: "attester", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "getAttestation", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "recipient", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "schema", data: BytesLike): Result;
}
export interface MockEAS extends BaseContract {
    connect(runner?: ContractRunner | null): MockEAS;
    waitForDeployment(): Promise<this>;
    interface: MockEASInterface;
    queryFilter<TCEvent extends TypedContractEvent>(event: TCEvent, fromBlockOrBlockhash?: string | number | undefined, toBlock?: string | number | undefined): Promise<Array<TypedEventLog<TCEvent>>>;
    queryFilter<TCEvent extends TypedContractEvent>(filter: TypedDeferredTopicFilter<TCEvent>, fromBlockOrBlockhash?: string | number | undefined, toBlock?: string | number | undefined): Promise<Array<TypedEventLog<TCEvent>>>;
    on<TCEvent extends TypedContractEvent>(event: TCEvent, listener: TypedListener<TCEvent>): Promise<this>;
    on<TCEvent extends TypedContractEvent>(filter: TypedDeferredTopicFilter<TCEvent>, listener: TypedListener<TCEvent>): Promise<this>;
    once<TCEvent extends TypedContractEvent>(event: TCEvent, listener: TypedListener<TCEvent>): Promise<this>;
    once<TCEvent extends TypedContractEvent>(filter: TypedDeferredTopicFilter<TCEvent>, listener: TypedListener<TCEvent>): Promise<this>;
    listeners<TCEvent extends TypedContractEvent>(event: TCEvent): Promise<Array<TypedListener<TCEvent>>>;
    listeners(eventName?: string): Promise<Array<Listener>>;
    removeAllListeners<TCEvent extends TypedContractEvent>(event?: TCEvent): Promise<this>;
    attester: TypedContractMethod<[], [string], "view">;
    getAttestation: TypedContractMethod<[
        attestationId: BytesLike
    ], [
        IEAS.AttestationStructOutput
    ], "view">;
    recipient: TypedContractMethod<[], [string], "view">;
    schema: TypedContractMethod<[], [string], "view">;
    getFunction<T extends ContractMethod = ContractMethod>(key: string | FunctionFragment): T;
    getFunction(nameOrSignature: "attester"): TypedContractMethod<[], [string], "view">;
    getFunction(nameOrSignature: "getAttestation"): TypedContractMethod<[
        attestationId: BytesLike
    ], [
        IEAS.AttestationStructOutput
    ], "view">;
    getFunction(nameOrSignature: "recipient"): TypedContractMethod<[], [string], "view">;
    getFunction(nameOrSignature: "schema"): TypedContractMethod<[], [string], "view">;
    filters: {};
}
//# sourceMappingURL=MockEAS.d.ts.map