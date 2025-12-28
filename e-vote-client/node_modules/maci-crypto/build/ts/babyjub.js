"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.genRandomBabyJubValue = exports.G2Point = exports.G1Point = void 0;
const assert_1 = __importDefault(require("assert"));
const crypto_1 = require("crypto");
const constants_1 = require("./constants");
/**
 * @notice A class representing a point on the first group (G1)
 * of the Jubjub curve
 */
class G1Point {
    /**
     * Create a new instance of G1Point
     * @param x the x coordinate
     * @param y the y coordinate
     */
    constructor(x, y) {
        (0, assert_1.default)(x < constants_1.SNARK_FIELD_SIZE && x >= 0, "G1Point x out of range");
        (0, assert_1.default)(y < constants_1.SNARK_FIELD_SIZE && y >= 0, "G1Point y out of range");
        this.x = x;
        this.y = y;
    }
    /**
     * Check whether two points are equal
     * @param pt the point to compare with
     * @returns whether they are equal or not
     */
    equals(pt) {
        return this.x === pt.x && this.y === pt.y;
    }
    /**
     * Return the point as a contract param in the form of an object
     * @returns the point as a contract param
     */
    asContractParam() {
        return {
            x: this.x.toString(),
            y: this.y.toString(),
        };
    }
}
exports.G1Point = G1Point;
/**
 * @notice A class representing a point on the second group (G2)
 * of the Jubjub curve. This is usually an extension field of the
 * base field of the curve.
 */
class G2Point {
    /**
     * Create a new instance of G2Point
     * @param x the x coordinate
     * @param y the y coordinate
     */
    constructor(x, y) {
        this.checkPointsRange(x, "x");
        this.checkPointsRange(y, "y");
        this.x = x;
        this.y = y;
    }
    /**
     * Check whether two points are equal
     * @param pt the point to compare with
     * @returns whether they are equal or not
     */
    equals(pt) {
        return this.x[0] === pt.x[0] && this.x[1] === pt.x[1] && this.y[0] === pt.y[0] && this.y[1] === pt.y[1];
    }
    /**
     * Return the point as a contract param in the form of an object
     * @returns the point as a contract param
     */
    asContractParam() {
        return {
            x: this.x.map((n) => n.toString()),
            y: this.y.map((n) => n.toString()),
        };
    }
    /**
     * Check whether the points are in range
     * @param x the x coordinate
     * @param type the type of the coordinate
     */
    checkPointsRange(x, type) {
        (0, assert_1.default)(x.every((n) => n < constants_1.SNARK_FIELD_SIZE && n >= 0), `G2Point ${type} out of range`);
    }
}
exports.G2Point = G2Point;
/**
 * Returns a BabyJub-compatible random value. We create it by first generating
 * a random value (initially 256 bits large) modulo the snark field size as
 * described in EIP197. This results in a key size of roughly 253 bits and no
 * more than 254 bits. To prevent modulo bias, we then use this efficient
 * algorithm:
 * http://cvsweb.openbsd.org/cgi-bin/cvsweb/~checkout~/src/lib/libc/crypt/arc4random_uniform.c
 * @returns A BabyJub-compatible random value.
 */
const genRandomBabyJubValue = () => {
    // Prevent modulo bias
    // const lim = BigInt('0x10000000000000000000000000000000000000000000000000000000000000000')
    // const min = (lim - SNARK_FIELD_SIZE) % SNARK_FIELD_SIZE
    const min = BigInt("6350874878119819312338956282401532410528162663560392320966563075034087161851");
    let privKey = constants_1.SNARK_FIELD_SIZE;
    do {
        const rand = BigInt(`0x${(0, crypto_1.randomBytes)(32).toString("hex")}`);
        if (rand >= min) {
            privKey = rand % constants_1.SNARK_FIELD_SIZE;
        }
    } while (privKey >= constants_1.SNARK_FIELD_SIZE);
    return privKey;
};
exports.genRandomBabyJubValue = genRandomBabyJubValue;
//# sourceMappingURL=babyjub.js.map