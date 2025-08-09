// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

/**
 * @title OracleReceiver
 * @dev Simple oracle receiver contract for AI-Carbon Wallet
 * @notice Receives and stores energy data from trusted oracles
 */
contract OracleReceiver {
    address public trustedSigner;
    string public latestOracleData;
    uint256 public lastUpdateTimestamp;
    
    event OracleDataUpdated(string data, uint256 timestamp, address updatedBy);
    
    constructor(address _trustedSigner) {
        trustedSigner = _trustedSigner;
        latestOracleData = "";
        lastUpdateTimestamp = block.timestamp;
    }
    
    /**
     * @dev Update oracle data (only trusted signer can call)
     * @param data The oracle data to store
     */
    function updateOracleData(string calldata data) external {
        require(msg.sender == trustedSigner, "OracleReceiver: Only trusted signer can update");
        
        latestOracleData = data;
        lastUpdateTimestamp = block.timestamp;
        
        emit OracleDataUpdated(data, lastUpdateTimestamp, msg.sender);
    }
    
    /**
     * @dev Get the latest oracle data
     * @return The most recent oracle data string
     */
    function getLatestData() external view returns (string memory) {
        return latestOracleData;
    }
    
    /**
     * @dev Update trusted signer (only current trusted signer can call)
     * @param newSigner The new trusted signer address
     */
    function updateTrustedSigner(address newSigner) external {
        require(msg.sender == trustedSigner, "OracleReceiver: Only trusted signer can update");
        require(newSigner != address(0), "OracleReceiver: Invalid signer address");
        
        trustedSigner = newSigner;
    }
}
