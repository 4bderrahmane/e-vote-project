import fs from "node:fs/promises";
import path from "node:path";
import { expect } from "chai";
import { network } from "hardhat";
import type {
  Contract,
  ContractTransactionResponse,
  InterfaceAbi,
  Signer,
} from "ethers";

const { ethers } = await network.connect();
const POSEIDON_T3 =
  "npm/poseidon-solidity@0.0.5/PoseidonT3.sol:PoseidonT3";
const [POSEIDON_T3_SOURCE, POSEIDON_T3_NAME] = POSEIDON_T3.split(":");
let cachedPoseidonArtifact:
  | { abi: InterfaceAbi; bytecode: string }
  | undefined;
type ElectionFactoryContract = Contract & {
  verifier(): Promise<string>;
  createElection(
    uuid: string,
    endTime: bigint,
    encryptionPublicKey: string,
  ): Promise<ContractTransactionResponse>;
  electionByUuid(uuid: string): Promise<string>;
  connect(signer: Signer): ElectionFactoryContract;
};
type ElectionContract = Contract & {
  coordinator(): Promise<string>;
  externalNullifier(): Promise<bigint>;
  endTime(): Promise<bigint>;
  encryptionPublicKey(): Promise<string>;
};

describe("ElectionFactory", function () {
  async function deployPoseidonT3() {
    const [deployer] = await ethers.getSigners();
    const { abi, bytecode } = await loadPoseidonArtifact();
    const PoseidonT3 = new ethers.ContractFactory(
      abi,
      bytecode,
      deployer,
    );
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
      "PoseidonT3 build output not found in artifacts/build-info. Run `hardhat compile` first.",
    );
  }

  async function deployFactory() {
    const [owner, other] = await ethers.getSigners();

    const poseidonT3 = await deployPoseidonT3();

    const Verifier = await ethers.getContractFactory(
      "contracts/test/MockSemaphoreVerifier.sol:MockSemaphoreVerifier"
    );
    const verifier = await Verifier.deploy();

    const Factory = await ethers.getContractFactory(
      "contracts/ElectionFactory.sol:ElectionFactory",
      {
        libraries: {
          [POSEIDON_T3]: poseidonT3.target,
        },
      }
    );
    const factory = (await Factory.deploy(
      verifier.target,
    )) as ElectionFactoryContract;

    return { factory, verifier, owner, other, poseidonT3 };
  }

  it("stores the verifier address", async function () {
    const { factory, verifier } = await deployFactory();
    expect(await factory.verifier()).to.equal(verifier.target);
  });

  it("reverts if deployed with a zero verifier", async function () {
    const poseidonT3 = await deployPoseidonT3();
    const Factory = await ethers.getContractFactory(
      "contracts/ElectionFactory.sol:ElectionFactory",
      {
        libraries: {
          [POSEIDON_T3]: poseidonT3.target,
        },
      }
    );

    await expect(
      Factory.deploy(ethers.ZeroAddress)
    ).to.be.revertedWithCustomError(Factory, "Factory__InvalidVerifier");
  });

  it("creates elections and stores the deployment", async function () {
    const { factory, owner, poseidonT3 } = await deployFactory();
    const now = (await ethers.provider.getBlock("latest"))!.timestamp;
    const endTime = BigInt(now + 3600);
    const uuid = ethers.hexlify(ethers.randomBytes(16));
    const encryptionPublicKey = ethers.keccak256(ethers.toUtf8Bytes("pubkey"));

    await expect(
      factory.createElection(uuid, endTime, encryptionPublicKey)
    ).to.emit(factory, "ElectionDeployed");

    const electionAddress = await factory.electionByUuid(uuid);
    expect(electionAddress).to.not.equal(ethers.ZeroAddress);

    const Election = await ethers.getContractFactory(
      "contracts/Election.sol:Election",
      {
        libraries: {
          [POSEIDON_T3]: poseidonT3.target,
        },
      }
    );
    const election = Election.attach(electionAddress) as ElectionContract;

    expect(await election.coordinator()).to.equal(owner.address);
    expect(await election.externalNullifier()).to.equal(BigInt(uuid));
    expect(await election.endTime()).to.equal(endTime);
    expect(await election.encryptionPublicKey()).to.equal(encryptionPublicKey);
  });

  it("prevents duplicate elections", async function () {
    const { factory } = await deployFactory();
    const now = (await ethers.provider.getBlock("latest"))!.timestamp;
    const endTime = BigInt(now + 3600);
    const uuid = ethers.hexlify(ethers.randomBytes(16));
    const encryptionPublicKey = ethers.keccak256(ethers.toUtf8Bytes("pubkey"));

    await factory.createElection(uuid, endTime, encryptionPublicKey);

    await expect(
      factory.createElection(uuid, endTime, encryptionPublicKey)
    ).to.be.revertedWithCustomError(factory, "Factory__ElectionAlreadyExists");
  });

  it("only owner can create elections", async function () {
    const { factory, other } = await deployFactory();
    const now = (await ethers.provider.getBlock("latest"))!.timestamp;
    const endTime = BigInt(now + 3600);
    const uuid = ethers.hexlify(ethers.randomBytes(16));
    const encryptionPublicKey = ethers.keccak256(ethers.toUtf8Bytes("pubkey"));

    await expect(
      factory.connect(other).createElection(uuid, endTime, encryptionPublicKey)
    ).to.be.revertedWithCustomError(factory, "OwnableUnauthorizedAccount");
  });
});
