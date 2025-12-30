// SPDX-License-Identifier: MIT
pragma solidity >=0.8.23 <0.9.0;

import "../interfaces/IElection.sol";
import "@semaphore-protocol/contracts/base/SemaphoreGroups.sol";
import "@semaphore-protocol/contracts/interfaces/ISemaphoreVerifier.sol";
import "@semaphore-protocol/contracts/interfaces/ISemaphore.sol";
/// @title Semaphore voting contract (single election instance).
/// @notice It allows users to vote anonymously in an election.
contract Election is IElection, SemaphoreGroups {

    ISemaphoreVerifier public verifier;
    address public coordinator;
    ElectionState public state;
    
    /// @dev this the scope and it's the electionId (UUID) fetched from backend
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
    /// @param _externalNullifier: External nullifier for this election.
    constructor(ISemaphoreVerifier _verifier, address _coordinator, uint256 _externalNullifier) {
        verifier = _verifier;
        coordinator = _coordinator;
        externalNullifier = _externalNullifier;
        state = ElectionState.Created;

        _createGroup(_externalNullifier, _coordinator);
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

    // /// @dev See {IElection-castVote}.
    // function castVote(bytes calldata ciphertext, uint256 nullifierHash, uint256[8] calldata proof) public override {
    //     if (state != ElectionState.Ongoing) {
    //         revert Semaphore__ElectionIsNotOngoing();
    //     }

    //     if (nullifierHashes[nullifierHash]) {
    //         revert Semaphore__YouAreUsingTheSameNullifierTwice();
    //     }

    //     uint256 merkleTreeDepth = getMerkleTreeDepth(externalNullifier);
    //     uint256 merkleTreeRoot = getMerkleTreeRoot(externalNullifier);
    //     uint256 signal = uint256(keccak256(ciphertext)) >> 8;

    //     verifier.verifyProof(merkleTreeRoot, nullifierHash, signal, externalNullifier, proof, merkleTreeDepth);

    //     nullifierHashes[nullifierHash] = true;

    //     emit VoteAdded(ciphertext, nullifierHash);
    // }

    function castVote(
        bytes calldata ciphertext,
        ISemaphore.SemaphoreProof calldata proof
    ) external override {
        if (state != ElectionState.Ongoing) revert Semaphore__ElectionIsNotOngoing();

        // Bind proof to *this* election
        if (proof.scope != externalNullifier) revert Semaphore__InvalidProof();

        // Bind proof to the ciphertext you emit
        uint256 message = uint256(keccak256(ciphertext));
        if (proof.message != message) revert Semaphore__InvalidProof();

        // One vote per identity per scope
        if (nullifierHashes[proof.nullifier]) revert Semaphore__YouAreUsingTheSameNullifierTwice();

        uint256 depth = getMerkleTreeDepth(externalNullifier);
        uint256 root  = getMerkleTreeRoot(externalNullifier);

        // (Optional but sensible) ensure the proof is for the current root
        if (proof.merkleTreeRoot != root) revert Semaphore__InvalidProof();
        if (proof.merkleTreeDepth != depth) revert Semaphore__InvalidProof();

        uint256[4] memory pubSignals = [
            proof.merkleTreeRoot,
            proof.nullifier,
            _hashToField(proof.message),
            _hashToField(proof.scope)
        ];

        uint256[2] memory pA = [proof.points[0], proof.points[1]];
        uint256[2][2] memory pB = [
            [proof.points[2], proof.points[3]],
            [proof.points[4], proof.points[5]]
        ];
        uint256[2] memory pC = [proof.points[6], proof.points[7]];

        bool ok = verifier.verifyProof(pA, pB, pC, pubSignals, depth);
        if (!ok) revert Semaphore__InvalidProof();

        nullifierHashes[proof.nullifier] = true;
        emit VoteAdded(ciphertext, proof.nullifier);
    }

    function endElection(bytes calldata decryptionKey) public override onlyCoordinator {
        if (state != ElectionState.Ongoing) {
            revert Semaphore__ElectionIsNotOngoing();
        }

        state = ElectionState.Ended;

        emit ElectionEnded(msg.sender, decryptionKey);
    }

    function isNullifierUsed(uint256 nullifierHash) external view override returns (bool) {
        return nullifierHashes[nullifierHash];
    }
}
