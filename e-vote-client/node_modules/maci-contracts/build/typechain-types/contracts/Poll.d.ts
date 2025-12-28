import type { BaseContract, BigNumberish, BytesLike, FunctionFragment, Result, Interface, EventFragment, AddressLike, ContractRunner, ContractMethod, Listener } from "ethers";
import type { TypedContractEvent, TypedDeferredTopicFilter, TypedEventLog, TypedLogDescription, TypedListener, TypedContractMethod } from "../common";
export declare namespace Params {
    type TreeDepthsStruct = {
        intStateTreeDepth: BigNumberish;
        messageTreeSubDepth: BigNumberish;
        messageTreeDepth: BigNumberish;
        voteOptionTreeDepth: BigNumberish;
    };
    type TreeDepthsStructOutput = [
        intStateTreeDepth: bigint,
        messageTreeSubDepth: bigint,
        messageTreeDepth: bigint,
        voteOptionTreeDepth: bigint
    ] & {
        intStateTreeDepth: bigint;
        messageTreeSubDepth: bigint;
        messageTreeDepth: bigint;
        voteOptionTreeDepth: bigint;
    };
    type ExtContractsStruct = {
        maci: AddressLike;
        messageAq: AddressLike;
    };
    type ExtContractsStructOutput = [maci: string, messageAq: string] & {
        maci: string;
        messageAq: string;
    };
}
export declare namespace DomainObjs {
    type PubKeyStruct = {
        x: BigNumberish;
        y: BigNumberish;
    };
    type PubKeyStructOutput = [x: bigint, y: bigint] & {
        x: bigint;
        y: bigint;
    };
    type MessageStruct = {
        data: BigNumberish[];
    };
    type MessageStructOutput = [data: bigint[]] & {
        data: bigint[];
    };
    type StateLeafStruct = {
        pubKey: DomainObjs.PubKeyStruct;
        voiceCreditBalance: BigNumberish;
        timestamp: BigNumberish;
    };
    type StateLeafStructOutput = [
        pubKey: DomainObjs.PubKeyStructOutput,
        voiceCreditBalance: bigint,
        timestamp: bigint
    ] & {
        pubKey: DomainObjs.PubKeyStructOutput;
        voiceCreditBalance: bigint;
        timestamp: bigint;
    };
}
export interface PollInterface extends Interface {
    getFunction(nameOrSignature: "MESSAGE_DATA_LENGTH" | "actualStateTreeDepth" | "coordinatorPubKey" | "coordinatorPubKeyHash" | "currentSbCommitment" | "emptyBallotRoot" | "extContracts" | "getDeployTimeAndDuration" | "hash2" | "hash3" | "hash4" | "hash5" | "hashLeftRight" | "hashMessageAndEncPubKey" | "hashStateLeaf" | "init" | "maxMessages" | "mergeMaciState" | "mergeMessageAq" | "mergeMessageAqSubRoots" | "mergedStateRoot" | "numMessages" | "numSignUpsAndMessages" | "numSignups" | "padAndHashMessage" | "publishMessage" | "publishMessageBatch" | "sha256Hash" | "stateMerged" | "treeDepths"): FunctionFragment;
    getEvent(nameOrSignatureOrTopic: "MergeMaciState" | "MergeMessageAq" | "MergeMessageAqSubRoots" | "PublishMessage"): EventFragment;
    encodeFunctionData(functionFragment: "MESSAGE_DATA_LENGTH", values?: undefined): string;
    encodeFunctionData(functionFragment: "actualStateTreeDepth", values?: undefined): string;
    encodeFunctionData(functionFragment: "coordinatorPubKey", values?: undefined): string;
    encodeFunctionData(functionFragment: "coordinatorPubKeyHash", values?: undefined): string;
    encodeFunctionData(functionFragment: "currentSbCommitment", values?: undefined): string;
    encodeFunctionData(functionFragment: "emptyBallotRoot", values?: undefined): string;
    encodeFunctionData(functionFragment: "extContracts", values?: undefined): string;
    encodeFunctionData(functionFragment: "getDeployTimeAndDuration", values?: undefined): string;
    encodeFunctionData(functionFragment: "hash2", values: [[BigNumberish, BigNumberish]]): string;
    encodeFunctionData(functionFragment: "hash3", values: [[BigNumberish, BigNumberish, BigNumberish]]): string;
    encodeFunctionData(functionFragment: "hash4", values: [[BigNumberish, BigNumberish, BigNumberish, BigNumberish]]): string;
    encodeFunctionData(functionFragment: "hash5", values: [
        [
            BigNumberish,
            BigNumberish,
            BigNumberish,
            BigNumberish,
            BigNumberish
        ]
    ]): string;
    encodeFunctionData(functionFragment: "hashLeftRight", values: [BigNumberish, BigNumberish]): string;
    encodeFunctionData(functionFragment: "hashMessageAndEncPubKey", values: [DomainObjs.MessageStruct, DomainObjs.PubKeyStruct]): string;
    encodeFunctionData(functionFragment: "hashStateLeaf", values: [DomainObjs.StateLeafStruct]): string;
    encodeFunctionData(functionFragment: "init", values?: undefined): string;
    encodeFunctionData(functionFragment: "maxMessages", values?: undefined): string;
    encodeFunctionData(functionFragment: "mergeMaciState", values?: undefined): string;
    encodeFunctionData(functionFragment: "mergeMessageAq", values?: undefined): string;
    encodeFunctionData(functionFragment: "mergeMessageAqSubRoots", values: [BigNumberish]): string;
    encodeFunctionData(functionFragment: "mergedStateRoot", values?: undefined): string;
    encodeFunctionData(functionFragment: "numMessages", values?: undefined): string;
    encodeFunctionData(functionFragment: "numSignUpsAndMessages", values?: undefined): string;
    encodeFunctionData(functionFragment: "numSignups", values?: undefined): string;
    encodeFunctionData(functionFragment: "padAndHashMessage", values: [[BigNumberish, BigNumberish]]): string;
    encodeFunctionData(functionFragment: "publishMessage", values: [DomainObjs.MessageStruct, DomainObjs.PubKeyStruct]): string;
    encodeFunctionData(functionFragment: "publishMessageBatch", values: [DomainObjs.MessageStruct[], DomainObjs.PubKeyStruct[]]): string;
    encodeFunctionData(functionFragment: "sha256Hash", values: [BigNumberish[]]): string;
    encodeFunctionData(functionFragment: "stateMerged", values?: undefined): string;
    encodeFunctionData(functionFragment: "treeDepths", values?: undefined): string;
    decodeFunctionResult(functionFragment: "MESSAGE_DATA_LENGTH", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "actualStateTreeDepth", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "coordinatorPubKey", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "coordinatorPubKeyHash", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "currentSbCommitment", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "emptyBallotRoot", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "extContracts", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "getDeployTimeAndDuration", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "hash2", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "hash3", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "hash4", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "hash5", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "hashLeftRight", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "hashMessageAndEncPubKey", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "hashStateLeaf", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "init", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "maxMessages", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "mergeMaciState", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "mergeMessageAq", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "mergeMessageAqSubRoots", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "mergedStateRoot", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "numMessages", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "numSignUpsAndMessages", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "numSignups", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "padAndHashMessage", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "publishMessage", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "publishMessageBatch", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "sha256Hash", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "stateMerged", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "treeDepths", data: BytesLike): Result;
}
export declare namespace MergeMaciStateEvent {
    type InputTuple = [
        _stateRoot: BigNumberish,
        _numSignups: BigNumberish
    ];
    type OutputTuple = [_stateRoot: bigint, _numSignups: bigint];
    interface OutputObject {
        _stateRoot: bigint;
        _numSignups: bigint;
    }
    type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
    type Filter = TypedDeferredTopicFilter<Event>;
    type Log = TypedEventLog<Event>;
    type LogDescription = TypedLogDescription<Event>;
}
export declare namespace MergeMessageAqEvent {
    type InputTuple = [_messageRoot: BigNumberish];
    type OutputTuple = [_messageRoot: bigint];
    interface OutputObject {
        _messageRoot: bigint;
    }
    type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
    type Filter = TypedDeferredTopicFilter<Event>;
    type Log = TypedEventLog<Event>;
    type LogDescription = TypedLogDescription<Event>;
}
export declare namespace MergeMessageAqSubRootsEvent {
    type InputTuple = [_numSrQueueOps: BigNumberish];
    type OutputTuple = [_numSrQueueOps: bigint];
    interface OutputObject {
        _numSrQueueOps: bigint;
    }
    type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
    type Filter = TypedDeferredTopicFilter<Event>;
    type Log = TypedEventLog<Event>;
    type LogDescription = TypedLogDescription<Event>;
}
export declare namespace PublishMessageEvent {
    type InputTuple = [
        _message: DomainObjs.MessageStruct,
        _encPubKey: DomainObjs.PubKeyStruct
    ];
    type OutputTuple = [
        _message: DomainObjs.MessageStructOutput,
        _encPubKey: DomainObjs.PubKeyStructOutput
    ];
    interface OutputObject {
        _message: DomainObjs.MessageStructOutput;
        _encPubKey: DomainObjs.PubKeyStructOutput;
    }
    type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
    type Filter = TypedDeferredTopicFilter<Event>;
    type Log = TypedEventLog<Event>;
    type LogDescription = TypedLogDescription<Event>;
}
export interface Poll extends BaseContract {
    connect(runner?: ContractRunner | null): Poll;
    waitForDeployment(): Promise<this>;
    interface: PollInterface;
    queryFilter<TCEvent extends TypedContractEvent>(event: TCEvent, fromBlockOrBlockhash?: string | number | undefined, toBlock?: string | number | undefined): Promise<Array<TypedEventLog<TCEvent>>>;
    queryFilter<TCEvent extends TypedContractEvent>(filter: TypedDeferredTopicFilter<TCEvent>, fromBlockOrBlockhash?: string | number | undefined, toBlock?: string | number | undefined): Promise<Array<TypedEventLog<TCEvent>>>;
    on<TCEvent extends TypedContractEvent>(event: TCEvent, listener: TypedListener<TCEvent>): Promise<this>;
    on<TCEvent extends TypedContractEvent>(filter: TypedDeferredTopicFilter<TCEvent>, listener: TypedListener<TCEvent>): Promise<this>;
    once<TCEvent extends TypedContractEvent>(event: TCEvent, listener: TypedListener<TCEvent>): Promise<this>;
    once<TCEvent extends TypedContractEvent>(filter: TypedDeferredTopicFilter<TCEvent>, listener: TypedListener<TCEvent>): Promise<this>;
    listeners<TCEvent extends TypedContractEvent>(event: TCEvent): Promise<Array<TypedListener<TCEvent>>>;
    listeners(eventName?: string): Promise<Array<Listener>>;
    removeAllListeners<TCEvent extends TypedContractEvent>(event?: TCEvent): Promise<this>;
    MESSAGE_DATA_LENGTH: TypedContractMethod<[], [bigint], "view">;
    actualStateTreeDepth: TypedContractMethod<[], [bigint], "view">;
    coordinatorPubKey: TypedContractMethod<[
    ], [
        [bigint, bigint] & {
            x: bigint;
            y: bigint;
        }
    ], "view">;
    coordinatorPubKeyHash: TypedContractMethod<[], [bigint], "view">;
    currentSbCommitment: TypedContractMethod<[], [bigint], "view">;
    emptyBallotRoot: TypedContractMethod<[], [bigint], "view">;
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
            pollDeployTime: bigint;
            pollDuration: bigint;
        }
    ], "view">;
    hash2: TypedContractMethod<[
        array: [BigNumberish, BigNumberish]
    ], [
        bigint
    ], "view">;
    hash3: TypedContractMethod<[
        array: [BigNumberish, BigNumberish, BigNumberish]
    ], [
        bigint
    ], "view">;
    hash4: TypedContractMethod<[
        array: [BigNumberish, BigNumberish, BigNumberish, BigNumberish]
    ], [
        bigint
    ], "view">;
    hash5: TypedContractMethod<[
        array: [
            BigNumberish,
            BigNumberish,
            BigNumberish,
            BigNumberish,
            BigNumberish
        ]
    ], [
        bigint
    ], "view">;
    hashLeftRight: TypedContractMethod<[
        left: BigNumberish,
        right: BigNumberish
    ], [
        bigint
    ], "view">;
    hashMessageAndEncPubKey: TypedContractMethod<[
        _message: DomainObjs.MessageStruct,
        _encPubKey: DomainObjs.PubKeyStruct
    ], [
        bigint
    ], "view">;
    hashStateLeaf: TypedContractMethod<[
        _stateLeaf: DomainObjs.StateLeafStruct
    ], [
        bigint
    ], "view">;
    init: TypedContractMethod<[], [void], "nonpayable">;
    maxMessages: TypedContractMethod<[], [bigint], "view">;
    mergeMaciState: TypedContractMethod<[], [void], "nonpayable">;
    mergeMessageAq: TypedContractMethod<[], [void], "nonpayable">;
    mergeMessageAqSubRoots: TypedContractMethod<[
        _numSrQueueOps: BigNumberish
    ], [
        void
    ], "nonpayable">;
    mergedStateRoot: TypedContractMethod<[], [bigint], "view">;
    numMessages: TypedContractMethod<[], [bigint], "view">;
    numSignUpsAndMessages: TypedContractMethod<[
    ], [
        [bigint, bigint] & {
            numSUps: bigint;
            numMsgs: bigint;
        }
    ], "view">;
    numSignups: TypedContractMethod<[], [bigint], "view">;
    padAndHashMessage: TypedContractMethod<[
        dataToPad: [BigNumberish, BigNumberish]
    ], [
        [
            DomainObjs.MessageStructOutput,
            DomainObjs.PubKeyStructOutput,
            bigint
        ] & {
            message: DomainObjs.MessageStructOutput;
            padKey: DomainObjs.PubKeyStructOutput;
            msgHash: bigint;
        }
    ], "view">;
    publishMessage: TypedContractMethod<[
        _message: DomainObjs.MessageStruct,
        _encPubKey: DomainObjs.PubKeyStruct
    ], [
        void
    ], "nonpayable">;
    publishMessageBatch: TypedContractMethod<[
        _messages: DomainObjs.MessageStruct[],
        _encPubKeys: DomainObjs.PubKeyStruct[]
    ], [
        void
    ], "nonpayable">;
    sha256Hash: TypedContractMethod<[array: BigNumberish[]], [bigint], "view">;
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
    getFunction(nameOrSignature: "MESSAGE_DATA_LENGTH"): TypedContractMethod<[], [bigint], "view">;
    getFunction(nameOrSignature: "actualStateTreeDepth"): TypedContractMethod<[], [bigint], "view">;
    getFunction(nameOrSignature: "coordinatorPubKey"): TypedContractMethod<[
    ], [
        [bigint, bigint] & {
            x: bigint;
            y: bigint;
        }
    ], "view">;
    getFunction(nameOrSignature: "coordinatorPubKeyHash"): TypedContractMethod<[], [bigint], "view">;
    getFunction(nameOrSignature: "currentSbCommitment"): TypedContractMethod<[], [bigint], "view">;
    getFunction(nameOrSignature: "emptyBallotRoot"): TypedContractMethod<[], [bigint], "view">;
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
            pollDeployTime: bigint;
            pollDuration: bigint;
        }
    ], "view">;
    getFunction(nameOrSignature: "hash2"): TypedContractMethod<[
        array: [BigNumberish, BigNumberish]
    ], [
        bigint
    ], "view">;
    getFunction(nameOrSignature: "hash3"): TypedContractMethod<[
        array: [BigNumberish, BigNumberish, BigNumberish]
    ], [
        bigint
    ], "view">;
    getFunction(nameOrSignature: "hash4"): TypedContractMethod<[
        array: [BigNumberish, BigNumberish, BigNumberish, BigNumberish]
    ], [
        bigint
    ], "view">;
    getFunction(nameOrSignature: "hash5"): TypedContractMethod<[
        array: [
            BigNumberish,
            BigNumberish,
            BigNumberish,
            BigNumberish,
            BigNumberish
        ]
    ], [
        bigint
    ], "view">;
    getFunction(nameOrSignature: "hashLeftRight"): TypedContractMethod<[
        left: BigNumberish,
        right: BigNumberish
    ], [
        bigint
    ], "view">;
    getFunction(nameOrSignature: "hashMessageAndEncPubKey"): TypedContractMethod<[
        _message: DomainObjs.MessageStruct,
        _encPubKey: DomainObjs.PubKeyStruct
    ], [
        bigint
    ], "view">;
    getFunction(nameOrSignature: "hashStateLeaf"): TypedContractMethod<[
        _stateLeaf: DomainObjs.StateLeafStruct
    ], [
        bigint
    ], "view">;
    getFunction(nameOrSignature: "init"): TypedContractMethod<[], [void], "nonpayable">;
    getFunction(nameOrSignature: "maxMessages"): TypedContractMethod<[], [bigint], "view">;
    getFunction(nameOrSignature: "mergeMaciState"): TypedContractMethod<[], [void], "nonpayable">;
    getFunction(nameOrSignature: "mergeMessageAq"): TypedContractMethod<[], [void], "nonpayable">;
    getFunction(nameOrSignature: "mergeMessageAqSubRoots"): TypedContractMethod<[_numSrQueueOps: BigNumberish], [void], "nonpayable">;
    getFunction(nameOrSignature: "mergedStateRoot"): TypedContractMethod<[], [bigint], "view">;
    getFunction(nameOrSignature: "numMessages"): TypedContractMethod<[], [bigint], "view">;
    getFunction(nameOrSignature: "numSignUpsAndMessages"): TypedContractMethod<[
    ], [
        [bigint, bigint] & {
            numSUps: bigint;
            numMsgs: bigint;
        }
    ], "view">;
    getFunction(nameOrSignature: "numSignups"): TypedContractMethod<[], [bigint], "view">;
    getFunction(nameOrSignature: "padAndHashMessage"): TypedContractMethod<[
        dataToPad: [BigNumberish, BigNumberish]
    ], [
        [
            DomainObjs.MessageStructOutput,
            DomainObjs.PubKeyStructOutput,
            bigint
        ] & {
            message: DomainObjs.MessageStructOutput;
            padKey: DomainObjs.PubKeyStructOutput;
            msgHash: bigint;
        }
    ], "view">;
    getFunction(nameOrSignature: "publishMessage"): TypedContractMethod<[
        _message: DomainObjs.MessageStruct,
        _encPubKey: DomainObjs.PubKeyStruct
    ], [
        void
    ], "nonpayable">;
    getFunction(nameOrSignature: "publishMessageBatch"): TypedContractMethod<[
        _messages: DomainObjs.MessageStruct[],
        _encPubKeys: DomainObjs.PubKeyStruct[]
    ], [
        void
    ], "nonpayable">;
    getFunction(nameOrSignature: "sha256Hash"): TypedContractMethod<[array: BigNumberish[]], [bigint], "view">;
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
    getEvent(key: "MergeMaciState"): TypedContractEvent<MergeMaciStateEvent.InputTuple, MergeMaciStateEvent.OutputTuple, MergeMaciStateEvent.OutputObject>;
    getEvent(key: "MergeMessageAq"): TypedContractEvent<MergeMessageAqEvent.InputTuple, MergeMessageAqEvent.OutputTuple, MergeMessageAqEvent.OutputObject>;
    getEvent(key: "MergeMessageAqSubRoots"): TypedContractEvent<MergeMessageAqSubRootsEvent.InputTuple, MergeMessageAqSubRootsEvent.OutputTuple, MergeMessageAqSubRootsEvent.OutputObject>;
    getEvent(key: "PublishMessage"): TypedContractEvent<PublishMessageEvent.InputTuple, PublishMessageEvent.OutputTuple, PublishMessageEvent.OutputObject>;
    filters: {
        "MergeMaciState(uint256,uint256)": TypedContractEvent<MergeMaciStateEvent.InputTuple, MergeMaciStateEvent.OutputTuple, MergeMaciStateEvent.OutputObject>;
        MergeMaciState: TypedContractEvent<MergeMaciStateEvent.InputTuple, MergeMaciStateEvent.OutputTuple, MergeMaciStateEvent.OutputObject>;
        "MergeMessageAq(uint256)": TypedContractEvent<MergeMessageAqEvent.InputTuple, MergeMessageAqEvent.OutputTuple, MergeMessageAqEvent.OutputObject>;
        MergeMessageAq: TypedContractEvent<MergeMessageAqEvent.InputTuple, MergeMessageAqEvent.OutputTuple, MergeMessageAqEvent.OutputObject>;
        "MergeMessageAqSubRoots(uint256)": TypedContractEvent<MergeMessageAqSubRootsEvent.InputTuple, MergeMessageAqSubRootsEvent.OutputTuple, MergeMessageAqSubRootsEvent.OutputObject>;
        MergeMessageAqSubRoots: TypedContractEvent<MergeMessageAqSubRootsEvent.InputTuple, MergeMessageAqSubRootsEvent.OutputTuple, MergeMessageAqSubRootsEvent.OutputObject>;
        "PublishMessage(tuple,tuple)": TypedContractEvent<PublishMessageEvent.InputTuple, PublishMessageEvent.OutputTuple, PublishMessageEvent.OutputObject>;
        PublishMessage: TypedContractEvent<PublishMessageEvent.InputTuple, PublishMessageEvent.OutputTuple, PublishMessageEvent.OutputObject>;
    };
}
//# sourceMappingURL=Poll.d.ts.map