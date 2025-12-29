// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "./Election.sol";
import "@semaphore-protocol/contracts/interfaces/ISemaphoreVerifier.sol";

/// @title ElectionFactory
/// @notice Deploys one SemaphoreElectionInstance per election.

contract ElectionFactory {
    error Factory__InvalidVerifier();
    error Factory__InvalidMerkleTreeDepth();
    error Factory__ElectionAlreadyExists();

    /// @dev Emitted when a new election instance is deployed.
    /// @param uuid: Off-chain UUID (bytes16).
    /// @param scope: External nullifier / scope derived from uuid (field-friendly uint256).
    /// @param coordinator: Coordinator of this election (msg.sender).
    /// @param election: Deployed election contract address.
    /// @param merkleTreeDepth: Merkle tree depth for this election.

    event ElectionDeployed(bytes16 indexed uuid, uint256 indexed scope, address indexed coordinator, address election, uint8 merkleTreeDepth);

    /// @notice The Groth16 semaphore verifier contract address (shared by all elections).
    address public immutable verifier;

    /// @dev UUID -> election instance address.
    mapping(bytes16 => address) public electionByUuid;

    constructor(address verifier_) {
        if (verifier_ == address(0)) revert Factory__InvalidVerifier();
        verifier = verifier_;
    }

    /// @notice Deploy a new election instance (coordinator is msg.sender).
    /// @dev This is function is gonna be called after the POST Request of creating the Election object in the backend.
    function createElection(bytes16 uuid, uint8 merkleTreeDepth) external returns (address election) {
        if (merkleTreeDepth < 16 || merkleTreeDepth > 32) revert Factory__InvalidMerkleTreeDepth();
        if (electionByUuid[uuid] != address(0)) revert Factory__ElectionAlreadyExists();

        // This is the ExternalNullfier (Scope) and it gonna be hashed using keccak256 to it can be used a circuit public input
        uint256 scope = _hashToScope(uuid);

        election = address(new Election(
            ISemaphoreVerifier(verifier),
            msg.sender,       // coordinator
            merkleTreeDepth,
            scope
        ));

        electionByUuid[uuid] = election;

        emit ElectionDeployed(uuid, scope, msg.sender, election, merkleTreeDepth);
    }

    /// @dev Hash bytes16 -> uint256 usable as a circuit public input (field-friendly).
    /// Using >> 8 keeps it under 248 bits (safe margin).
    function _hashToScope(bytes16 uuid) internal pure returns (uint256) {
        return uint256(keccak256(abi.encodePacked(uuid))) >> 8;
    }
}
