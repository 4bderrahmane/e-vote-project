// SPDX-License-Identifier: MIT
pragma solidity >=0.8.23 <0.9.0;

import {Test} from "forge-std/Test.sol";
import {ElectionFactory} from "../contracts/ElectionFactory.sol";
import {Election} from "../contracts/Election.sol";
import {IElection} from "../contracts/interfaces/IElection.sol";
import {MockGroth16Verifier} from "../contracts/test/MockGroth16Verifier.sol";

contract ElectionFactoryTest is Test {
    MockGroth16Verifier private verifier;
    ElectionFactory private factory;

    address private other = address(0xB0B);

    function setUp() public {
        verifier = new MockGroth16Verifier();
        factory = new ElectionFactory(address(verifier));
    }

    function test_StoresTheVerifierAddress() public view {
        assertEq(factory.verifier(), address(verifier));
    }

    function test_RevertsIfDeployedWithZeroVerifier() public {
        vm.expectRevert(ElectionFactory.Factory__InvalidVerifier.selector);
        new ElectionFactory(address(0));
    }

    function test_RevertsIfDeployedWithNonContractVerifier() public {
        vm.expectRevert(ElectionFactory.Factory__InvalidVerifier.selector);
        new ElectionFactory(address(0xDEAD));
    }

    function test_CreatesElectionsAndStoresTheDeployment() public {
        bytes16 uuid = bytes16(uint128(0x1234567890abcdef1122334455667788));
        uint256 endTime = block.timestamp + 1 hours;
        bytes32 encryptionPublicKey = keccak256("pubkey");

        vm.prank(other);
        address electionAddress = factory.createElection(uuid, endTime, encryptionPublicKey);

        assertTrue(electionAddress != address(0));
        assertEq(factory.electionByUuid(uuid), electionAddress);

        Election election = Election(electionAddress);
        assertEq(election.coordinator(), other);
        assertEq(election.externalNullifier(), uint256(uint128(uuid)));
        assertEq(election.endTime(), endTime);
        assertEq(election.encryptionPublicKey(), encryptionPublicKey);
    }

    function test_EmitsElectionDeployed() public {
        bytes16 uuid = bytes16(uint128(0xAABBCCDDEEFF00112233445566778899));
        uint256 endTime = block.timestamp + 2 hours;
        bytes32 encryptionPublicKey = keccak256("pubkey");
        uint256 externalNullifier = uint256(uint128(uuid));

        address predicted = vm.computeCreateAddress(address(factory), vm.getNonce(address(factory)));

        vm.expectEmit(true, true, true, true, address(factory));
        emit ElectionFactory.ElectionDeployed(uuid, externalNullifier, other, predicted, endTime);

        vm.prank(other);
        factory.createElection(uuid, endTime, encryptionPublicKey);
    }

    function test_PreventsDuplicateElections() public {
        bytes16 uuid = bytes16(uint128(0xDEADBEEFCAFEBABE0102030405060708));
        uint256 endTime = block.timestamp + 1 hours;
        bytes32 encryptionPublicKey = keccak256("pubkey");

        vm.prank(other);
        factory.createElection(uuid, endTime, encryptionPublicKey);

        vm.expectRevert(ElectionFactory.Factory__ElectionAlreadyExists.selector);
        factory.createElection(uuid, endTime, encryptionPublicKey);
    }

    function test_RevertsForZeroUuid() public {
        uint256 endTime = block.timestamp + 1 hours;
        bytes32 encryptionPublicKey = keccak256("pubkey");

        vm.expectRevert(ElectionFactory.Factory__InvalidUuid.selector);
        factory.createElection(bytes16(0), endTime, encryptionPublicKey);
    }

    function test_RevertsForZeroEncryptionPublicKey() public {
        bytes16 uuid = bytes16(uint128(0x11223344556677889900AABBCCDDEEFF));
        uint256 endTime = block.timestamp + 1 hours;

        vm.expectRevert(ElectionFactory.Factory__InvalidEncryptionPublicKey.selector);
        factory.createElection(uuid, endTime, bytes32(0));
    }
}
