// hardhat.config.ts
import 'dotenv/config';
import { HardhatUserConfig } from 'hardhat/config';
import '@nomicfoundation/hardhat-toolbox';

const config: HardhatUserConfig = {
  solidity: {
    compilers: [
      { version: '0.8.20' },
      { version: '0.8.19' },
    ],
  },
  networks: {
    // keep your existing L2s
    polygon: {
      url: process.env.ETHEREUM_L2_RPC_URL || 'https://polygon-rpc.com',
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
    },
    arbitrum: {
      url: 'https://arb1.arbitrum.io/rpc',
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
    },

    // ➕ Base Sepolia testnet (chainId 84532)
    baseSepolia: {
      url: process.env.BASE_SEPOLIA_RPC_URL || process.env.NEXT_PUBLIC_EVM_RPC_URL || 'https://sepolia.base.org',
      chainId: 84532,
      accounts: process.env.PRIVATE_KEY ? [String(process.env.PRIVATE_KEY)] : [],
    },
  },

  // (optional) contract verification via Basescan (Etherscan-compatible)
  etherscan: {
    apiKey: process.env.BASESCAN_API_KEY || process.env.ETHERSCAN_API_KEY || '',
    customChains: [
      {
        network: 'baseSepolia',
        chainId: 84532,
        urls: {
          apiURL: 'https://api-sepolia.basescan.org/api',
          browserURL: 'https://sepolia.basescan.org',
        },
      },
    ],
  },
};

export default config;
