interface IGetZerosContractArgs {
    name: string;
    zeroVal: bigint;
    hashLength: number;
    numZeros: number;
    comment: string;
    useSha256: boolean;
    subDepth: number;
}
export declare const genZerosContract: ({ name, zeroVal, hashLength, numZeros, comment, useSha256, subDepth, }: IGetZerosContractArgs) => Promise<string>;
export {};
//# sourceMappingURL=genZerosContract.d.ts.map