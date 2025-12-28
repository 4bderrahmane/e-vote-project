"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.publishBatch = exports.publish = void 0;
const typechain_types_1 = require("maci-contracts/typechain-types");
const maci_core_1 = require("maci-core");
const maci_crypto_1 = require("maci-crypto");
const maci_domainobjs_1 = require("maci-domainobjs");
const banner_1 = require("../utils/banner");
const contracts_1 = require("../utils/contracts");
const salt_1 = require("../utils/salt");
const theme_1 = require("../utils/theme");
/**
 * Publish a new message to a MACI Poll contract
 * @param PublishArgs - The arguments for the publish command
 * @returns The ephemeral private key used to encrypt the message
 */
const publish = async ({ pubkey, stateIndex, voteOptionIndex, nonce, pollId, newVoteWeight, maciAddress, salt, privateKey, signer, quiet = true, }) => {
    (0, banner_1.banner)(quiet);
    // validate that the pub key of the user is valid
    if (!maci_domainobjs_1.PubKey.isValidSerializedPubKey(pubkey)) {
        (0, theme_1.logError)("invalid MACI public key");
    }
    // deserialize
    const userMaciPubKey = maci_domainobjs_1.PubKey.deserialize(pubkey);
    if (!(await (0, contracts_1.contractExists)(signer.provider, maciAddress))) {
        (0, theme_1.logError)("MACI contract does not exist");
    }
    if (!maci_domainobjs_1.PrivKey.isValidSerializedPrivKey(privateKey)) {
        (0, theme_1.logError)("Invalid MACI private key");
    }
    const userMaciPrivKey = maci_domainobjs_1.PrivKey.deserialize(privateKey);
    // validate args
    if (voteOptionIndex < 0) {
        (0, theme_1.logError)("invalid vote option index");
    }
    // check < 1 cause index zero is a blank state leaf
    if (stateIndex < 1) {
        (0, theme_1.logError)("invalid state index");
    }
    if (nonce < 0) {
        (0, theme_1.logError)("invalid nonce");
    }
    if (salt && !(0, salt_1.validateSalt)(salt)) {
        (0, theme_1.logError)("Invalid salt");
    }
    const userSalt = salt ? BigInt(salt) : (0, maci_crypto_1.genRandomSalt)();
    if (pollId < 0) {
        (0, theme_1.logError)("Invalid poll id");
    }
    const maciContract = typechain_types_1.MACI__factory.connect(maciAddress, signer);
    const pollContracts = await maciContract.getPoll(pollId);
    if (!(await (0, contracts_1.contractExists)(signer.provider, pollContracts.poll))) {
        (0, theme_1.logError)("Poll contract does not exist");
    }
    const pollContract = typechain_types_1.Poll__factory.connect(pollContracts.poll, signer);
    const treeDepths = await pollContract.treeDepths();
    const coordinatorPubKeyResult = await pollContract.coordinatorPubKey();
    const maxVoteOptions = Number(BigInt(maci_core_1.MESSAGE_TREE_ARITY) ** treeDepths.voteOptionTreeDepth);
    // validate the vote options index against the max leaf index on-chain
    if (maxVoteOptions < voteOptionIndex) {
        (0, theme_1.logError)("Invalid vote option index");
    }
    const coordinatorPubKey = new maci_domainobjs_1.PubKey([
        BigInt(coordinatorPubKeyResult.x.toString()),
        BigInt(coordinatorPubKeyResult.y.toString()),
    ]);
    const encKeypair = new maci_domainobjs_1.Keypair();
    // create the command object
    const command = new maci_domainobjs_1.PCommand(stateIndex, userMaciPubKey, voteOptionIndex, newVoteWeight, nonce, BigInt(pollId), userSalt);
    // sign the command with the user private key
    const signature = command.sign(userMaciPrivKey);
    // encrypt the command using a shared key between the user and the coordinator
    const message = command.encrypt(signature, maci_domainobjs_1.Keypair.genEcdhSharedKey(encKeypair.privKey, coordinatorPubKey));
    try {
        // submit the message onchain as well as the encryption public key
        const tx = await pollContract.publishMessage(message.asContractParam(), encKeypair.pubKey.asContractParam());
        const receipt = await tx.wait();
        if (receipt?.status !== 1) {
            (0, theme_1.logError)("Transaction failed");
        }
        (0, theme_1.logYellow)(quiet, (0, theme_1.info)(`Transaction hash: ${receipt.hash}`));
        (0, theme_1.logGreen)(quiet, (0, theme_1.info)(`Ephemeral private key: ${encKeypair.privKey.serialize()}`));
    }
    catch (error) {
        (0, theme_1.logError)(error.message);
    }
    // we want the user to have the ephemeral private key
    return encKeypair.privKey.serialize();
};
exports.publish = publish;
/**
 * Batch publish new messages to a MACI Poll contract
 * @param {IPublishBatchArgs} args - The arguments for the publish command
 * @returns {IPublishBatchData} The ephemeral private key used to encrypt the message, transaction hash
 */
const publishBatch = async ({ messages, pollId, maciAddress, publicKey, privateKey, signer, quiet = true, }) => {
    (0, banner_1.banner)(quiet);
    if (!maci_domainobjs_1.PubKey.isValidSerializedPubKey(publicKey)) {
        throw new Error("invalid MACI public key");
    }
    if (!maci_domainobjs_1.PrivKey.isValidSerializedPrivKey(privateKey)) {
        throw new Error("invalid MACI private key");
    }
    if (pollId < 0n) {
        throw new Error(`invalid poll id ${pollId}`);
    }
    const userMaciPubKey = maci_domainobjs_1.PubKey.deserialize(publicKey);
    const userMaciPrivKey = maci_domainobjs_1.PrivKey.deserialize(privateKey);
    const maciContract = typechain_types_1.MACI__factory.connect(maciAddress, signer);
    const pollContracts = await maciContract.getPoll(pollId);
    const pollContract = typechain_types_1.Poll__factory.connect(pollContracts.poll, signer);
    const [treeDepths, coordinatorPubKeyResult] = await Promise.all([
        pollContract.treeDepths(),
        pollContract.coordinatorPubKey(),
    ]);
    const maxVoteOptions = Number(BigInt(maci_core_1.MESSAGE_TREE_ARITY) ** treeDepths.voteOptionTreeDepth);
    // validate the vote options index against the max leaf index on-chain
    messages.forEach(({ stateIndex, voteOptionIndex, salt, nonce }) => {
        if (voteOptionIndex < 0 || maxVoteOptions < voteOptionIndex) {
            throw new Error("invalid vote option index");
        }
        // check < 1 cause index zero is a blank state leaf
        if (stateIndex < 1) {
            throw new Error("invalid state index");
        }
        if (nonce < 0) {
            throw new Error("invalid nonce");
        }
        if (salt && !(0, salt_1.validateSalt)(salt)) {
            throw new Error("invalid salt");
        }
    });
    const coordinatorPubKey = new maci_domainobjs_1.PubKey([
        BigInt(coordinatorPubKeyResult.x.toString()),
        BigInt(coordinatorPubKeyResult.y.toString()),
    ]);
    const encryptionKeypair = new maci_domainobjs_1.Keypair();
    const sharedKey = maci_domainobjs_1.Keypair.genEcdhSharedKey(encryptionKeypair.privKey, coordinatorPubKey);
    const payload = messages.map(({ salt, stateIndex, voteOptionIndex, newVoteWeight, nonce }) => {
        const userSalt = salt ? BigInt(salt) : (0, maci_crypto_1.genRandomSalt)();
        // create the command object
        const command = new maci_domainobjs_1.PCommand(stateIndex, userMaciPubKey, voteOptionIndex, newVoteWeight, nonce, BigInt(pollId), userSalt);
        // sign the command with the user private key
        const signature = command.sign(userMaciPrivKey);
        const message = command.encrypt(signature, sharedKey);
        return [message.asContractParam(), encryptionKeypair.pubKey.asContractParam()];
    });
    const preparedMessages = payload.map(([message]) => message);
    const preparedKeys = payload.map(([, key]) => key);
    const receipt = await pollContract
        .publishMessageBatch(preparedMessages.reverse(), preparedKeys.reverse())
        .then((tx) => tx.wait());
    return {
        hash: receipt?.hash,
        encryptedMessages: preparedMessages,
        privateKey: encryptionKeypair.privKey.serialize(),
    };
};
exports.publishBatch = publishBatch;
//# sourceMappingURL=publish.js.map