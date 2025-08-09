import { connectorsForWallets } from "@rainbow-me/rainbowkit";
import {
  coinbaseWallet,
  ledgerWallet,
  metaMaskWallet,
  rainbowWallet,
  safeWallet,
  walletConnectWallet,
} from "@rainbow-me/rainbowkit/wallets";
import { rainbowkitBurnerWallet } from "burner-connector";
import * as chains from "viem/chains";
import scaffoldConfig from "~~/scaffold.config";

const { onlyLocalBurnerWallet, targetNetworks, walletConnectProjectId } = scaffoldConfig;

// Only include WalletConnect if we have a valid project ID
const hasValidProjectId = walletConnectProjectId && walletConnectProjectId.length > 0;
if (!hasValidProjectId) {
  console.warn("WalletConnect disabled: NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID not configured. Get one at https://dashboard.reown.com");
}

const wallets = [
  metaMaskWallet,
  ...(hasValidProjectId ? [walletConnectWallet] : []),
  ledgerWallet,
  coinbaseWallet,
  rainbowWallet,
  safeWallet,
  ...(!targetNetworks.some(network => network.id !== (chains.hardhat as chains.Chain).id) || !onlyLocalBurnerWallet
    ? [rainbowkitBurnerWallet]
    : []),
];

/**
 * wagmi connectors for the wagmi context
 */
export const wagmiConnectors = connectorsForWallets(
  [
    {
      groupName: "Supported Wallets",
      wallets,
    },
  ],

  {
    appName: "ai-carbon-wallet",
    projectId: scaffoldConfig.walletConnectProjectId,
  },
);
