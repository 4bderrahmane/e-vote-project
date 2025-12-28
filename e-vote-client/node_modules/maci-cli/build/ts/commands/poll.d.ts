import type { IGetPollArgs, IGetPollData } from "../utils/interfaces";
/**
 * Get deployed poll from MACI contract
 * @param {IGetPollArgs} args - The arguments for the get poll command
 * @returns {IGetPollData} poll data
 */
export declare const getPoll: ({ maciAddress, signer, provider, pollId, quiet, }: IGetPollArgs) => Promise<IGetPollData>;
//# sourceMappingURL=poll.d.ts.map