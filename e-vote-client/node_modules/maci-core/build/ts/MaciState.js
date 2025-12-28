"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MaciState = void 0;
const maci_domainobjs_1 = require("maci-domainobjs");
const Poll_1 = require("./Poll");
const constants_1 = require("./utils/constants");
/**
 * A representation of the MACI contract.
 */
class MaciState {
    /**
     * Constructs a new MaciState object.
     * @param stateTreeDepth - The depth of the state tree.
     */
    constructor(stateTreeDepth) {
        // a MaciState can hold multiple polls
        this.polls = new Map();
        // the leaves of the state tree
        this.stateLeaves = [];
        this.numSignUps = 0;
        /**
         * Create a deep copy of the MaciState object.
         * @returns A new instance of the MaciState object with the same properties.
         */
        this.copy = () => {
            const copied = new MaciState(this.stateTreeDepth);
            copied.stateLeaves = this.stateLeaves.map((x) => x.copy());
            copied.polls = new Map(Array.from(this.polls, ([key, value]) => [key, value.copy()]));
            return copied;
        };
        /**
         * Check if the MaciState object is equal to another MaciState object.
         * @param m - The MaciState object to compare.
         * @returns True if the two MaciState objects are equal, false otherwise.
         */
        this.equals = (m) => {
            const result = this.stateTreeDepth === m.stateTreeDepth &&
                this.polls.size === m.polls.size &&
                this.stateLeaves.length === m.stateLeaves.length;
            if (!result) {
                return false;
            }
            for (let i = 0; i < this.polls.size; i += 1) {
                if (!this.polls.get(BigInt(i))?.equals(m.polls.get(BigInt(i)))) {
                    return false;
                }
            }
            for (let i = 0; i < this.stateLeaves.length; i += 1) {
                if (!this.stateLeaves[i].equals(m.stateLeaves[i])) {
                    return false;
                }
            }
            return true;
        };
        this.stateTreeDepth = stateTreeDepth;
        // we put a blank state leaf to prevent a DoS attack
        this.stateLeaves.push(maci_domainobjs_1.blankStateLeaf);
        // we need to increase the number of signups by one given
        // that we already added the blank leaf
        this.numSignUps += 1;
    }
    /**
     * Sign up a user with the given public key, initial voice credit balance, and timestamp.
     * @param pubKey - The public key of the user.
     * @param initialVoiceCreditBalance - The initial voice credit balance of the user.
     * @param timestamp - The timestamp of the sign-up.
     * @returns The index of the newly signed-up user in the state tree.
     */
    signUp(pubKey, initialVoiceCreditBalance, timestamp) {
        this.numSignUps += 1;
        const stateLeaf = new maci_domainobjs_1.StateLeaf(pubKey, initialVoiceCreditBalance, timestamp);
        return this.stateLeaves.push(stateLeaf.copy()) - 1;
    }
    /**
     * Deploy a new poll with the given parameters.
     * @param pollEndTimestamp - The Unix timestamp at which the poll ends.
     * @param treeDepths - The depths of the tree.
     * @param messageBatchSize - The batch size for processing messages.
     * @param coordinatorKeypair - The keypair of the MACI round coordinator.
     * @returns The index of the newly deployed poll.
     */
    deployPoll(pollEndTimestamp, treeDepths, messageBatchSize, coordinatorKeypair) {
        const poll = new Poll_1.Poll(pollEndTimestamp, coordinatorKeypair, treeDepths, {
            messageBatchSize,
            tallyBatchSize: constants_1.STATE_TREE_ARITY ** treeDepths.intStateTreeDepth,
        }, this);
        this.polls.set(BigInt(this.polls.size), poll);
        return BigInt(this.polls.size - 1);
    }
    /**
     * Deploy a null poll.
     */
    deployNullPoll() {
        this.polls.set(BigInt(this.polls.size), null);
    }
    /**
     * Serialize the MaciState object to a JSON object.
     * @returns A JSON object representing the MaciState object.
     */
    toJSON() {
        return {
            stateTreeDepth: this.stateTreeDepth,
            polls: Array.from(this.polls.values()).map((poll) => poll.toJSON()),
            stateLeaves: this.stateLeaves.map((leaf) => leaf.toJSON()),
            pollBeingProcessed: Boolean(this.pollBeingProcessed),
            currentPollBeingProcessed: this.currentPollBeingProcessed ? this.currentPollBeingProcessed.toString() : "",
            numSignUps: this.numSignUps,
        };
    }
    /**
     * Create a new MaciState object from a JSON object.
     * @param json - The JSON object representing the MaciState object.
     * @returns A new instance of the MaciState object with the properties from the JSON object.
     */
    static fromJSON(json) {
        const maciState = new MaciState(json.stateTreeDepth);
        // assign the json values to the new instance
        maciState.stateLeaves = json.stateLeaves.map((leaf) => maci_domainobjs_1.StateLeaf.fromJSON(leaf));
        maciState.pollBeingProcessed = json.pollBeingProcessed;
        maciState.currentPollBeingProcessed = BigInt(json.currentPollBeingProcessed);
        maciState.numSignUps = json.numSignUps;
        // re-generate the polls and set the maci state reference
        maciState.polls = new Map(json.polls.map((jsonPoll, index) => [BigInt(index), Poll_1.Poll.fromJSON(jsonPoll, maciState)]));
        return maciState;
    }
}
exports.MaciState = MaciState;
//# sourceMappingURL=MaciState.js.map