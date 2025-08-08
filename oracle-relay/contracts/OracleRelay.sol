// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "./SignerRegistry.sol";

contract OracleRelay {
    SignerRegistry public registry;
    mapping(bytes32 => uint256) public dataFeed;

    event DataUpdated(bytes32 indexed key, uint256 value, address indexed signer);

    constructor(address registryAddress) {
        registry = SignerRegistry(registryAddress);
    }

    function pushData(bytes32 key, uint256 value) external {
        require(registry.isSigner(msg.sender), "Unauthorized signer");
        dataFeed[key] = value;
        emit DataUpdated(key, value, msg.sender);
    }

    function getData(bytes32 key) external view returns (uint256) {
        return dataFeed[key];
    }
}