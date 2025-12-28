import type { BaseContract, BigNumberish, BytesLike, FunctionFragment, Result, Interface, ContractRunner, ContractMethod, Listener } from "ethers";
import type { TypedContractEvent, TypedDeferredTopicFilter, TypedEventLog, TypedListener, TypedContractMethod } from "../../common";
export declare namespace ISemaphore {
    type SemaphoreProofStruct = {
        merkleTreeDepth: BigNumberish;
        merkleTreeRoot: BigNumberish;
        nullifier: BigNumberish;
        message: BigNumberish;
        scope: BigNumberish;
        points: BigNumberish[];
    };
    type SemaphoreProofStructOutput = [
        merkleTreeDepth: bigint,
        merkleTreeRoot: bigint,
        nullifier: bigint,
        message: bigint,
        scope: bigint,
        points: bigint[]
    ] & {
        merkleTreeDepth: bigint;
        merkleTreeRoot: bigint;
        nullifier: bigint;
        message: bigint;
        scope: bigint;
        points: bigint[];
    };
}
export interface MockSemaphoreInterface extends Interface {
    getFunction(nameOrSignature: "flipValid" | "groupId" | "valid" | "verifyProof"): FunctionFragment;
    encodeFunctionData(functionFragment: "flipValid", values?: undefined): string;
    encodeFunctionData(functionFragment: "groupId", values?: undefined): string;
    encodeFunctionData(functionFragment: "valid", values?: undefined): string;
    encodeFunctionData(functionFragment: "verifyProof", values: [BigNumberish, ISemaphore.SemaphoreProofStruct]): string;
    decodeFunctionResult(functionFragment: "flipValid", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "groupId", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "valid", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "verifyProof", data: BytesLike): Result;
}
export interface MockSemaphore extends BaseContract {
    connect(runner?: ContractRunner | null): MockSemaphore;
    waitForDeployment(): Promise<this>;
    interface: MockSemaphoreInterface;
    queryFilter<TCEvent extends TypedContractEvent>(event: TCEvent, fromBlockOrBlockhash?: string | number | undefined, toBlock?: string | number | undefined): Promise<Array<TypedEventLog<TCEvent>>>;
    queryFilter<TCEvent extends TypedContractEvent>(filter: TypedDeferredTopicFilter<TCEvent>, fromBlockOrBlockhash?: string | number | undefined, toBlock?: string | number | undefined): Promise<Array<TypedEventLog<TCEvent>>>;
    on<TCEvent extends TypedContractEvent>(event: TCEvent, listener: TypedListener<TCEvent>): Promise<this>;
    on<TCEvent extends TypedContractEvent>(filter: TypedDeferredTopicFilter<TCEvent>, listener: TypedListener<TCEvent>): Promise<this>;
    once<TCEvent extends TypedContractEvent>(event: TCEvent, listener: TypedListener<TCEvent>): Promise<this>;
    once<TCEvent extends TypedContractEvent>(filter: TypedDeferredTopicFilter<TCEvent>, listener: TypedListener<TCEvent>): Promise<this>;
    listeners<TCEvent extends TypedContractEvent>(event: TCEvent): Promise<Array<TypedListener<TCEvent>>>;
    listeners(eventName?: string): Promise<Array<Listener>>;
    removeAllListeners<TCEvent extends TypedContractEvent>(event?: TCEvent): Promise<this>;
    flipValid: TypedContractMethod<[], [void], "nonpayable">;
    groupId: TypedContractMethod<[], [bigint], "view">;
    valid: TypedContractMethod<[], [boolean], "view">;
    verifyProof: TypedContractMethod<[
        _groupId: BigNumberish,
        proof: ISemaphore.SemaphoreProofStruct
    ], [
        boolean
    ], "view">;
    getFunction<T extends ContractMethod = ContractMethod>(key: string | FunctionFragment): T;
    getFunction(nameOrSignature: "flipValid"): TypedContractMethod<[], [void], "nonpayable">;
    getFunction(nameOrSignature: "groupId"): TypedContractMethod<[], [bigint], "view">;
    getFunction(nameOrSignature: "valid"): TypedContractMethod<[], [boolean], "view">;
    getFunction(nameOrSignature: "verifyProof"): TypedContractMethod<[
        _groupId: BigNumberish,
        proof: ISemaphore.SemaphoreProofStruct
    ], [
        boolean
    ], "view">;
    filters: {};
}
//# sourceMappingURL=MockSemaphore.d.ts.map