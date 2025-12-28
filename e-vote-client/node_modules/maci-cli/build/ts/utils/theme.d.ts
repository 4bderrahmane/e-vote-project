/**
 * Print red text to the console (fancy)
 * @param quiet - whether to print the text or not
 * @param text - the text to print
 */
export declare function logRed(quiet: boolean, text: string): void;
/**
 * Print green text to the console (fancy)
 * @param quiet - whether to print the text or not
 * @param text - the text to print
 */
export declare function logGreen(quiet: boolean, text: string): void;
/**
 * Print yellow text to the console (fancy)
 * @param quiet - whether to print the text or not
 * @param text - the text to print
 */
export declare function logYellow(quiet: boolean, text: string): void;
/**
 * Print magenta text to the console (fancy)
 * @param quiet - whether to print the text or not
 * @param text - the text to print
 */
export declare function logMagenta(quiet: boolean, text: string): void;
/**
 * create an info message
 * @param text - the text to print
 * @returns the text with a prefix
 */
export declare const info: (text: string) => string;
/**
 * create a success message
 * @param text - the text to print
 * @returns the text with a prefix
 */
export declare const success: (text: string) => string;
/**
 * create a success message
 * @param text - the text to print
 * @returns the text with a prefix
 */
export declare const warning: (text: string) => string;
/**
 * create an error message
 * @param text - the text to print
 * @returns the text with a prefix
 */
export declare const error: (text: string) => string;
/**
 * Log an error and throw an error
 * @param text
 */
export declare function logError(text: string): void;
//# sourceMappingURL=theme.d.ts.map