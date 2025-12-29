// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "../interfaces/IElection.sol";
import "@semaphore-protocol/contracts/base/SemaphoreGroups.sol";
import "@semaphore-protocol/contracts/interfaces/ISemaphoreVerifier.sol";

/// @title Semaphore voting contract (single election instance).
/// @notice It allows users to vote anonymously in an election.
contract Election is IElection, SemaphoreGroups {
    
    ISemaphoreVerifier public verifier;
    address public coordinator;
    ElectionState public state;
    uint256 public externalNullifier;

    /// @dev Tracks used nullifiers for this election.
    mapping(uint256 => bool) internal nullifierHashes;

    /// @dev Checks if the election coordinator is the transaction sender.
    modifier onlyCoordinator() {
        if (coordinator != msg.sender) {
            revert Semaphore__CallerIsNotTheElectionCoordinator();
        }

        _;
    }

    /// @dev Initializes the Semaphore verifier used to verify the user's ZK proofs.
    /// @param _verifier: Semaphore verifier address.
    /// @param _coordinator: Election coordinator address.
    /// @param _merkleTreeDepth: Merkle tree depth for the group.
    /// @param _externalNullifier: External nullifier for this election.
    constructor(ISemaphoreVerifier _verifier, address _coordinator, uint8 _merkleTreeDepth, uint256 _externalNullifier) {
        verifier = _verifier;
        coordinator = _coordinator;
        externalNullifier = _externalNullifier;
        state = ElectionState.Created;

        _createGroup(_externalNullifier, _merkleTreeDepth);
    }

    /// @dev See {IElection-addVoter}.
    function addVoter(uint256 identityCommitment) public override onlyCoordinator {
        if (state != ElectionState.Created) {
            revert Semaphore__ElectionHasAlreadyBeenStarted();
        }

        _addMember(externalNullifier, identityCommitment);
    }

    /// @dev See {IElection-startElection}.
    function startElection(bytes calldata coordinatorPublicKey) public override onlyCoordinator {
        if (state != ElectionState.Created) {
            revert Semaphore__ElectionHasAlreadyBeenStarted();
        }

        state = ElectionState.Ongoing;

        emit ElectionStarted(msg.sender, coordinatorPublicKey);
    }

    /// @dev See {IElection-castVote}.
    function castVote(bytes calldata ciphertext, uint256 nullifierHash, uint256[8] calldata proof) public override {
        if (state != ElectionState.Ongoing) {
            revert Semaphore__ElectionIsNotOngoing();
        }

        if (nullifierHashes[nullifierHash]) {
            revert Semaphore__YouAreUsingTheSameNullifierTwice();
        }

        uint256 merkleTreeDepth = getMerkleTreeDepth(externalNullifier);
        uint256 merkleTreeRoot = getMerkleTreeRoot(externalNullifier);
        uint256 signal = uint256(keccak256(ciphertext)) >> 8;

        verifier.verifyProof(merkleTreeRoot, nullifierHash, signal, externalNullifier, proof, merkleTreeDepth);

        nullifierHashes[nullifierHash] = true;

        emit VoteAdded(ciphertext, nullifierHash);
    }

    /// @dev See {IElection-endElection}.
    function endElection(bytes calldata decryptionKey) public override onlyCoordinator {
        if (state != ElectionState.Ongoing) {
            revert Semaphore__ElectionIsNotOngoing();
        }

        state = ElectionState.Ended;

        emit ElectionEnded(msg.sender, decryptionKey);
    }

    /// @dev See {IElection-isNullifierUsed}.
    function isNullifierUsed(uint256 nullifierHash) external view override returns (bool) {
        return nullifierHashes[nullifierHash];
    }
}
