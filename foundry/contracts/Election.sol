// SPDX-License-Identifier: MIT
pragma solidity >=0.8.23 <0.9.0;

import "./interfaces/IElection.sol";
import "./interfaces/IGroth16Verifier.sol";
import "@semaphore-protocol/contracts/base/SemaphoreGroups.sol";

contract Election is IElection, SemaphoreGroups {
    uint256 public constant MAX_CIPHERTEXT_BYTES = 1024;

    IGroth16Verifier private immutable _verifier;

    address public immutable override coordinator;
    uint256 public immutable override externalNullifier;
    uint256 public immutable override endTime;
    bytes32 public immutable override encryptionPublicKey;

    ElectionPhase public override state;
    uint256 public override startTime;
    uint256 public override ballotCount;

    // Tracks whether a nullifier has already been used in this election.
    // In your current circuit, the nullifier is produced inside the proof as:
    // Poseidon(scope, secret)
    mapping(uint256 => bool) private usedNullifiers;

    /// @dev Checks if the election coordinator is the transaction sender.
    modifier onlyCoordinator() {
        if (msg.sender != coordinator) revert Election__CallerIsNotCoordinator();
        _;
    }

    /// @dev Initializes the Semaphore verifier used to verify the user's ZK proofs.
    constructor(
        IGroth16Verifier verifier_,
        address coordinator_,
        uint256 externalNullifier_,
        uint256 endTime_,
        bytes32 encryptionPublicKey_
    ) {
        if (address(verifier_) == address(0) || address(verifier_).code.length == 0) {
            revert Election__InvalidVerifier();
        }
        if (coordinator_ == address(0)) revert Election__InvalidCoordinator();
        if (externalNullifier_ == 0) revert Election__InvalidExternalNullifier();
        if (endTime_ <= block.timestamp) revert Election__InvalidEndTime();
        if (encryptionPublicKey_ == bytes32(0)) revert Election__InvalidEncryptionPublicKey();

        _verifier = verifier_;
        coordinator = coordinator_;
        externalNullifier = externalNullifier_;
        endTime = endTime_;
        encryptionPublicKey = encryptionPublicKey_;
        state = ElectionPhase.REGISTRATION;

        // In your current model, the same value is used as:
        // 1) the Semaphore group id
        // 2) the nullifier scope / external nullifier domain

        // In this model, we'll use the semaphore group the same as the nullifier scope / nullifier domain
        _createGroup(externalNullifier_, coordinator_);
    }

    function verifier() external view override returns (address) {
        return address(_verifier);
    }

    function addVoter(uint256 identityCommitment) external override onlyCoordinator {
        _requireRegistrationOpen();
        _addVoterInternal(identityCommitment);
    }

    function addVoters(uint256[] calldata identityCommitments) external override onlyCoordinator {
        _requireRegistrationOpen();

        uint256 length = identityCommitments.length;
        for (uint256 i = 0; i < length; ++i) {
            _addVoterInternal(identityCommitments[i]);
        }
    }

    function startElection() external override onlyCoordinator {
        if (state != ElectionPhase.REGISTRATION) revert Election__NotInRegistrationPhase();
        if (block.timestamp >= endTime) revert Election__VotingWindowElapsed();

        startTime = block.timestamp;
        state = ElectionPhase.VOTING;

        emit ElectionStarted(msg.sender, startTime, endTime);
    }

    function castVote(bytes calldata ciphertext, uint256 nullifier, uint256[8] calldata proof) external override {
        if (state != ElectionPhase.VOTING) revert Election__NotInVotingPhase();
        if (block.timestamp >= endTime) revert Election__ElectionHasEnded();
        if (ciphertext.length == 0) revert Election__EmptyCiphertext();
        if (ciphertext.length > MAX_CIPHERTEXT_BYTES) revert Election__CiphertextTooLarge();
        if (usedNullifiers[nullifier]) revert Election__NullifierAlreadyUsed();

        uint256 merkleTreeRoot = getMerkleTreeRoot(externalNullifier);

        // The client exposes unhashed `message` and `scope` in the proof DTO, but
        // @semaphore-protocol/proof feeds hash(message) and hash(scope) to the
        // circuit, where hash(x) = uint256(keccak256(bytes32(x))) >> 8.
        //
        // The client first binds the ballot by setting:
        //   message = uint256(keccak256(ciphertext)) >> 8
        //
        // Keep the old direct signal mapping here as a reference. It is wrong for
        // @semaphore-protocol/proof v4 because it skips the package-level hash():
        //
        //   [merkleTreeRoot, nullifier, message, externalNullifier]
        uint256 message = _hashBytesToField(ciphertext);
        uint256 proofMessage = _hashFieldToSemaphoreSignal(message);
        uint256 proofScope = _hashFieldToSemaphoreSignal(externalNullifier);

        // Old verifier call, kept commented for reference:
        //
        // bool verified = _verifier.verifyProof(
        //     [proof[0], proof[1]],
        //     [[proof[2], proof[3]], [proof[4], proof[5]]],
        //     [proof[6], proof[7]],
        //     [merkleTreeRoot, nullifier, message, externalNullifier]
        // );

        bool verified = _verifier.verifyProof(
            [proof[0], proof[1]],
            [[proof[2], proof[3]], [proof[4], proof[5]]],
            [proof[6], proof[7]],
            [merkleTreeRoot, nullifier, proofMessage, proofScope]
        );

        if (!verified) revert Election__InvalidProof();

        usedNullifiers[nullifier] = true;
        ballotCount += 1;

        emit VoteAdded(keccak256(ciphertext), nullifier, ciphertext);
    }

    function endElection(bytes calldata decryptionMaterial) external override onlyCoordinator {
        if (state != ElectionPhase.VOTING) revert Election__NotInVotingPhase();
        if (block.timestamp < endTime) revert Election__ElectionHasNotEndedYet();

        state = ElectionPhase.TALLY;

        emit ElectionEnded(msg.sender, decryptionMaterial);
    }

    function isNullifierUsed(uint256 nullifier) external view override returns (bool) {
        return usedNullifiers[nullifier];
    }

    function _addVoterInternal(uint256 identityCommitment) internal {
        if (hasMember(externalNullifier, identityCommitment)) {
            revert Election__MemberAlreadyExists();
        }

        _addMember(externalNullifier, identityCommitment);
    }

    function _requireRegistrationOpen() internal view {
        if (state != ElectionPhase.REGISTRATION) revert Election__NotInRegistrationPhase();
        if (block.timestamp >= endTime) revert Election__VotingWindowElapsed();
    }

    /// @dev Same convention for ciphertext binding.
    /// keccak256(bytes) >> 8
    /// This keeps the value safely inside the BN254 field expected by Groth16 public signals.
    function _hashBytesToField(bytes calldata data) internal pure returns (uint256) {
        return uint256(keccak256(data)) >> 8;
    }

    /// @dev Matches @semaphore-protocol/proof hash.ts: keccak256(toBeHex(value, 32)) >> 8.
    function _hashFieldToSemaphoreSignal(uint256 value) internal pure returns (uint256) {
        return uint256(keccak256(abi.encodePacked(value))) >> 8;
    }
}
