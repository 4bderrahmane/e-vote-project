// SPDX-License-Identifier: MIT
pragma solidity >=0.8.23 <0.9.0;

import "../interfaces/IElection.sol";
import "@semaphore-protocol/contracts/base/SemaphoreGroups.sol";
import "@semaphore-protocol/contracts/interfaces/ISemaphoreVerifier.sol";

contract Election is IElection, SemaphoreGroups {

    ISemaphoreVerifier public immutable verifier;
    address public immutable coordinator;
    uint256 public immutable externalNullifier;
    uint256 public immutable endTime;
    ElectionPhase public state;
    mapping(uint256 => bool) internal nullifierHashes;

    bytes32 public immutable encryptionPublicKey;

    /// @dev Checks if the election coordinator is the transaction sender.
    modifier onlyCoordinator() {
        if (coordinator != msg.sender) revert Semaphore__CallerIsNotTheElectionCoordinator();
        _;
    }

    /// @dev Initializes the Semaphore verifier used to verify the user's ZK proofs.
    constructor(
        ISemaphoreVerifier _verifier,
        address _coordinator,
        uint256 _externalNullifier,
        uint256 _endTime,
        bytes32 _encryptionPublicKey
    ) {
        if (address(_verifier) == address(0) || address(_verifier).code.length == 0) {
            revert Semaphore__InvalidVerifier();
        }
        if (_coordinator == address(0)) revert Semaphore__InvalidCoordinator();
        if (_externalNullifier == 0) revert Semaphore__InvalidExternalNullifier();
        if (_endTime <= block.timestamp) revert Semaphore__InvalidEndTime();

        verifier = _verifier;
        coordinator = _coordinator;
        externalNullifier = _externalNullifier;
        endTime = _endTime;
        encryptionPublicKey = _encryptionPublicKey;
        state = ElectionPhase.REGISTRATION;

        _createGroup(_externalNullifier, _coordinator);
    }

    function addVoter(uint256 identityCommitment) external override onlyCoordinator {
        if (state != ElectionPhase.REGISTRATION) revert Semaphore__ElectionHasAlreadyBeenStarted();
        if (hasMember(externalNullifier, identityCommitment)) revert Semaphore__MemberAlreadyExists();

        _addMember(externalNullifier, identityCommitment);
    }

    function startElection() external override onlyCoordinator {
        if (state != ElectionPhase.REGISTRATION) revert Semaphore__ElectionHasAlreadyBeenStarted();
        // if (encryptionPublicKey.length == 0) revert Semaphore__InvalidCoordinatorPublicKey();

        // encryptionPublicKey = _encryptionPublicKey;
        state = ElectionPhase.VOTING;

        emit ElectionStarted(msg.sender);
    }

    function castVote(bytes calldata ciphertext, uint256 nullifierHash, uint256[8] calldata proof) external override {

        if (state != ElectionPhase.VOTING) revert Semaphore__ElectionIsNotOngoing();
        if (block.timestamp >= endTime) revert Semaphore__ElectionHasEnded();
        if (nullifierHashes[nullifierHash]) revert Semaphore__YouAreUsingTheSameNullifierTwice();

        uint256 merkleTreeDepth = getMerkleTreeDepth(externalNullifier);
        uint256 merkleTreeRoot = getMerkleTreeRoot(externalNullifier);

        // IMPORTANT: bind the proof to the ciphertext via a deterministic signal.
        // Off-chain must use the same signal when generating the Semaphore proof.
        // This matches Semaphore's hash-to-field convention: keccak256(bytes) >> 8.
        uint256 signal = _hashBytes(ciphertext);

        bool verified = verifier.verifyProof(
            [proof[0], proof[1]],
            [[proof[2], proof[3]], [proof[4], proof[5]]],
            [proof[6], proof[7]],
            [merkleTreeRoot, nullifierHash, signal, _hash(externalNullifier)],
            merkleTreeDepth
        );

        if (!verified) revert Semaphore__InvalidProof();

        nullifierHashes[nullifierHash] = true;
        emit VoteAdded(ciphertext, nullifierHash);
    }

    function endElection(bytes calldata decryptionKey) external override onlyCoordinator {
        if (state != ElectionPhase.VOTING) revert Semaphore__ElectionIsNotOngoing();
        if (block.timestamp < endTime) revert Semaphore__ElectionHasNotEndedYet();

        state = ElectionPhase.TALLY;
        emit ElectionEnded(msg.sender, decryptionKey);
    }

    function isNullifierUsed(uint256 nullifierHash) external view override returns (bool) {
        return nullifierHashes[nullifierHash];
    }

    function _hash(uint256 message) private pure returns (uint256) {
        return uint256(keccak256(abi.encodePacked(message))) >> 8;
    }

    function _hashBytes(bytes calldata data) private pure returns (uint256) {
        return uint256(keccak256(data)) >> 8;
    }
}
