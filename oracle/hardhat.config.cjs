const { task } = require("hardhat/config");
import "@nomicfoundation/hardhat-toolbox";
import "@oasisprotocol/sapphire-hardhat";

const config = {
  solidity: "0.8.19",
  networks: {
    sapphire: {
      url: "https://sapphire.oasis.io",
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

