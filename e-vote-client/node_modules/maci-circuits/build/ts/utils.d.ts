declare global {
    interface ITerminatable {
        terminate: () => Promise<unknown>;
    }
    var curve_bn128: ITerminatable | undefined;
    var curve_bls12381: ITerminatable | undefined;
}
/**
 * Check if we are running on an arm chip
 * @returns whether we are running on an arm chip
 */
export declare const isArm: () => boolean;
export declare const cleanThreads: () => Promise<void>;
//# sourceMappingURL=utils.d.ts.map