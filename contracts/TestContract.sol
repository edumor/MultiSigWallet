// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

/**
 * @title TestContract
 * @author Eduardo Moreno
 * @notice A simple test contract for demonstrating multi-signature wallet functionality
 * @dev This contract provides functions to test transaction execution from MultiSigWallet
 */
contract TestContract {
    
    /// @notice Counter variable for testing state changes
    uint256 public i;

    /**
     * @notice Increments the counter by a specified amount
     * @dev This function is called by the multi-signature wallet for testing
     * @param j Amount to add to the counter
     */
    function callMe(uint256 j) public {
        i += j;
    }

    /**
     * @notice Returns encoded function call data for callMe function
     * @dev Used to generate transaction data for multi-signature wallet testing
     * @return Encoded function call data for callMe(123)
     */
    function getData() public pure returns (bytes memory) {
        return abi.encodeWithSignature("callMe(uint256)", 123);
    }
}