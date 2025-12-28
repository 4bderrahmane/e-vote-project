import type { BaseContract, BigNumberish, BytesLike, FunctionFragment, Result, Interface, AddressLike, ContractRunner, ContractMethod, Listener } from "ethers";
import type { TypedContractEvent, TypedDeferredTopicFilter, TypedEventLog, TypedListener, TypedContractMethod } from "../../common";
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
export interface IPollFactoryInterface extends Interface {
    getFunction(nameOrSignature: "deploy"): FunctionFragment;
    encodeFunctionData(functionFragment: "deploy", values: [
        BigNumberish,
        Params.TreeDepthsStruct,
        DomainObjs.PubKeyStruct,
        AddressLike,
        BigNumberish
    ]): string;
    decodeFunctionResult(functionFragment: "deploy", data: BytesLike): Result;
}
export interface IPollFactory extends BaseContract {
    connect(runner?: ContractRunner | null): IPollFactory;
    waitForDeployment(): Promise<this>;
    interface: IPollFactoryInterface;
    queryFilter<TCEvent extends TypedContractEvent>(event: TCEvent, fromBlockOrBlockhash?: string | number | undefined, toBlock?: string | number | undefined): Promise<Array<TypedEventLog<TCEvent>>>;
    queryFilter<TCEvent extends TypedContractEvent>(filter: TypedDeferredTopicFilter<TCEvent>, fromBlockOrBlockhash?: string | number | undefined, toBlock?: string | number | undefined): Promise<Array<TypedEventLog<TCEvent>>>;
    on<TCEvent extends TypedContractEvent>(event: TCEvent, listener: TypedListener<TCEvent>): Promise<this>;
    on<TCEvent extends TypedContractEvent>(filter: TypedDeferredTopicFilter<TCEvent>, listener: TypedListener<TCEvent>): Promise<this>;
    once<TCEvent extends TypedContractEvent>(event: TCEvent, listener: TypedListener<TCEvent>): Promise<this>;
    once<TCEvent extends TypedContractEvent>(filter: TypedDeferredTopicFilter<TCEvent>, listener: TypedListener<TCEvent>): Promise<this>;
    listeners<TCEvent extends TypedContractEvent>(event: TCEvent): Promise<Array<TypedListener<TCEvent>>>;
    listeners(eventName?: string): Promise<Array<Listener>>;
    removeAllListeners<TCEvent extends TypedContractEvent>(event?: TCEvent): Promise<this>;
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
//# sourceMappingURL=IPollFactory.d.ts.map