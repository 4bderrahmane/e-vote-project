// SPDX-License-Identifier: MIT
pragma solidity >=0.8.23 <0.9.0;

import "@semaphore-protocol/contracts/interfaces/ISemaphoreVerifier.sol";

contract MockSemaphoreVerifier is ISemaphoreVerifier {
    bool public shouldVerify = true;

    function setShouldVerify(bool value) external {
        shouldVerify = value;
    }

    function verifyProof(
        uint[2] calldata,
        uint[2][2] calldata,
        uint[2] calldata,
        uint[4] calldata,
        uint
    ) external view override returns (bool) {
        return shouldVerify;
    }
}
