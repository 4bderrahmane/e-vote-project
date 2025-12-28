"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPoll = void 0;
const ethers_1 = require("ethers");
const typechain_types_1 = require("maci-contracts/typechain-types");
const banner_1 = require("../utils/banner");
const theme_1 = require("../utils/theme");
/**
 * Get deployed poll from MACI contract
 * @param {IGetPollArgs} args - The arguments for the get poll command
 * @returns {IGetPollData} poll data
 */
const getPoll = async ({ maciAddress, signer, provider, pollId, quiet = true, }) => {
    (0, banner_1.banner)(quiet);
    if (!signer && !provider) {
        (0, theme_1.logError)("No signer and provider are provided");
    }
    const maciContract = typechain_types_1.MACI__factory.connect(maciAddress, signer ?? provider);
    const id = pollId === undefined ? await maciContract.nextPollId().then((nextPollId) => nextPollId - 1n) : BigInt(pollId);
    if (id < 0n) {
        (0, theme_1.logError)(`Invalid poll id ${id}`);
    }
    const { poll: pollAddress, tally: tallyAddress } = await maciContract.polls(id);
    if (pollAddress === ethers_1.ZeroAddress || tallyAddress === ethers_1.ZeroAddress) {
        (0, theme_1.logError)(`MACI contract doesn't have any deployed poll ${id}`);
    }
    const pollContract = typechain_types_1.Poll__factory.connect(pollAddress, signer ?? provider);
    const [[deployTime, duration], mergedStateRoot] = await Promise.all([
        pollContract.getDeployTimeAndDuration(),
        pollContract.mergedStateRoot(),
    ]);
    const isMerged = mergedStateRoot !== BigInt(0);
    const numSignups = await (isMerged ? pollContract.numSignups() : maciContract.numSignUps());
    // get the poll mode
    const tallyContract = typechain_types_1.Tally__factory.connect(tallyAddress, signer ?? provider);
    const mode = await tallyContract.mode();
    (0, theme_1.logGreen)(quiet, (0, theme_1.success)([
        `ID: ${id}`,
        `Deploy time: ${new Date(Number(deployTime) * 1000).toString()}`,
        `End time: ${new Date(Number(deployTime + duration) * 1000).toString()}`,
        `Number of signups ${numSignups}`,
        `State tree merged: ${mergedStateRoot}`,
        `Mode: ${mode === 0n ? "Quadratic Voting" : "Non-Quadratic Voting"}`,
    ].join("\n")));
    return {
        id,
        address: pollAddress,
        deployTime,
        duration,
        numSignups,
        isMerged,
        mode,
    };
};
exports.getPoll = getPoll;
//# sourceMappingURL=poll.js.map