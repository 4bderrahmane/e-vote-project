import { Command } from '@commander-js/extra-typings';
export declare const generate: Command<[string | undefined, string[]], {
    config?: string | undefined;
    destination?: string | undefined;
}>;
