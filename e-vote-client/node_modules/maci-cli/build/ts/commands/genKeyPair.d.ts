import type { IGenKeypairArgs } from "../utils/interfaces";
/**
 * Generate a new Maci Key Pair
 * and print it to the screen
 * @param {IGenKeypairArgs} args - keypair generation params
 * @returns - keypair
 */
export declare const genKeyPair: ({ seed, quiet }: IGenKeypairArgs) => {
    publicKey: string;
    privateKey: string;
};
//# sourceMappingURL=genKeyPair.d.ts.map