// SPDX-License-Identifier: MIT
pragma solidity >=0.8.23 <0.9.0;

contract MockGroth16Verifier {
    bool public shouldVerify = true;
    bool public shouldCheckPubSignals;
    uint256[4] public expectedPubSignals;

    function setShouldVerify(bool value) external {
        shouldVerify = value;
    }

    function setExpectedPubSignals(uint256[4] calldata pubSignals, bool enabled) external {
        expectedPubSignals[0] = pubSignals[0];
        expectedPubSignals[1] = pubSignals[1];
        expectedPubSignals[2] = pubSignals[2];
        expectedPubSignals[3] = pubSignals[3];
        shouldCheckPubSignals = enabled;
    }

    function verifyProof(
        uint256[2] calldata,
        uint256[2][2] calldata,
        uint256[2] calldata,
        uint256[4] calldata pubSignals
    )
        external
        view
        returns (bool)
    {
        // Old mock behavior, kept for reference:
        // return shouldVerify;
        if (!shouldVerify) {
            return false;
        }
        if (!shouldCheckPubSignals) {
            return true;
        }

        return pubSignals[0] == expectedPubSignals[0] && pubSignals[1] == expectedPubSignals[1]
            && pubSignals[2] == expectedPubSignals[2] && pubSignals[3] == expectedPubSignals[3];
    }
}
