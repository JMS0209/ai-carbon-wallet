// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract RoleBasedSignerRegistry {
    address public owner;

    enum Role { None, Oracle, Admin, Auditor }

    mapping(address => Role) public roles;

    event RoleAssigned(address signer, Role role);
    event RoleRevoked(address signer);

    modifier onlyOwner() {
        require(msg.sender == owner, "Not owner");
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    function assignRole(address signer, Role role) external onlyOwner {
        roles[signer] = role;
        emit RoleAssigned(signer, role);
    }

    function revokeRole(address signer) external onlyOwner {
        roles[signer] = Role.None;
        emit RoleRevoked(signer);
    }

    function hasRole(address signer, Role role) external view returns (bool) {
        return roles[signer] == role;
    }
}