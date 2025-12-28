/**
 * @module @zk-kit/artifacts
 * @version 2.0.1
 * @file Utilities for downloading snark artifacts
 * @copyright Ethereum Foundation 2024
 * @license MIT
 * @see [Github]{@link https://github.com/privacy-scaling-explorations/snark-artifacts/tree/main/packages/artifacts}
*/
'use strict';

var node_fs = require('node:fs');
var promises = require('node:fs/promises');
var node_path = require('node:path');
var node_os = require('node:os');

async function download(url, outputPath) {
    const { body, ok, statusText } = await fetch(url);
    if (!ok)
        throw new Error(`Failed to fetch ${url}: ${statusText}`);
    if (!body)
        throw new Error('Failed to get response body');
    const dir = node_path.dirname(outputPath);
    await promises.mkdir(dir, { recursive: true });
    const fileStream = node_fs.createWriteStream(outputPath);
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
    if (!node_fs.existsSync(outputPath))
        await download(url, outputPath);
    return outputPath;
}

exports.Project = void 0;
(function (Project) {
    Project["POSEIDON"] = "poseidon";
    // RLN = 'rln',
    Project["SEMAPHORE"] = "semaphore";
    Project["SEMAPHORE_IDENTITY"] = "semaphore-identity";
})(exports.Project || (exports.Project = {}));
const projects = Object.values(exports.Project).sort();

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
    const outputPath = `${node_os.tmpdir()}/snark-artifacts/${extractEndPath(urls.wasm)}`;
    const [wasm, zkey] = await Promise.all([
        maybeDownload(urls.wasm, outputPath),
        maybeDownload(urls.zkey, outputPath.replace(/.wasm$/, '.zkey')),
    ]);
    return {
        wasm,
        zkey,
    };
}

exports.download = download;
exports.maybeDownload = maybeDownload;
exports.maybeGetSnarkArtifacts = maybeGetSnarkArtifacts;
exports.projects = projects;
