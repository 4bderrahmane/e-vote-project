// SPDX-License-Identifier: MIT
pragma solidity >=0.8.23 <0.9.0;

/// @title Election contract interface (single election instance).
interface IElection {

    error Semaphore__CallerIsNotTheElectionCoordinator();
    error Semaphore__ElectionHasAlreadyBeenStarted();
    error Semaphore__ElectionIsNotOngoing();
    error Semaphore__YouAreUsingTheSameNullifierTwice();
    error Semaphore__InvalidCoordinator();

    enum ElectionState {Created, Ongoing, Ended}

    // Events

    /// @dev Emitted when an election is started.
    /// @param coordinator: Coordinator of the election.
    /// @param coordinatorPublicKey: Public key used to encrypt the election votes.
    event ElectionStarted(address indexed coordinator, bytes coordinatorPublicKey);

    /// @dev Emitted when a user votes on an election.
    /// @param ciphertext: User encrypted vote.
    /// @param nullifierHash: Nullifier hash (prevents double-voting).
    event VoteAdded(bytes ciphertext, uint256 nullifierHash);

    /// @dev Emitted when an election is ended.
    /// @param coordinator: Coordinator of the election.
    /// @param decryptionKey: Key to decrypt the election votes.
    event ElectionEnded(address indexed coordinator, bytes decryptionKey);


    // Functions

    /// @dev Adds a voter to an election.
    /// @param identityCommitment: Identity commitment of the group member.
    function addVoter(uint256 identityCommitment) external;

    /// @dev Starts an election and publishes the key to encrypt the votes.
    /// @param coordinatorPublicKey: Public key to encrypt election votes.
    function startElection(bytes calldata coordinatorPublicKey) external;

    /// @dev Casts an anonymous vote in an election.
    /// @param ciphertext: Encrypted vote.
    /// @param nullifierHash: Nullifier hash.
    /// @param proof: Private zk-proof parameters.
    function castVote(bytes calldata ciphertext, uint256 nullifierHash, uint256[8] calldata proof) external;

    /// @dev Ends an election and publishes the key to decrypt the votes.
    /// @param decryptionKey: Key to decrypt election votes.
    function endElection(bytes calldata decryptionKey) external;

    /// @dev Checks if a nullifier hash has already been used in this election.
    /// @param nullifierHash: Nullifier hash.
    function isNullifierUsed(uint256 nullifierHash) external view returns (bool);
}
