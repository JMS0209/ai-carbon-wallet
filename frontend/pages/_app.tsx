import '../styles/globals.css';
import type { AppProps } from 'next/app';

import { WagmiProvider, createConfig, http } from 'wagmi';
import { mainnet, sepolia } from 'wagmi/chains';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import {
  RainbowKitProvider,
  getDefaultWallets,
} from '@rainbow-me/rainbowkit';
import '@rainbow-me/rainbowkit/styles.css';

import { SignerProvider } from '../context/SignerContext';

// Wagmi config
const { connectors } = getDefaultWallets({
  appName: 'EcoCarbon Portal',
  projectId: '8171b12b0bbc631443cd8419b538a998', // Replace with WalletConnect project ID
  chains: [mainnet, sepolia],
});

const wagmiConfig = createConfig({
  connectors,
  chains: [mainnet, sepolia],
  transports: {
    [mainnet.id]: http(),
    [sepolia.id]: http(),
  },
});

const queryClient = new QueryClient();

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider chains={[mainnet, sepolia]}>
          <SignerProvider>
            <Component {...pageProps} />
          </SignerProvider>
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}

export default MyApp;
