// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";

contract OracleReceiver {
    using ECDSA for bytes32;

    address public trustedSigner;
    string public latestOracleData;

    event OracleDataReceived(string data, address signer);

    constructor(address _trustedSigner) {
        trustedSigner = _trustedSigner;
    }

    function receiveOracleData(string memory data, bytes memory signature) public {
        bytes32 messageHash = keccak256(abi.encodePacked(data));
        bytes32 ethSignedMessageHash = ECDSA.toEthSignedMessageHash(messageHash);

        address signer = ECDSA.recover(ethSignedMessageHash, signature);
        require(signer == trustedSigner, "Invalid signer");

        latestOracleData = data;
        emit OracleDataReceived(data, signer);
    }
}
