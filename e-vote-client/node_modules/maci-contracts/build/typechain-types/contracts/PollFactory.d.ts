import type { BaseContract, BigNumberish, BytesLike, FunctionFragment, Result, Interface, AddressLike, ContractRunner, ContractMethod, Listener } from "ethers";
import type { TypedContractEvent, TypedDeferredTopicFilter, TypedEventLog, TypedListener, TypedContractMethod } from "../common";
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
}
export interface PollFactoryInterface extends Interface {
    getFunction(nameOrSignature: "MESSAGE_DATA_LENGTH" | "deploy"): FunctionFragment;
    encodeFunctionData(functionFragment: "MESSAGE_DATA_LENGTH", values?: undefined): string;
    encodeFunctionData(functionFragment: "deploy", values: [
        BigNumberish,
        Params.TreeDepthsStruct,
        DomainObjs.PubKeyStruct,
        AddressLike,
        BigNumberish
    ]): string;
    decodeFunctionResult(functionFragment: "MESSAGE_DATA_LENGTH", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "deploy", data: BytesLike): Result;
}
export interface PollFactory extends BaseContract {
    connect(runner?: ContractRunner | null): PollFactory;
    waitForDeployment(): Promise<this>;
    interface: PollFactoryInterface;
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
    deploy: TypedContractMethod<[
        _duration: BigNumberish,
        _treeDepths: Params.TreeDepthsStruct,
        _coordinatorPubKey: DomainObjs.PubKeyStruct,
        _maci: AddressLike,
        _emptyBallotRoot: BigNumberish
    ], [
        string
    ], "nonpayable">;
    getFunction<T extends ContractMethod = ContractMethod>(key: string | FunctionFragment): T;
    getFunction(nameOrSignature: "MESSAGE_DATA_LENGTH"): TypedContractMethod<[], [bigint], "view">;
    getFunction(nameOrSignature: "deploy"): TypedContractMethod<[
        _duration: BigNumberish,
        _treeDepths: Params.TreeDepthsStruct,
        _coordinatorPubKey: DomainObjs.PubKeyStruct,
        _maci: AddressLike,
        _emptyBallotRoot: BigNumberish
    ], [
        string
    ], "nonpayable">;
    filters: {};
}
//# sourceMappingURL=PollFactory.d.ts.map