import type { BaseContract, BigNumberish, BytesLike, FunctionFragment, Result, Interface, ContractRunner, ContractMethod, Listener } from "ethers";
import type { TypedContractEvent, TypedDeferredTopicFilter, TypedEventLog, TypedListener, TypedContractMethod } from "../../common";
export declare namespace DomainObjs {
    type MessageStruct = {
        data: BigNumberish[];
    };
    type MessageStructOutput = [data: bigint[]] & {
        data: bigint[];
    };
    type PubKeyStruct = {
        x: BigNumberish;
        y: BigNumberish;
    };
    type PubKeyStructOutput = [x: bigint, y: bigint] & {
        x: bigint;
        y: bigint;
    };
}
export interface IPollInterface extends Interface {
    getFunction(nameOrSignature: "actualStateTreeDepth" | "coordinatorPubKeyHash" | "currentSbCommitment" | "extContracts" | "getDeployTimeAndDuration" | "mergeMaciState" | "mergeMessageAq" | "mergeMessageAqSubRoots" | "numSignUpsAndMessages" | "publishMessage" | "stateMerged" | "treeDepths"): FunctionFragment;
    encodeFunctionData(functionFragment: "actualStateTreeDepth", values?: undefined): string;
    encodeFunctionData(functionFragment: "coordinatorPubKeyHash", values?: undefined): string;
    encodeFunctionData(functionFragment: "currentSbCommitment", values?: undefined): string;
    encodeFunctionData(functionFragment: "extContracts", values?: undefined): string;
    encodeFunctionData(functionFragment: "getDeployTimeAndDuration", values?: undefined): string;
    encodeFunctionData(functionFragment: "mergeMaciState", values?: undefined): string;
    encodeFunctionData(functionFragment: "mergeMessageAq", values?: undefined): string;
    encodeFunctionData(functionFragment: "mergeMessageAqSubRoots", values: [BigNumberish]): string;
    encodeFunctionData(functionFragment: "numSignUpsAndMessages", values?: undefined): string;
    encodeFunctionData(functionFragment: "publishMessage", values: [DomainObjs.MessageStruct, DomainObjs.PubKeyStruct]): string;
    encodeFunctionData(functionFragment: "stateMerged", values?: undefined): string;
    encodeFunctionData(functionFragment: "treeDepths", values?: undefined): string;
    decodeFunctionResult(functionFragment: "actualStateTreeDepth", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "coordinatorPubKeyHash", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "currentSbCommitment", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "extContracts", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "getDeployTimeAndDuration", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "mergeMaciState", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "mergeMessageAq", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "mergeMessageAqSubRoots", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "numSignUpsAndMessages", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "publishMessage", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "stateMerged", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "treeDepths", data: BytesLike): Result;
}
export interface IPoll extends BaseContract {
    connect(runner?: ContractRunner | null): IPoll;
    waitForDeployment(): Promise<this>;
    interface: IPollInterface;
    queryFilter<TCEvent extends TypedContractEvent>(event: TCEvent, fromBlockOrBlockhash?: string | number | undefined, toBlock?: string | number | undefined): Promise<Array<TypedEventLog<TCEvent>>>;
    queryFilter<TCEvent extends TypedContractEvent>(filter: TypedDeferredTopicFilter<TCEvent>, fromBlockOrBlockhash?: string | number | undefined, toBlock?: string | number | undefined): Promise<Array<TypedEventLog<TCEvent>>>;
    on<TCEvent extends TypedContractEvent>(event: TCEvent, listener: TypedListener<TCEvent>): Promise<this>;
    on<TCEvent extends TypedContractEvent>(filter: TypedDeferredTopicFilter<TCEvent>, listener: TypedListener<TCEvent>): Promise<this>;
    once<TCEvent extends TypedContractEvent>(event: TCEvent, listener: TypedListener<TCEvent>): Promise<this>;
    once<TCEvent extends TypedContractEvent>(filter: TypedDeferredTopicFilter<TCEvent>, listener: TypedListener<TCEvent>): Promise<this>;
    listeners<TCEvent extends TypedContractEvent>(event: TCEvent): Promise<Array<TypedListener<TCEvent>>>;
    listeners(eventName?: string): Promise<Array<Listener>>;
    removeAllListeners<TCEvent extends TypedContractEvent>(event?: TCEvent): Promise<this>;
    actualStateTreeDepth: TypedContractMethod<[], [bigint], "view">;
    coordinatorPubKeyHash: TypedContractMethod<[], [bigint], "view">;
    currentSbCommitment: TypedContractMethod<[], [bigint], "view">;
    extContracts: TypedContractMethod<[
    ], [
        [string, string] & {
            maci: string;
            messageAq: string;
        }
    ], "view">;
    getDeployTimeAndDuration: TypedContractMethod<[
    ], [
        [bigint, bigint] & {
            _deployTime: bigint;
            _duration: bigint;
        }
    ], "view">;
    mergeMaciState: TypedContractMethod<[], [void], "nonpayable">;
    mergeMessageAq: TypedContractMethod<[], [void], "nonpayable">;
    mergeMessageAqSubRoots: TypedContractMethod<[
        _numSrQueueOps: BigNumberish
    ], [
        void
    ], "nonpayable">;
    numSignUpsAndMessages: TypedContractMethod<[
    ], [
        [bigint, bigint] & {
            numSignups: bigint;
            numMsgs: bigint;
        }
    ], "view">;
    publishMessage: TypedContractMethod<[
        _message: DomainObjs.MessageStruct,
        _encPubKey: DomainObjs.PubKeyStruct
    ], [
        void
    ], "nonpayable">;
    stateMerged: TypedContractMethod<[], [boolean], "view">;
    treeDepths: TypedContractMethod<[
    ], [
        [
            bigint,
            bigint,
            bigint,
            bigint
        ] & {
            intStateTreeDepth: bigint;
            messageTreeSubDepth: bigint;
            messageTreeDepth: bigint;
            voteOptionTreeDepth: bigint;
        }
    ], "view">;
    getFunction<T extends ContractMethod = ContractMethod>(key: string | FunctionFragment): T;
    getFunction(nameOrSignature: "actualStateTreeDepth"): TypedContractMethod<[], [bigint], "view">;
    getFunction(nameOrSignature: "coordinatorPubKeyHash"): TypedContractMethod<[], [bigint], "view">;
    getFunction(nameOrSignature: "currentSbCommitment"): TypedContractMethod<[], [bigint], "view">;
    getFunction(nameOrSignature: "extContracts"): TypedContractMethod<[
    ], [
        [string, string] & {
            maci: string;
            messageAq: string;
        }
    ], "view">;
    getFunction(nameOrSignature: "getDeployTimeAndDuration"): TypedContractMethod<[
    ], [
        [bigint, bigint] & {
            _deployTime: bigint;
            _duration: bigint;
        }
    ], "view">;
    getFunction(nameOrSignature: "mergeMaciState"): TypedContractMethod<[], [void], "nonpayable">;
    getFunction(nameOrSignature: "mergeMessageAq"): TypedContractMethod<[], [void], "nonpayable">;
    getFunction(nameOrSignature: "mergeMessageAqSubRoots"): TypedContractMethod<[_numSrQueueOps: BigNumberish], [void], "nonpayable">;
    getFunction(nameOrSignature: "numSignUpsAndMessages"): TypedContractMethod<[
    ], [
        [bigint, bigint] & {
            numSignups: bigint;
            numMsgs: bigint;
        }
    ], "view">;
    getFunction(nameOrSignature: "publishMessage"): TypedContractMethod<[
        _message: DomainObjs.MessageStruct,
        _encPubKey: DomainObjs.PubKeyStruct
    ], [
        void
    ], "nonpayable">;
    getFunction(nameOrSignature: "stateMerged"): TypedContractMethod<[], [boolean], "view">;
    getFunction(nameOrSignature: "treeDepths"): TypedContractMethod<[
    ], [
        [
            bigint,
            bigint,
            bigint,
            bigint
        ] & {
            intStateTreeDepth: bigint;
            messageTreeSubDepth: bigint;
            messageTreeDepth: bigint;
            voteOptionTreeDepth: bigint;
        }
    ], "view">;
    filters: {};
}
//# sourceMappingURL=IPoll.d.ts.map