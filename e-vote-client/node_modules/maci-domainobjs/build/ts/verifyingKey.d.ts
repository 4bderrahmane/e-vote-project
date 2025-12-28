import { G1Point, G2Point } from "maci-crypto";
import type { IVkContractParams, IVkObjectParams } from "./types";
/**
 * @notice A TS Class representing a zk-SNARK VerifyingKey
 */
export declare class VerifyingKey {
    alpha1: G1Point;
    beta2: G2Point;
    gamma2: G2Point;
    delta2: G2Point;
    ic: G1Point[];
    /**
     * Generate a new VerifyingKey
     * @param alpha1 the alpha1 point
     * @param beta2 the beta2 point
     * @param gamma2 the gamma2 point
     * @param delta2 the delta2 point
     * @param ic the ic points
     */
    constructor(alpha1: G1Point, beta2: G2Point, gamma2: G2Point, delta2: G2Point, ic: G1Point[]);
    /**
     * Return this as an object which can be passed
     * to the smart contract
     * @returns the object representation of this
     */
    asContractParam(): IVkContractParams;
    /**
     * Create a new verifying key from a contract representation of the VK
     * @param data the object representation
     * @returns a new VerifyingKey
     */
    static fromContract(data: IVkContractParams): VerifyingKey;
    /**
     * Check whether this is equal to another verifying key
     * @param vk the other verifying key
     * @returns whether this is equal to the other verifying key
     */
    equals(vk: VerifyingKey): boolean;
    /**
     * Produce a copy of this verifying key
     * @returns the copy
     */
    copy(): VerifyingKey;
    /**
     * Deserialize into a VerifyingKey instance
     * @param json the JSON representation
     * @returns the VerifyingKey
     */
    static fromJSON: (json: string) => VerifyingKey;
    /**
     * Convert an object representation to a VerifyingKey
     * @param data the object representation
     * @returns the VerifyingKey
     */
    static fromObj: (data: IVkObjectParams) => VerifyingKey;
}
//# sourceMappingURL=verifyingKey.d.ts.map