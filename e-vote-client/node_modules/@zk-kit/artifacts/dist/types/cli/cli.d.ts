import { Command } from '@commander-js/extra-typings';
export declare class Cli {
    cli: Command;
    constructor();
    build(): void;
    run(args: string[]): Promise<void>;
}
export declare const run: () => Promise<void>;
