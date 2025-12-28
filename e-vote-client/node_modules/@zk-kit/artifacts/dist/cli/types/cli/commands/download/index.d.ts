import { Command } from '@commander-js/extra-typings';
import { Project } from '../../../projects';
export declare const download: Command<[Project | undefined], {
    parameters?: string[] | undefined;
}>;
