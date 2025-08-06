const { task } = require("hardhat/config");
require("@nomicfoundation/hardhat-toolbox");
require("@oasisprotocol/sapphire-hardhat");
const dotenv = require("dotenv");

require("dotenv").config();

module.exports = {
  solidity: "0.8.19",
  networks: {
    sapphire: {
      url: process.env.OASIS_RPC_URL,
      accounts: process.env.ORACLE_PRIVATE_KEY ? [process.env.ORACLE_PRIVATE_KEY] : [],
      chainId: 0x5afe
    },
    sapphire_testnet: {
      url: "https://testnet.sapphire.oasis.dev",
      accounts: process.env.ORACLE_PRIVATE_KEY ? [process.env.ORACLE_PRIVATE_KEY] : [],
      chainId: 0x5aff
    }
  }
};

module.exports = config;

