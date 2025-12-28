#!/usr/bin/env node
/**
 * @module @zk-kit/artifacts
 * @version 2.0.1
 * @file Utilities for downloading snark artifacts
 * @copyright Ethereum Foundation 2024
 * @license MIT
 * @see [Github]{@link https://github.com/privacy-scaling-explorations/snark-artifacts/tree/main/packages/artifacts}
*/
import { Command, Argument } from '@commander-js/extra-typings';
import { error } from 'node:console';
import { cwd, exit, chdir } from 'node:process';
import ora from 'ora';
import { existsSync, createWriteStream, readFileSync, writeFileSync } from 'node:fs';
import { extname, dirname } from 'node:path';
import { mkdir } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import input from '@inquirer/input';
import select from '@inquirer/select';
import { Circomkit } from 'circomkit';
import { Writable } from 'node:stream';

const spinner = ora();

var Project;
(function (Project) {
    Project["POSEIDON"] = "poseidon";
    // RLN = 'rln',
    Project["SEMAPHORE"] = "semaphore";
    Project["SEMAPHORE_IDENTITY"] = "semaphore-identity";
})(Project || (Project = {}));
const projects = Object.values(Project).sort();
async function getAvailableVersions(project) {
    const res = await fetch(`https://registry.npmjs.org/@zk-kit/${project}-artifacts`);
    const { versions } = await res.json();
    return Object.keys(versions);
}

var CliError;
(function (CliError) {
    CliError["EMPTY"] = "Input cannot be empty, try again";
    CliError["INVALID_JSON_FILE"] = "Invalid json file, try again";
    CliError["FILE_DOES_NOT_EXIST"] = "File does not exist, try again";
    CliError["INVALID_PROJECT"] = "Invalid project, try again";
    CliError["NOT_AN_INTEGER"] = "Input must be an integer, try again";
})(CliError || (CliError = {}));

function validateFilePath(input) {
    if (!existsSync(input))
        return CliError.FILE_DOES_NOT_EXIST;
    return true;
}
function validateJsonFileInput(input) {
    if (!(extname(input) === '.json'))
        return CliError.INVALID_JSON_FILE;
    return validateFilePath(input);
}
function validateNonEmptyInput(input) {
    if (input.length === 0)
        return CliError.EMPTY;
    return true;
}
const validateProject = (project) => {
    if (!projects.includes(project))
        return CliError.INVALID_PROJECT;
    return true;
};
function validateOrThrow(parameter, validate) {
    if (parameter !== undefined) {
        const trueOrError = validate(parameter);
        if (typeof trueOrError === 'string')
            throw new Error(trueOrError);
    }
}

async function download$1(url, outputPath) {
    const { body, ok, statusText } = await fetch(url);
    if (!ok)
        throw new Error(`Failed to fetch ${url}: ${statusText}`);
    if (!body)
        throw new Error('Failed to get response body');
    const dir = dirname(outputPath);
    await mkdir(dir, { recursive: true });
    const fileStream = createWriteStream(outputPath);
    const reader = body.getReader();
    try {
        const pump = async () => {
            const { done, value } = await reader.read();
            if (done) {
                fileStream.end();
                return;
            }
            fileStream.write(Buffer.from(value));
            await pump();
        };
        await pump();
    }
    catch (error) {
        fileStream.close();
        throw error;
    }
}
async function maybeDownload(url, outputPath) {
    if (!existsSync(outputPath))
        await download$1(url, outputPath);
    return outputPath;
}

const BASE_URL = 'https://snark-artifacts.pse.dev';
const getBaseUrl = (project, version) => `${BASE_URL}/${project}/${version}/${project}`;

async function maybeGetSnarkArtifacts$1(project, options = {}) {
    if (!projects.includes(project))
        throw new Error(`Project '${project}' is not supported`);
    options.version ??= 'latest';
    const url = getBaseUrl(project, options.version);
    const parameters = options.parameters ? `-${options.parameters.join('-')}` : '';
    return {
        wasm: `${url}${parameters}.wasm`,
        zkey: `${url}${parameters}.zkey`,
    };
}

const extractEndPath = (url) => url.split('pse.dev/')[1];
/**
 * Downloads SNARK artifacts (`wasm` and `zkey`) files if not already present in OS tmp folder.
 * @example
 * ```ts
 * {
 *   wasm: "/tmp/@zk-kit/semaphore-artifacts@latest/semaphore-3.wasm",
 *   zkey: "/tmp/@zk-kit/semaphore-artifacts@latest/semaphore-3.zkey" .
 * }
 * ```
 * @returns {@link SnarkArtifacts}
 */
async function maybeGetSnarkArtifacts(...pars) {
    const urls = await maybeGetSnarkArtifacts$1(...pars);
    const outputPath = `${tmpdir()}/snark-artifacts/${extractEndPath(urls.wasm)}`;
    const [wasm, zkey] = await Promise.all([
        maybeDownload(urls.wasm, outputPath),
        maybeDownload(urls.zkey, outputPath.replace(/.wasm$/, '.zkey')),
    ]);
    return {
        wasm,
        zkey,
    };
}

const getProjectInput = async () => select({
    message: 'Select a project:',
    choices: projects.map((project) => ({ name: project, value: project })),
});
const getParametersInput = async () => {
    const args = await input({
        message: 'Enter the arguments of the circuit you want to download artifacts for:',
        validate: validateNonEmptyInput,
    });
    return args.split(' ');
};

const download = new Command('download')
    .alias('d')
    .description('Download all available artifacts for a given project')
    .addArgument(new Argument('<project>', 'Project name').argOptional().choices(projects))
    .option('-p,--parameters <params...>', 'Parameters of the circuit you want to download artifacts for')
    .action(async (project, { parameters }) => {
    // TODO prompt for inputs that were not provided
    validateOrThrow(project, validateProject);
    project ??= await getProjectInput();
    if ([Project.SEMAPHORE, Project.POSEIDON].includes(project)) {
        validateOrThrow(parameters, validateNonEmptyInput);
        parameters ??= await getParametersInput();
    }
    spinner.start();
    try {
        const { wasm, zkey } = await maybeGetSnarkArtifacts(project, { parameters });
        spinner.succeed();
        console.log(`Artifacts downloaded at:\n  ${wasm}\n  ${zkey}`);
    }
    catch (error) {
        spinner.fail(error.message);
    }
});

const getCircomkitConfigInput = async () => input({
    message: 'Enter the source circomkit file path:',
    default: 'circomkit.json',
    validate: validateJsonFileInput,
});
const getDestinationInput = async (defaultDestination) => input({
    message: 'Enter the destination path for the generated artifacts:',
    default: defaultDestination,
});
const selectCircuit = async (circuits) => select({
    message: 'Select the circuit to generate snark artifacts for:',
    choices: circuits.map((circuit) => ({ name: circuit, value: circuit })),
});

class SilentStream extends Writable {
    _write(_chunk, _encoding, callback) {
        // Discard chunk
        callback();
    }
}
async function setup(circuit, params, config, dirBuild) {
    // parse circomkit.json
    let circomkitConfig = JSON.parse(readFileSync(config, 'utf8'));
    chdir(dirname(config));
    // parse circuits.json
    const circuitsConfig = JSON.parse(readFileSync(circomkitConfig.circuits, 'utf8'));
    circuit ??= await selectCircuit(Object.keys(circuitsConfig));
    const { params: defaultParams } = circuitsConfig[circuit];
    let { circuits } = circomkitConfig;
    if (params !== undefined && params.length > 0) {
        circuits = `${tmpdir}/${[circuit, ...params, 'circuits'].join('-')}.json`;
        dirBuild += `/${[circuit, ...params].join('-')}`;
        writeFileSync(circuits, JSON.stringify({ ...circuitsConfig, [circuit]: { ...circuitsConfig[circuit], params } }), 'utf8');
    }
    // override circomkit config options
    circomkitConfig = { ...circomkitConfig, circuits, dirBuild };
    const circomkit = new Circomkit(circomkitConfig);
    // temporarily redirect stdout to make all circomkit logs silent
    const write = process.stdout.write;
    const silentStream = new SilentStream();
    // @ts-ignore
    process.stdout.write = silentStream.write.bind(silentStream);
    await circomkit.setup(circuit).finally(() => {
        process.stdout.write = write;
    });
    return { circuit, params: params ?? defaultParams };
}
async function generateActionNoExit(circuit, params, { config, destination }) {
    validateOrThrow(config, validateJsonFileInput);
    validateOrThrow(destination, existsSync);
    config ??= await getCircomkitConfigInput();
    const dirBuild = destination ?? (await getDestinationInput(`${cwd()}/snark-artifacts`));
    const result = await setup(circuit, params, config, dirBuild);
    spinner.succeed(`Snark artifacts for ${circuit ?? result.circuit} with parameters ${params ?? result.params} generated successfully in ${dirBuild}`);
}
async function generateAction(...params) {
    await generateActionNoExit(...params);
    exit(0);
}

const generate = new Command('generate').alias('g').description('Generate snark artifacts for a given source circom circuit').option('-c, --config <path>', 'Path to circomkit configuration file')
    .option('-d, --destination <path>', 'Destination directory for the generated artifacts')
    .argument('[circuit]', 'Circuit to generate snark artifacts for')
    .argument('[params...]', 'Circuit parameters override')
    .action(generateAction);

async function generateBatch$1(optionsPath, destination) {
    const options = JSON.parse(readFileSync(optionsPath, 'utf8'));
    spinner.start();
    for (const [config, { circuit, paramsList }] of Object.entries(options))
        for (const params of paramsList)
            await generateActionNoExit(circuit, params, { config, destination });
    spinner.succeed(`All snark artifacts generated successfully in ${destination}`);
    exit(0);
}

const generateBatch = new Command('generate-batch')
    .alias('gb')
    .description('Generate snark artifacts for a list of circom circuits')
    .argument('<optionsPath>', 'Path to the options definition json file: { [circomkitJsonPath]: { circuit:string, params: string[][] }}')
    .argument('<destination>', 'Destination directory for the generated artifacts')
    .action(generateBatch$1);

const list = new Command('list')
    .alias('l')
    .description('List all projects and their available packages versions')
    .action(async () => {
    spinner.start();
    let output = '';
    for (const project of projects) {
        output += `${project}\n`;
        try {
            const versions = await getAvailableVersions(project);
            for (const version of versions)
                output += `  ${version}\n`;
        }
        catch (error) {
            spinner.fail(error.message);
            exit(1);
        }
    }
    spinner.succeed();
    console.log(output);
});

var COMMANDS = [download, generate, generateBatch, list];

class Cli {
    cli;
    constructor() {
        this.cli = new Command();
        this.build();
    }
    build() {
        for (const command of COMMANDS)
            this.cli.addCommand(command);
    }
    async run(args) {
        await this.cli.parseAsync(args);
    }
}
const run = async () => new Cli().run(process.argv).catch((err) => {
    error(err);
    exit(1);
});

run();
