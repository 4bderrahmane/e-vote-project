// SPDX-License-Identifier: MIT
pragma solidity >=0.8.23 <0.9.0;

import {Test} from "forge-std/Test.sol";
import {Election} from "../contracts/Election.sol";
import {IElection} from "../contracts/interfaces/IElection.sol";
import {IGroth16Verifier} from "../contracts/interfaces/IGroth16Verifier.sol";
import {MockGroth16Verifier} from "../contracts/test/MockGroth16Verifier.sol";

contract ElectionTest is Test {
    MockGroth16Verifier private verifier;
    Election private election;

    address private coordinator = address(0xA11CE);
    address private other = address(0xB0B);

    uint256 private externalNullifier = 123;
    uint256 private endTime;
    bytes32 private encryptionPublicKey = keccak256("pubkey");

    function setUp() public {
        endTime = block.timestamp + 1 hours;
        verifier = new MockGroth16Verifier();
        election = new Election(
            IGroth16Verifier(address(verifier)), coordinator, externalNullifier, endTime, encryptionPublicKey
        );
    }

    function test_InitializesConstructorValues() public view {
        assertEq(election.verifier(), address(verifier));
        assertEq(election.coordinator(), coordinator);
        assertEq(election.externalNullifier(), externalNullifier);
        assertEq(election.endTime(), endTime);
        assertEq(election.encryptionPublicKey(), encryptionPublicKey);
        assertEq(uint256(election.state()), uint256(IElection.ElectionPhase.REGISTRATION));
        assertEq(election.startTime(), 0);
        assertEq(election.ballotCount(), 0);
    }

    function test_AddsVotersOnlyDuringRegistration() public {
        uint256 identityCommitment = 1;

        vm.prank(other);
        vm.expectRevert(IElection.Election__CallerIsNotCoordinator.selector);
        election.addVoter(identityCommitment);

        vm.prank(coordinator);
        election.addVoter(identityCommitment);

        assertTrue(election.hasMember(externalNullifier, identityCommitment));

        vm.prank(coordinator);
        vm.expectRevert(IElection.Election__MemberAlreadyExists.selector);
        election.addVoter(identityCommitment);
    }

    function test_AddsMultipleVotersDuringRegistration() public {
        uint256[] memory identityCommitments = new uint256[](3);
        identityCommitments[0] = 1;
        identityCommitments[1] = 2;
        identityCommitments[2] = 3;

        vm.prank(coordinator);
        election.addVoters(identityCommitments);

        for (uint256 i = 0; i < identityCommitments.length; ++i) {
            assertTrue(election.hasMember(externalNullifier, identityCommitments[i]));
        }
    }

    function test_StartsTheElectionAndLocksRegistration() public {
        vm.prank(other);
        vm.expectRevert(IElection.Election__CallerIsNotCoordinator.selector);
        election.startElection();

        vm.expectEmit(true, false, false, true, address(election));
        emit IElection.ElectionStarted(coordinator, block.timestamp, endTime);

        vm.prank(coordinator);
        election.startElection();

        assertEq(uint256(election.state()), uint256(IElection.ElectionPhase.VOTING));
        assertEq(election.startTime(), block.timestamp);

        vm.prank(coordinator);
        vm.expectRevert(IElection.Election__NotInRegistrationPhase.selector);
        election.startElection();
    }

    function test_RejectsAddingVotersAfterTheElectionHasStarted() public {
        _startElection();

        vm.prank(coordinator);
        vm.expectRevert(IElection.Election__NotInRegistrationPhase.selector);
        election.addVoter(1);
    }

    function test_CastsAVote() public {
        bytes memory ciphertext = bytes("vote");
        bytes32 ciphertextHash = keccak256(ciphertext);
        uint256 nullifier = 9;
        uint256[8] memory proof;

        _startElection();

        vm.expectEmit(true, true, false, true, address(election));
        emit IElection.VoteAdded(ciphertextHash, nullifier, ciphertext);

        election.castVote(ciphertext, nullifier, proof);

        assertTrue(election.isNullifierUsed(nullifier));
        assertEq(election.ballotCount(), 1);
    }

    function test_PassesSemaphoreHashedPublicSignalsToVerifier() public {
        bytes memory ciphertext = bytes("vote");
        uint256 nullifier = 16;
        uint256[8] memory proof;

        _startElection();

        uint256 merkleTreeRoot = election.getMerkleTreeRoot(externalNullifier);
        uint256 message = _hashBytesToField(ciphertext);

        uint256[4] memory oldDirectPubSignals;
        oldDirectPubSignals[0] = merkleTreeRoot;
        oldDirectPubSignals[1] = nullifier;
        oldDirectPubSignals[2] = message;
        oldDirectPubSignals[3] = externalNullifier;

        verifier.setExpectedPubSignals(oldDirectPubSignals, true);

        vm.expectRevert(IElection.Election__InvalidProof.selector);
        election.castVote(ciphertext, nullifier, proof);

        uint256[4] memory semaphorePubSignals;
        semaphorePubSignals[0] = merkleTreeRoot;
        semaphorePubSignals[1] = nullifier;
        semaphorePubSignals[2] = _hashFieldToSemaphoreSignal(message);
        semaphorePubSignals[3] = _hashFieldToSemaphoreSignal(externalNullifier);

        verifier.setExpectedPubSignals(semaphorePubSignals, true);

        election.castVote(ciphertext, nullifier, proof);

        assertTrue(election.isNullifierUsed(nullifier));
    }

    function test_RejectsReusedNullifiers() public {
        bytes memory ciphertext = bytes("vote");
        uint256 nullifier = 10;
        uint256[8] memory proof;

        _startElection();
        election.castVote(ciphertext, nullifier, proof);

        vm.expectRevert(IElection.Election__NullifierAlreadyUsed.selector);
        election.castVote(ciphertext, nullifier, proof);
    }

    function test_RejectsInvalidProofs() public {
        bytes memory ciphertext = bytes("vote");
        uint256 nullifier = 11;
        uint256[8] memory proof;

        _startElection();
        verifier.setShouldVerify(false);

        vm.expectRevert(IElection.Election__InvalidProof.selector);
        election.castVote(ciphertext, nullifier, proof);
    }

    function test_RejectsVotingBeforeTheElectionStarts() public {
        bytes memory ciphertext = bytes("vote");
        uint256 nullifier = 12;
        uint256[8] memory proof;

        vm.expectRevert(IElection.Election__NotInVotingPhase.selector);
        election.castVote(ciphertext, nullifier, proof);
    }

    function test_RejectsEmptyCiphertext() public {
        uint256 nullifier = 13;
        uint256[8] memory proof;

        _startElection();

        vm.expectRevert(IElection.Election__EmptyCiphertext.selector);
        election.castVote("", nullifier, proof);
    }

    function test_RejectsOversizedCiphertext() public {
        bytes memory oversized = new bytes(election.MAX_CIPHERTEXT_BYTES() + 1);
        uint256 nullifier = 14;
        uint256[8] memory proof;

        _startElection();

        vm.expectRevert(IElection.Election__CiphertextTooLarge.selector);
        election.castVote(oversized, nullifier, proof);
    }

    function test_EndsTheElectionAfterTheEndTime() public {
        bytes memory decryptionMaterial = hex"1234";

        _startElection();

        vm.prank(coordinator);
        vm.expectRevert(IElection.Election__ElectionHasNotEndedYet.selector);
        election.endElection(decryptionMaterial);

        vm.warp(endTime + 1);

        vm.expectEmit(true, false, false, true, address(election));
        emit IElection.ElectionEnded(coordinator, decryptionMaterial);

        vm.prank(coordinator);
        election.endElection(decryptionMaterial);

        assertEq(uint256(election.state()), uint256(IElection.ElectionPhase.TALLY));
    }

    function test_RejectsVotingAfterTheEndTime() public {
        bytes memory ciphertext = bytes("vote");
        uint256 nullifier = 15;
        uint256[8] memory proof;

        _startElection();
        vm.warp(endTime + 1);

        vm.expectRevert(IElection.Election__ElectionHasEnded.selector);
        election.castVote(ciphertext, nullifier, proof);
    }

    function _startElection() private {
        vm.prank(coordinator);
        election.startElection();
    }

    function _hashBytesToField(bytes memory data) private pure returns (uint256) {
        return uint256(keccak256(data)) >> 8;
    }

    function _hashFieldToSemaphoreSignal(uint256 value) private pure returns (uint256) {
        return uint256(keccak256(abi.encodePacked(value))) >> 8;
    }
}
