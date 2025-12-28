"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VerifyingKey = void 0;
const maci_crypto_1 = require("maci-crypto");
/**
 * @notice A TS Class representing a zk-SNARK VerifyingKey
 */
class VerifyingKey {
    /**
     * Generate a new VerifyingKey
     * @param alpha1 the alpha1 point
     * @param beta2 the beta2 point
     * @param gamma2 the gamma2 point
     * @param delta2 the delta2 point
     * @param ic the ic points
     */
    constructor(alpha1, beta2, gamma2, delta2, ic) {
        this.alpha1 = alpha1;
        this.beta2 = beta2;
        this.gamma2 = gamma2;
        this.delta2 = delta2;
        this.ic = ic;
    }
    /**
     * Return this as an object which can be passed
     * to the smart contract
     * @returns the object representation of this
     */
    asContractParam() {
        return {
            alpha1: this.alpha1.asContractParam(),
            beta2: this.beta2.asContractParam(),
            gamma2: this.gamma2.asContractParam(),
            delta2: this.delta2.asContractParam(),
            ic: this.ic.map((x) => x.asContractParam()),
        };
    }
    /**
     * Create a new verifying key from a contract representation of the VK
     * @param data the object representation
     * @returns a new VerifyingKey
     */
    static fromContract(data) {
        const convertG2 = (point) => new maci_crypto_1.G2Point([BigInt(point.x[0]), BigInt(point.x[1])], [BigInt(point.y[0]), BigInt(point.y[1])]);
        return new VerifyingKey(new maci_crypto_1.G1Point(BigInt(data.alpha1.x), BigInt(data.alpha1.y)), convertG2(data.beta2), convertG2(data.gamma2), convertG2(data.delta2), data.ic.map((c) => new maci_crypto_1.G1Point(BigInt(c.x), BigInt(c.y))));
    }
    /**
     * Check whether this is equal to another verifying key
     * @param vk the other verifying key
     * @returns whether this is equal to the other verifying key
     */
    equals(vk) {
        // Immediately return false if the length doesn't match
        if (this.ic.length !== vk.ic.length) {
            return false;
        }
        const icEqual = this.ic.every((ic, index) => ic.equals(vk.ic[index]));
        return (this.alpha1.equals(vk.alpha1) &&
            this.beta2.equals(vk.beta2) &&
            this.gamma2.equals(vk.gamma2) &&
            this.delta2.equals(vk.delta2) &&
            icEqual);
    }
    /**
     * Produce a copy of this verifying key
     * @returns the copy
     */
    copy() {
        const copyG2 = (point) => new maci_crypto_1.G2Point([BigInt(point.x[0].toString()), BigInt(point.x[1].toString())], [BigInt(point.y[0].toString()), BigInt(point.y[1].toString())]);
        return new VerifyingKey(new maci_crypto_1.G1Point(BigInt(this.alpha1.x.toString()), BigInt(this.alpha1.y.toString())), copyG2(this.beta2), copyG2(this.gamma2), copyG2(this.delta2), this.ic.map((c) => new maci_crypto_1.G1Point(BigInt(c.x.toString()), BigInt(c.y.toString()))));
    }
}
exports.VerifyingKey = VerifyingKey;
/**
 * Deserialize into a VerifyingKey instance
 * @param json the JSON representation
 * @returns the VerifyingKey
 */
VerifyingKey.fromJSON = (json) => {
    const data = JSON.parse(json);
    return VerifyingKey.fromObj(data);
};
/**
 * Convert an object representation to a VerifyingKey
 * @param data the object representation
 * @returns the VerifyingKey
 */
VerifyingKey.fromObj = (data) => {
    const alpha1 = new maci_crypto_1.G1Point(BigInt(data.vk_alpha_1[0]), BigInt(data.vk_alpha_1[1]));
    const beta2 = new maci_crypto_1.G2Point([BigInt(data.vk_beta_2[0][1]), BigInt(data.vk_beta_2[0][0])], [BigInt(data.vk_beta_2[1][1]), BigInt(data.vk_beta_2[1][0])]);
    const gamma2 = new maci_crypto_1.G2Point([BigInt(data.vk_gamma_2[0][1]), BigInt(data.vk_gamma_2[0][0])], [BigInt(data.vk_gamma_2[1][1]), BigInt(data.vk_gamma_2[1][0])]);
    const delta2 = new maci_crypto_1.G2Point([BigInt(data.vk_delta_2[0][1]), BigInt(data.vk_delta_2[0][0])], [BigInt(data.vk_delta_2[1][1]), BigInt(data.vk_delta_2[1][0])]);
    const ic = data.IC.map(([x, y]) => new maci_crypto_1.G1Point(BigInt(x), BigInt(y)));
    return new VerifyingKey(alpha1, beta2, gamma2, delta2, ic);
};
//# sourceMappingURL=verifyingKey.js.map