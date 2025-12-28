export type SnarkBigNumber = bigint | string;
export type PrivKey = SnarkBigNumber;
export type PubKey<N = bigint> = [N, N];
export type EcdhSharedKey<N = bigint> = [N, N];
export type Point<N = SnarkBigNumber> = [N, N];
export type Plaintext<N = bigint> = N[];
export type Ciphertext<N = bigint> = N[];
export type PathElements = bigint[][];
/**
 * A acc queue
 */
export interface Queue {
    levels: Map<number, Map<number, bigint>>;
    indices: number[];
}
/**
 * A private key and a public key
 */
export interface Keypair {
    privKey: PrivKey;
    pubKey: PubKey;
}
export interface Signature<N = SnarkBigNumber> {
    R8: Point<N>;
    S: N;
}
/**
 * A interface for poseidon hash functions
 */
export interface PoseidonFuncs {
    [key: number]: (inputs: bigint[]) => bigint;
    2: (inputs: bigint[]) => bigint;
    3: (inputs: bigint[]) => bigint;
    4: (inputs: bigint[]) => bigint;
    5: (inputs: bigint[]) => bigint;
}
export type Leaf = bigint;
export type Node = Record<number, Leaf>;
export interface IMerkleProof {
    pathElements: Leaf[][];
    pathIndices: number[];
    root: Leaf;
    leaf: Leaf;
}
export type StringifiedBigInts = StringifiedBigInts[] | string | string[] | string[][] | string[][][] | {
    [key: string]: StringifiedBigInts;
} | null;
export type BigIntVariants = BigIntVariants[] | StringifiedBigInts | bigint | bigint[] | bigint[][] | bigint[][][] | {
    [key: string]: BigIntVariants;
} | Uint8Array | null;
//# sourceMappingURL=types.d.ts.map