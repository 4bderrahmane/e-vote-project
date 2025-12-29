// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./Election.sol";
import "@semaphore-protocol/contracts/interfaces/ISemaphoreVerifier.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/// @title ElectionFactory
/// @notice Deploys one SemaphoreElectionInstance per election.

contract ElectionFactory is Ownable {
    error Factory__InvalidVerifier();
    error Factory__ElectionAlreadyExists();

    /// @dev Emitted when a new election instance is deployed.
    /// @param uuid: Off-chain UUID (bytes16).
    /// @param externalNullifier: External nullifier derived from uuid (field-friendly uint256).
    /// @param coordinator: Coordinator of this election (msg.sender).
    /// @param election: Deployed election contract address.

    event ElectionDeployed(
        bytes16 indexed uuid,
        uint256 indexed externalNullifier,
        address indexed coordinator,
        address election
    );

    /// @notice The Groth16 semaphore verifier contract address (shared by all elections).
    address public immutable verifier;

    /// @dev UUID -> election instance address.
    mapping(bytes16 => address) public electionByUuid;

    constructor(address verifier_) Ownable(msg.sender) {
        if (verifier_ == address(0)) revert Factory__InvalidVerifier();
        verifier = verifier_;
    }

    /// @notice Deploy a new election instance (coordinator is msg.sender).
    /// @dev This is function is gonna be called after the POST Request of creating the Election object in the backend.
    function createElection(bytes16 uuid) external onlyOwner returns (address election) {
        if (electionByUuid[uuid] != address(0)) revert Factory__ElectionAlreadyExists();

        // This is the ExternalNullfier (Scope) and it's gonna be hashed using keccak256 to it can be used a circuit public input
        uint256 externalNullifier = _hashToExternalNullifier(uuid);

        election = address(new Election(
            ISemaphoreVerifier(verifier),
            msg.sender,       // coordinator
            externalNullifier
        ));

        electionByUuid[uuid] = election;

        emit ElectionDeployed(uuid, externalNullifier, msg.sender, election);
    }

    /// @dev Hash bytes16 -> uint256 usable as a circuit public input (field-friendly).
    /// Using >> 8 keeps it under 248 bits (safe margin).
    function _hashToExternalNullifier(bytes16 uuid) internal pure returns (uint256) {
        return uint256(keccak256(abi.encodePacked(uuid))) >> 8;
    }
    function _hashToField(uint256 x) internal pure returns (uint256) {
        return uint256(keccak256(abi.encodePacked(x))) >> 8;
    }
}

// Add this import

// ...

