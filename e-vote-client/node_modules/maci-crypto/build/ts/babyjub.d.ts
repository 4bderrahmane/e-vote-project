/**
 * @notice A class representing a point on the first group (G1)
 * of the Jubjub curve
 */
export declare class G1Point {
    x: bigint;
    y: bigint;
    /**
     * Create a new instance of G1Point
     * @param x the x coordinate
     * @param y the y coordinate
     */
    constructor(x: bigint, y: bigint);
    /**
     * Check whether two points are equal
     * @param pt the point to compare with
     * @returns whether they are equal or not
     */
    equals(pt: G1Point): boolean;
    /**
     * Return the point as a contract param in the form of an object
     * @returns the point as a contract param
     */
    asContractParam(): {
        x: string;
        y: string;
    };
}
/**
 * @notice A class representing a point on the second group (G2)
 * of the Jubjub curve. This is usually an extension field of the
 * base field of the curve.
 */
export declare class G2Point {
    x: bigint[];
    y: bigint[];
    /**
     * Create a new instance of G2Point
     * @param x the x coordinate
     * @param y the y coordinate
     */
    constructor(x: bigint[], y: bigint[]);
    /**
     * Check whether two points are equal
     * @param pt the point to compare with
     * @returns whether they are equal or not
     */
    equals(pt: G2Point): boolean;
    /**
     * Return the point as a contract param in the form of an object
     * @returns the point as a contract param
     */
    asContractParam(): {
        x: string[];
        y: string[];
    };
    /**
     * Check whether the points are in range
     * @param x the x coordinate
     * @param type the type of the coordinate
     */
    private checkPointsRange;
}
/**
 * Returns a BabyJub-compatible random value. We create it by first generating
 * a random value (initially 256 bits large) modulo the snark field size as
 * described in EIP197. This results in a key size of roughly 253 bits and no
 * more than 254 bits. To prevent modulo bias, we then use this efficient
 * algorithm:
 * http://cvsweb.openbsd.org/cgi-bin/cvsweb/~checkout~/src/lib/libc/crypt/arc4random_uniform.c
 * @returns A BabyJub-compatible random value.
 */
export declare const genRandomBabyJubValue: () => bigint;
//# sourceMappingURL=babyjub.d.ts.map