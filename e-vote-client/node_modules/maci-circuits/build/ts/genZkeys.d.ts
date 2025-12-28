/**
 * Generate the zkeys for MACI's circuits using circomkit
 * @dev This should only be used for testing purposes, or to generate the genesis zkey
 * for a new trusted setup ceremony. Never use zkeys that have not undergone a ceremony
 * in production.
 * @param outPath - the path to the output folder
 */
export declare const generateZkeys: (outputPath?: string) => Promise<void>;
//# sourceMappingURL=genZkeys.d.ts.map