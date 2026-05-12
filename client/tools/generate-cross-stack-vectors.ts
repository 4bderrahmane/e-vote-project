import { createHash } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import * as path from "node:path";
import { fileURLToPath } from "node:url";

import { Group, type MerkleProof } from "@semaphore-protocol/group";
import { Identity } from "@semaphore-protocol/identity";
import { keccak256 } from "viem";

import {
    getSemaphoreSnarkArtifacts,
    SEMAPHORE_ARTIFACT_DEPTH,
} from "../src/semaphore/artifacts.js";
import {
    createElectionVoteProof,
    hashCiphertextToField,
} from "../src/semaphore/proof.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const clientRoot = path.resolve(__dirname, "..");
const outputPath = path.join(
    clientRoot,
    "src",
    "tests",
    "fixtures",
    "cross-stack-vectors.json"
);

const seedHexes = [
    "00".repeat(32),
    "01".repeat(32),
    "ff".repeat(32),
    "0123456789abcdef".repeat(4),
];

const proofCases = [
    {
        id: "semaphore-20-four-member-index-2-small-ciphertext",
        identitySeedIndex: 2,
        memberSeedIndexes: [0, 1, 2, 3],
        ciphertextHex: "0x01020304",
        externalNullifier: "42",
    },
    {
        id: "semaphore-20-four-member-index-1-json-like-ciphertext",
        identitySeedIndex: 1,
        memberSeedIndexes: [0, 1, 2, 3],
        ciphertextHex:
            "0x7b2263616e6469646174655075626c69634964223a22726961642d7361627469227d",
        externalNullifier: "340282366920938463463374607431768211455",
    },
] as const;

function toDecimal(value: bigint | number | string): string {
    return BigInt(value).toString(10);
}

function toBytes32Hex(value: bigint): `0x${string}` {
    if (value < 0n || value >= 1n << 256n) {
        throw new Error(`Value is outside uint256 range: ${value.toString()}`);
    }

    return `0x${value.toString(16).padStart(64, "0")}`;
}

function hashFieldToSemaphoreSignal(value: bigint): bigint {
    return BigInt(keccak256(toBytes32Hex(value))) >> 8n;
}

function padSiblings(siblings: readonly bigint[], depth: number): string[] {
    const out = siblings.map(toDecimal);

    while (out.length < depth) {
        out.push("0");
    }

    return out;
}

function cloneMerkleProof(proof: MerkleProof): MerkleProof {
    return {
        root: proof.root,
        leaf: proof.leaf,
        index: proof.index,
        siblings: [...proof.siblings],
    };
}

async function sha256File(filePath: string): Promise<string> {
    return createHash("sha256").update(await readFile(filePath)).digest("hex");
}

async function packageVersion(packageName: string): Promise<string> {
    const packageJsonPath = path.join(
        clientRoot,
        "node_modules",
        ...packageName.split("/"),
        "package.json"
    );
    const packageJson = JSON.parse(await readFile(packageJsonPath, "utf8")) as {
        version?: unknown;
    };

    if (typeof packageJson.version !== "string") {
        throw new TypeError(`Missing package version for ${packageName}`);
    }

    return packageJson.version;
}

function identityVector(seedHex: string) {
    const identity = new Identity(seedHex);

    return {
        seedHex,
        secretScalar: identity.secretScalar.toString(),
        publicKey: identity.publicKey.map((value) => value.toString()),
        commitment: identity.commitment.toString(),
    };
}

async function proofVector(proofCase: (typeof proofCases)[number]) {
    const identitySeedHex = seedHexes[proofCase.identitySeedIndex];
    const identity = new Identity(identitySeedHex);
    const memberCommitments = proofCase.memberSeedIndexes.map((index) => {
        return new Identity(seedHexes[index]).commitment;
    });
    const group = new Group(memberCommitments);
    const memberIndex = proofCase.memberSeedIndexes.indexOf(
        proofCase.identitySeedIndex
    );

    if (memberIndex < 0) {
        throw new Error(`Proof case ${proofCase.id} does not include identity member`);
    }

    const merkleProof = group.generateMerkleProof(memberIndex);
    const merkleProofLength = merkleProof.siblings.length;
    const ciphertextMessage = hashCiphertextToField(proofCase.ciphertextHex);
    const scope = BigInt(proofCase.externalNullifier);
    const proof = await createElectionVoteProof({
        identity,
        merkleProof: cloneMerkleProof(merkleProof),
        merkleDepth: SEMAPHORE_ARTIFACT_DEPTH,
        ciphertext: proofCase.ciphertextHex,
        externalNullifier: scope,
        snarkArtifacts: getSemaphoreSnarkArtifacts(),
    });
    const messageHash = hashFieldToSemaphoreSignal(BigInt(proof.message));
    const scopeHash = hashFieldToSemaphoreSignal(BigInt(proof.scope));

    return {
        id: proofCase.id,
        circuitDepth: SEMAPHORE_ARTIFACT_DEPTH,
        identity: {
            seedHex: identitySeedHex,
            secretScalar: identity.secretScalar.toString(),
            commitment: identity.commitment.toString(),
        },
        group: {
            memberCommitments: memberCommitments.map((value) => value.toString()),
            memberIndex,
            root: group.root.toString(),
        },
        merkleProof: {
            root: merkleProof.root.toString(),
            leaf: merkleProof.leaf.toString(),
            index: merkleProof.index,
            siblings: merkleProof.siblings.map(toDecimal),
            siblingsPaddedToCircuitDepth: padSiblings(
                merkleProof.siblings,
                SEMAPHORE_ARTIFACT_DEPTH
            ),
        },
        ballot: {
            ciphertextHex: proofCase.ciphertextHex,
            ciphertextMessage: ciphertextMessage.toString(),
            externalNullifier: proofCase.externalNullifier,
        },
        witnessInputs: {
            secret: identity.secretScalar.toString(),
            merkleProofLength,
            merkleProofIndex: merkleProof.index,
            merkleProofSiblings: padSiblings(
                merkleProof.siblings,
                SEMAPHORE_ARTIFACT_DEPTH
            ),
            message: messageHash.toString(),
            scope: scopeHash.toString(),
        },
        semaphoreProofDto: {
            merkleTreeDepth: proof.merkleTreeDepth,
            merkleTreeRoot: proof.merkleTreeRoot,
            nullifier: proof.nullifier,
            message: proof.message,
            scope: proof.scope,
            pointsLength: proof.points.length,
        },
        proofPublicSignals: {
            merkleTreeRoot: proof.merkleTreeRoot,
            nullifier: proof.nullifier,
            messageHash: messageHash.toString(),
            scopeHash: scopeHash.toString(),
            orderedForGroth16Verifier: [
                proof.merkleTreeRoot,
                proof.nullifier,
                messageHash.toString(),
                scopeHash.toString(),
            ],
        },
    };
}

async function main() {
    const artifacts = getSemaphoreSnarkArtifacts();
    const output = {
        schema: "privote-cross-stack-vectors-v1",
        notes: [
            "Groth16 proof points are intentionally omitted because they may be randomized.",
            "Compare deterministic identity values, witness inputs, nullifier, Merkle root, and public signals.",
        ],
        packages: {
            "@semaphore-protocol/identity": await packageVersion(
                "@semaphore-protocol/identity"
            ),
            "@semaphore-protocol/group": await packageVersion(
                "@semaphore-protocol/group"
            ),
            "@semaphore-protocol/proof": await packageVersion(
                "@semaphore-protocol/proof"
            ),
        },
        artifacts: {
            depth: SEMAPHORE_ARTIFACT_DEPTH,
            wasm: {
                path: path.relative(clientRoot, artifacts.wasm),
                sha256: await sha256File(artifacts.wasm),
            },
            zkey: {
                path: path.relative(clientRoot, artifacts.zkey),
                sha256: await sha256File(artifacts.zkey),
            },
        },
        identityVectors: seedHexes.map(identityVector),
        proofVectors: [] as Awaited<ReturnType<typeof proofVector>>[],
    };

    for (const proofCase of proofCases) {
        output.proofVectors.push(await proofVector(proofCase));
    }

    await mkdir(path.dirname(outputPath), { recursive: true });
    await writeFile(outputPath, `${JSON.stringify(output, null, 2)}\n`);

    console.log(`Wrote ${path.relative(clientRoot, outputPath)}`);
    console.log(`Identity vectors: ${output.identityVectors.length}`);
    console.log(`Proof vectors: ${output.proofVectors.length}`);
}

try {
    await main();
    process.exit(0);
} catch (error) {
    console.error(error);
    process.exit(1);
}
