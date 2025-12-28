import type { IJsonBallot } from "./types";
/**
 * A Ballot represents a User's votes in a Poll, as well as their next valid
 * nonce.
 */
export declare class Ballot {
    votes: bigint[];
    nonce: bigint;
    voteOptionTreeDepth: number;
    /**
     * Create a new Ballot instance
     * @param _numVoteOptions How many vote options are available in the poll
     * @param _voteOptionTreeDepth The depth of the merkle tree holding the vote options
     */
    constructor(_numVoteOptions: number, _voteOptionTreeDepth: number);
    /**
     * Generate an hash of this ballot
     * @returns The hash of the ballot
     */
    hash: () => bigint;
    /**
     * Convert in a format suitable for the circuit
     * @returns the ballot as a BigInt array
     */
    asCircuitInputs: () => bigint[];
    /**
     * Convert in a an array of bigints
     * @notice this is the nonce and the root of the vote option tree
     * @returns the ballot as a bigint array
     */
    asArray: () => bigint[];
    /**
     * Create a deep clone of this Ballot
     * @returns a copy of the ballot
     */
    copy: () => Ballot;
    /**
     * Check if two ballots are equal (same votes and same nonce)
     * @param b - The ballot to compare with
     * @returns whether the two ballots are equal
     */
    equals(b: Ballot): boolean;
    /**
     * Generate a random ballot
     * @param numVoteOptions How many vote options are available
     * @param voteOptionTreeDepth How deep is the merkle tree holding the vote options
     * @returns a random Ballot
     */
    static genRandomBallot(numVoteOptions: number, voteOptionTreeDepth: number): Ballot;
    /**
     * Generate a blank ballot
     * @param numVoteOptions How many vote options are available
     * @param voteOptionTreeDepth How deep is the merkle tree holding the vote options
     * @returns a Blank Ballot object
     */
    static genBlankBallot(numVoteOptions: number, voteOptionTreeDepth: number): Ballot;
    /**
     * Serialize to a JSON object
     */
    toJSON(): IJsonBallot;
    /**
     * Deserialize into a Ballot instance
     * @param json - the json representation
     * @returns the deserialized object as a Ballot instance
     */
    static fromJSON(json: IJsonBallot): Ballot;
}
//# sourceMappingURL=ballot.d.ts.map