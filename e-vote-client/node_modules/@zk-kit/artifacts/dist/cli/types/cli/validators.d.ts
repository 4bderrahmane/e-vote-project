import { type Project } from '../projects';
import { CliError } from './errors';
export declare function validateFilePath(input: string): true | CliError.FILE_DOES_NOT_EXIST;
export declare function validateJsonFileInput(input: string): true | CliError.INVALID_JSON_FILE | CliError.FILE_DOES_NOT_EXIST;
export declare function validateNonEmptyInput(input: string | string[]): true | CliError.EMPTY;
export declare const validateProject: (project: Project) => true | CliError.INVALID_PROJECT;
export declare function validateOrThrow<T>(parameter: T | undefined, validate: (param: T) => boolean | CliError): void;
