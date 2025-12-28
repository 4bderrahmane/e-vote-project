// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

/// @title SemaphoreElection contract interface.
interface IElection {

    error Semaphore__CallerIsNotTheElectionCoordinator();
    error Semaphore__MerkleTreeDepthIsNotSupported();
    error Semaphore__ElectionAlreadyExists();
    error Semaphore__ElectionNotFound();
    error Semaphore__ElectionHasAlreadyBeenStarted();
    error Semaphore__ElectionIsNotOngoing();
    error Semaphore__YouAreUsingTheSameNullifierTwice();
    error Semaphore__ElectionDoesNotExist();
    error Semaphore__InvalidCoordinator();

    enum ElectionState {
        Created,
        Ongoing,
        Ended
    }

    /// @dev Return-friendly view of an election (no mappings here).
    struct ElectionInfo {
        address coordinator;
        ElectionState state;
    }

    /// @dev Emitted when a new election is created.
    /// @param electionId: Id of the election.
    /// @param coordinator: Coordinator of the election.
    /// @param merkleTreeDepth: Depth of the tree.
    event ElectionCreated(uint256 indexed electionId, address indexed coordinator, uint8 merkleTreeDepth);

    /// @dev Emitted when an election is started.
    /// @param electionId: Id of the election.
    /// @param coordinator: Coordinator of the election.
    /// @param coordinatorPublicKey: Public key used to encrypt the election votes.
    event ElectionStarted(uint256 indexed electionId, address indexed coordinator, bytes coordinatorPublicKey);

    /// @dev Emitted when a user votes on an election.
    /// @param electionId: Id of the election.
    /// @param ciphertext: User encrypted vote.
    /// @param nullifierHash: Nullifier hash (prevents double-voting).
    event VoteAdded(uint256 indexed electionId, bytes ciphertext, uint256 nullifierHash);

    /// @dev Emitted when an election is ended.
    /// @param electionId: Id of the election.
    /// @param coordinator: Coordinator of the election.
    /// @param decryptionKey: Key to decrypt the election votes.
    event ElectionEnded(uint256 indexed electionId, address indexed coordinator, bytes decryptionKey);

    /// @dev Creates an election and the associated Merkle tree/group.
    /// @param electionId: Id of the election.
    /// @param coordinator: Coordinator of the election.
    /// @param merkleTreeDepth: Depth of the tree.
    function createElection(uint256 electionId, address coordinator, uint8 merkleTreeDepth) external;

    /// @dev Adds a voter to an election.
    /// @param electionId: Id of the election.
    /// @param identityCommitment: Identity commitment of the group member.
    function addVoter(uint256 electionId, uint256 identityCommitment) external;

    /// @dev Starts an election and publishes the key to encrypt the votes.
    /// @param electionId: Id of the election.
    /// @param coordinatorPublicKey: Public key to encrypt election votes.
    function startElection(uint256 electionId, bytes calldata coordinatorPublicKey) external;

    /// @dev Casts an anonymous vote in an election.
    /// @param ciphertext: Encrypted vote.
    /// @param nullifierHash: Nullifier hash.
    /// @param electionId: Id of the election.
    /// @param proof: Private zk-proof parameters.
    function castVote(uint256 electionId, bytes calldata ciphertext, uint256 nullifierHash, uint256[8] calldata proof) external;

    /// @dev Ends an election and publishes the key to decrypt the votes.
    /// @param electionId: Id of the election.
    /// @param decryptionKey: Key to decrypt election votes.
    function endElection(uint256 electionId, bytes calldata decryptionKey) external;

    /// @dev Gets an election id and returns the election data (view-only).
    /// @param electionId: Id of the election.
    function getElection(uint256 electionId) external view returns (ElectionInfo memory);

    /// @dev Checks if a nullifier hash has already been used in an election.
    /// @param electionId: Id of the election.
    /// @param nullifierHash: Nullifier hash.
    function isNullifierUsed(uint256 electionId, uint256 nullifierHash) external view returns (bool);
}
