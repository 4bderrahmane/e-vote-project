// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "../interfaces/IElection.sol";
import "@semaphore-protocol/contracts/base/SemaphoreGroups.sol";
import "@semaphore-protocol/contracts/interfaces/ISemaphoreVerifier.sol";

/// @title Semaphore voting contract.
/// @notice It allows users to vote anonymously in an election.
/// @dev The following code allows you to create elections, add voters and allow them to vote anonymously.
contract SemaphoreElection is IElection, SemaphoreGroups {
    ISemaphoreVerifier public verifier;

    // Extra errors (not required to be in the interface for compilation).
    error Semaphore__ElectionDoesNotExist();
    error Semaphore__InvalidCoordinator();

    /// @dev Gets an election id and returns the election data.
    mapping(uint256 => ElectionInfo) internal elections;

    /// @dev Optional: store the public encryption key and final decryption key on-chain.
    mapping(uint256 => bytes) public encryptionPublicKeys;
    mapping(uint256 => bytes) public decryptionKeys;

    /// @dev Optional: store encrypted votes on-chain (you could also rely only on events).
    mapping(uint256 => bytes[]) internal encryptedVotes;

    /// @dev Checks if the election exists.
    modifier electionExists(uint256 electionId) {
        if (elections[electionId].coordinator == address(0)) {
            revert Semaphore__ElectionDoesNotExist();
        }
        _;
    }

    /// @dev Checks if the election coordinator is the transaction sender.
    /// @param electionId: Id of the election.
    modifier onlyCoordinator(uint256 electionId) {
        if (elections[electionId].coordinator == address(0)) {
            revert Semaphore__ElectionDoesNotExist();
        }
        if (elections[electionId].coordinator != msg.sender) {
            revert Semaphore__CallerIsNotTheElectionCoordinator();
        }
        _;
    }

    /// @dev Initializes the Semaphore verifier used to verify the user's ZK proofs.
    /// @param _verifier: Semaphore verifier address.
    constructor(ISemaphoreVerifier _verifier) {
        verifier = _verifier;
    }

    /// @dev See {ISemaphoreElection-createElection}.
    /// @param electionId: Id of the election.
    /// @param coordinator: Coordinator of the poll.
    /// @param merkleTreeDepth: The merkle tree depth.
    function createElection(
        uint256 electionId,
        address coordinator,
        uint256 merkleTreeDepth
    ) public override {
        if (coordinator == address(0)) {
            revert Semaphore__InvalidCoordinator();
        }
        if (elections[electionId].coordinator != address(0)) {
            revert Semaphore__ElectionAlreadyExists();
        }

        // If your SemaphoreGroups version supports custom depths, keep this and pass depth to _createGroup.
        if (merkleTreeDepth < 16 || merkleTreeDepth > 32) {
            revert Semaphore__MerkleTreeDepthIsNotSupported();
        }

        // SemaphoreGroups (recent versions) uses _createGroup(groupId, admin) :contentReference[oaicite:2]{index=2}
        // Set admin = address(this) so nobody can bypass your state checks by calling base functions directly.
        _createGroup(electionId, address(this));

        // If you are on an older SemaphoreGroups that supports depth, it may be:
        // _createGroup(electionId, merkleTreeDepth, address(this));
        // (Adjust to your installed version.)

        elections[electionId].coordinator = coordinator;
        elections[electionId].state = ElectionState.Created;

        emit ElectionCreated(electionId, coordinator);
    }

    /// @dev See {ISemaphoreElection-addVoter}.
    function addVoter(
        uint256 electionId,
        uint256 identityCommitment
    ) public override onlyCoordinator(electionId) {
        if (elections[electionId].state != ElectionState.Created) {
            revert Semaphore__ElectionHasAlreadyBeenStarted();
        }

        _addMember(electionId, identityCommitment);
    }

    /// @dev See {ISemaphoreElection-startElection}.
    function startElection(
        uint256 electionId,
        uint256 encryptionPublicKey /* if you changed interface to bytes, change this param */
    ) public override onlyCoordinator(electionId) {
        if (elections[electionId].state != ElectionState.Created) {
            revert Semaphore__ElectionHasAlreadyBeenStarted();
        }

        elections[electionId].state = ElectionState.Ongoing;

        // If you changed your interface to bytes key, store it like this:
        // encryptionPublicKeys[electionId] = encryptionPublicKeyBytes;

        emit ElectionStarted(electionId, msg.sender, encryptionPublicKey);
    }

    /// @dev Hash bytes -> field element (safe approach: 248-bit value).
    /// This binds the proof's `signal` to your encrypted vote bytes.
    function _hashToSignal(bytes memory data) internal pure returns (uint256) {
        return uint256(keccak256(data)) >> 8;
    }

    /// @dev See {ISemaphoreElection-castVote}.
    /// NOTE: if you changed your interface to `bytes encryptedVote`, change the signature accordingly.
    function castVote(
        uint256 vote, // <- change to bytes if you want encrypted payloads on-chain
        uint256 nullifierHash,
        uint256 electionId,
        uint256[8] calldata proof
    ) public override electionExists(electionId) {
        if (elections[electionId].state != ElectionState.Ongoing) {
            revert Semaphore__ElectionIsNotOngoing();
        }

        if (elections[electionId].nullifierHashes[nullifierHash]) {
            revert Semaphore__YouAreUsingTheSameNullifierTwice();
        }

        uint256 merkleTreeDepth = getMerkleTreeDepth(electionId);
        uint256 merkleTreeRoot = getMerkleTreeRoot(electionId);

        // In ISemaphoreVerifier, `signal` is a uint256 field element :contentReference[oaicite:3]{index=3}
        // If you keep vote as uint256, you are assuming it's already the signal (hashed field).
        // If you switch to bytes encryptedVote, compute `signal = _hashToSignal(encryptedVote)` and pass it.
        verifier.verifyProof(
            merkleTreeRoot,
            nullifierHash,
            vote,
            electionId,
            proof,
            merkleTreeDepth
        );

        elections[electionId].nullifierHashes[nullifierHash] = true;

        emit VoteAdded(electionId, vote);
    }

    /// @dev See {ISemaphoreElection-endElection}.
    function endElection(
        uint256 electionId,
        uint256 decryptionKey // if you changed interface to bytes, change this param
    ) public override onlyCoordinator(electionId) {
        if (elections[electionId].state != ElectionState.Ongoing) {
            revert Semaphore__ElectionIsNotOngoing();
        }

        elections[electionId].state = ElectionState.Ended;

        // If you changed your interface to bytes key, store it like this:
        // decryptionKeys[electionId] = decryptionKeyBytes;

        emit ElectionEnded(electionId, msg.sender, decryptionKey);
    }
}
