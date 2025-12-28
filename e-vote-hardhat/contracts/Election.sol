// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "../interfaces/IElection.sol";
import "@semaphore-protocol/contracts/base/SemaphoreGroups.sol";
import "@semaphore-protocol/contracts/interfaces/ISemaphoreVerifier.sol";

/// @title Semaphore voting contract.
/// @notice It allows users to vote anonymously in an election.
/// @dev The following code allows you to create elections, add voters and allow them to vote anonymously.
contract Election is IElection, SemaphoreGroups {
    ISemaphoreVerifier public verifier;

    /// @dev Gets an election id and returns the election data.
    mapping(uint256 => ElectionInfo) internal elections;


    /// @dev Checks if the election coordinator is the transaction sender.
    /// @param electionId: Id of the election.
    modifier onlyCoordinator(uint256 electionId) {
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

    // /// @dev See {ISemaphoreElection-createElection}.
    // /// @param electionId: Id of the election.
    // /// @param coordinator: Coordinator of the poll.
    // /// @param merkleTreeDepth: The merkle tree depth.
    // function createElection(uint256 electionId, address coordinator, uint256 merkleTreeDepth) public override {
    //     if (merkleTreeDepth < 16 || merkleTreeDepth > 32) {
    //         revert Semaphore__MerkleTreeDepthIsNotSupported();
    //     }

    //     _createGroup(electionId, merkleTreeDepth);

    //     elections[electionId].coordinator = coordinator;

    //     emit ElectionCreated(electionId, coordinator);
    // }

    /// @dev See {ISemaphoreVoting-addVoter}.

    function addVoter(uint256 electionId, uint256 identityCommitment) public override onlyCoordinator(electionId) {
        if (elections[electionId].state != ElectionState.Created) {
            revert Semaphore__ElectionHasAlreadyBeenStarted();
        }

        _addMember(electionId, identityCommitment);
    }

    /// @dev See {ISemaphoreVoting-addVoter}.
    function startElection(uint256 electionId, uint256 encryptionPublicKey) public override onlyCoordinator(electionId) {
        if (elections[electionId].state != ElectionState.Created) {
            revert Semaphore__ElectionHasAlreadyBeenStarted();
        }

        elections[electionId].state = ElectionState.Ongoing;

        emit ElectionStarted(electionId, msg.sender, encryptionPublicKey);
    }

    /// @dev See {ISemaphoreVoting-castVote}.
    function castVote(uint256 vote, uint256 nullifierHash, uint256 electionId, uint256[8] calldata proof) public override {
        if (elections[electionId].state != ElectionState.Ongoing) {
            revert Semaphore__ElectionIsNotOngoing();
        }

        if (elections[electionId].nullifierHashes[nullifierHash]) {
            revert Semaphore__YouAreUsingTheSameNullifierTwice();
        }

        uint256 merkleTreeDepth = getMerkleTreeDepth(electionId);
        uint256 merkleTreeRoot = getMerkleTreeRoot(electionId);

        verifier.verifyProof(merkleTreeRoot, nullifierHash, vote, electionId, proof, merkleTreeDepth);

        elections[electionId].nullifierHashes[nullifierHash] = true;

        emit VoteAdded(electionId, vote);
    }

    /// @dev See {ISemaphoreVoting-publishDecryptionKey}.
    function endElection(uint256 electionId, uint256 decryptionKey) public override onlyCoordinator(electionId) {
        if (elections[electionId].state != ElectionState.Ongoing) {
            revert Semaphore__ElectionIsNotOngoing();
        }

        elections[electionId].state = ElectionState.Ended;

        emit ElectionEnded(electionId, msg.sender, decryptionKey);
    }
}
