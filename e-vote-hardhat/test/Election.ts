import fs from "node:fs/promises";
import path from "node:path";
import { expect } from "chai";
import { network } from "hardhat";
import type {
  BytesLike,
  Contract,
  ContractTransactionResponse,
  InterfaceAbi,
  Signer,
} from "ethers";

const { ethers } = await network.connect();
const POSEIDON_T3 = "npm/poseidon-solidity@0.0.5/PoseidonT3.sol:PoseidonT3";
const [POSEIDON_T3_SOURCE, POSEIDON_T3_NAME] = POSEIDON_T3.split(":");

let cachedPoseidonArtifact: { abi: InterfaceAbi; bytecode: string } | undefined;

type ElectionContract = Contract & {
  verifier(): Promise<string>;
  coordinator(): Promise<string>;
  externalNullifier(): Promise<bigint>;
  endTime(): Promise<bigint>;
  encryptionPublicKey(): Promise<string>;
  state(): Promise<bigint>;
  addVoter(identityCommitment: bigint): Promise<ContractTransactionResponse>;
  startElection(): Promise<ContractTransactionResponse>;
  castVote(
    ciphertext: BytesLike,
    nullifierHash: bigint,
    proof: readonly bigint[]
  ): Promise<ContractTransactionResponse>;
  endElection(decryptionKey: BytesLike): Promise<ContractTransactionResponse>;
  isNullifierUsed(nullifierHash: bigint): Promise<boolean>;
  hasMember(groupId: bigint, identityCommitment: bigint): Promise<boolean>;
  connect(signer: Signer): ElectionContract;
};

type MockSemaphoreVerifierContract = Contract & {
  setShouldVerify(shouldVerify: boolean): Promise<ContractTransactionResponse>;
  connect(signer: Signer): MockSemaphoreVerifierContract;
};

describe("Election", function () {
  async function deployPoseidonT3() {
    const [deployer] = await ethers.getSigners();
    const { abi, bytecode } = await loadPoseidonArtifact();
    const PoseidonT3 = new ethers.ContractFactory(abi, bytecode, deployer);
    return PoseidonT3.deploy();
  }

  async function loadPoseidonArtifact() {
    if (cachedPoseidonArtifact) {
      return cachedPoseidonArtifact;
    }

    const buildInfoDir = path.join(process.cwd(), "artifacts", "build-info");
    const entries = await fs.readdir(buildInfoDir);

    for (const entry of entries) {
      if (!entry.endsWith(".output.json") && !entry.endsWith(".json")) {
        continue;
      }

      const buildInfoPath = path.join(buildInfoDir, entry);
      const buildInfo = JSON.parse(await fs.readFile(buildInfoPath, "utf8"));
      const poseidon =
        buildInfo?.output?.contracts?.[POSEIDON_T3_SOURCE]?.[POSEIDON_T3_NAME];

      if (poseidon?.abi && poseidon?.evm?.bytecode?.object) {
        const bytecodeObject = poseidon.evm.bytecode.object;
        const bytecode = bytecodeObject.startsWith("0x")
          ? bytecodeObject
          : `0x${bytecodeObject}`;

        const abi = poseidon.abi as InterfaceAbi;
        cachedPoseidonArtifact = { abi, bytecode };
        return cachedPoseidonArtifact;
      }
    }

    throw new Error(
      "PoseidonT3 build output not found in artifacts/build-info. Run `hardhat compile` first."
    );
  }

  async function deployElection() {
    const [coordinator, other] = await ethers.getSigners();

    const poseidonT3 = await deployPoseidonT3();

    const Verifier = await ethers.getContractFactory(
      "contracts/test/MockSemaphoreVerifier.sol:MockSemaphoreVerifier"
    );
    const verifier = (await Verifier.deploy()) as MockSemaphoreVerifierContract;

    const now = (await ethers.provider.getBlock("latest"))!.timestamp;
    const endTime = BigInt(now + 3600);
    const externalNullifier = 123n;
    const encryptionPublicKey = ethers.keccak256(ethers.toUtf8Bytes("pubkey"));

    const Election = await ethers.getContractFactory(
      "contracts/Election.sol:Election",
      {
        libraries: {
          [POSEIDON_T3]: poseidonT3.target,
        },
      }
    );
    const election = (await Election.deploy(
      verifier.target,
      coordinator.address,
      externalNullifier,
      endTime,
      encryptionPublicKey
    )) as ElectionContract;

    return {
      election,
      verifier,
      coordinator,
      other,
      externalNullifier,
      endTime,
      encryptionPublicKey,
    };
  }

  it("initializes constructor values", async function () {
    const {
      election,
      verifier,
      coordinator,
      externalNullifier,
      endTime,
      encryptionPublicKey,
    } = await deployElection();

    expect(await election.verifier()).to.equal(verifier.target);
    expect(await election.coordinator()).to.equal(coordinator.address);
    expect(await election.externalNullifier()).to.equal(externalNullifier);
    expect(await election.endTime()).to.equal(endTime);
    expect(await election.encryptionPublicKey()).to.equal(encryptionPublicKey);
    expect(await election.state()).to.equal(0n);
  });

  it("adds voters only during registration", async function () {
    const { election, other, externalNullifier } = await deployElection();
    const identityCommitment = 1n;

    await expect(
      election.connect(other).addVoter(identityCommitment)
    ).to.be.revertedWithCustomError(
      election,
      "Semaphore__CallerIsNotTheElectionCoordinator"
    );

    await election.addVoter(identityCommitment);
    expect(
      await election.hasMember(externalNullifier, identityCommitment)
    ).to.equal(true);

    await expect(
      election.addVoter(identityCommitment)
    ).to.be.revertedWithCustomError(election, "Semaphore__MemberAlreadyExists");
  });

  it("starts the election and locks registration", async function () {
    const { election, other, coordinator } = await deployElection();

    await expect(
      election.connect(other).startElection()
    ).to.be.revertedWithCustomError(
      election,
      "Semaphore__CallerIsNotTheElectionCoordinator"
    );

    await expect(election.startElection())
      .to.emit(election, "ElectionStarted")
      .withArgs(coordinator.address);

    expect(await election.state()).to.equal(1n);

    await expect(election.startElection()).to.be.revertedWithCustomError(
      election,
      "Semaphore__ElectionHasAlreadyBeenStarted"
    );
  });

  it("casts a vote", async function () {
    const { election } = await deployElection();
    const ciphertext = ethers.toUtf8Bytes("vote");
    const ciphertextHex = ethers.hexlify(ciphertext);
    const nullifierHash = 9n;
    const proof = Array(8).fill(0n);

    await election.startElection();

    await expect(election.castVote(ciphertext, nullifierHash, proof))
      .to.emit(election, "VoteAdded")
      .withArgs(ciphertextHex, nullifierHash);

    expect(await election.isNullifierUsed(nullifierHash)).to.equal(true);
  });

  it("rejects reused nullifiers", async function () {
    const { election } = await deployElection();
    const ciphertext = ethers.toUtf8Bytes("vote");
    const nullifierHash = 10n;
    const proof = Array(8).fill(0n);

    await election.startElection();

    await election.castVote(ciphertext, nullifierHash, proof);

    await expect(
      election.castVote(ciphertext, nullifierHash, proof)
    ).to.be.revertedWithCustomError(
      election,
      "Semaphore__YouAreUsingTheSameNullifierTwice"
    );
  });

  it("rejects invalid proofs", async function () {
    const { election, verifier } = await deployElection();
    const ciphertext = ethers.toUtf8Bytes("vote");
    const nullifierHash = 11n;
    const proof = Array(8).fill(0n);

    await election.startElection();

    await verifier.setShouldVerify(false);

    await expect(
      election.castVote(ciphertext, nullifierHash, proof)
    ).to.be.revertedWithCustomError(election, "Semaphore__InvalidProof");
  });

  it("ends the election after the end time", async function () {
    const { election, coordinator, endTime } = await deployElection();
    const decryptionKey = "0x1234";

    await election.startElection();

    await expect(
      election.endElection(decryptionKey)
    ).to.be.revertedWithCustomError(
      election,
      "Semaphore__ElectionHasNotEndedYet"
    );

    await ethers.provider.send("evm_setNextBlockTimestamp", [
      Number(endTime) + 1,
    ]);
    await ethers.provider.send("evm_mine", []);

    await expect(election.endElection(decryptionKey))
      .to.emit(election, "ElectionEnded")
      .withArgs(coordinator.address, decryptionKey);

    expect(await election.state()).to.equal(2n);
  });
});
