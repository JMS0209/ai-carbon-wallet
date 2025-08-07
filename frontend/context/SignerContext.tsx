import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAccount, useWalletClient } from 'wagmi';
import { WalletClient } from 'viem';
import { createSapphireSigner } from '../../lib/sapphireSigner';
import { createZkLoginSession } from '../lib/zkLogin';

// Placeholder types for Sapphire and zkLogin
type SapphireSigner = any;
type ZkLoginSession = any;

interface SignerContextType {
  evmSigner: WalletClient | null;
  sapphireSigner: SapphireSigner | null;
  zkLoginSession: ZkLoginSession | null;
  isConnected: boolean;
}

const SignerContext = createContext<SignerContextType>({
  evmSigner: null,
  sapphireSigner: null,
  zkLoginSession: null,
  isConnected: false,
});

export const SignerProvider = ({ children }: { children: React.ReactNode }) => {
  const { data: walletClient } = useWalletClient();
  const { isConnected } = useAccount();

  const [evmSigner, setEvmSigner] = useState<WalletClient | null>(null);
  const [sapphireSigner, setSapphireSigner] = useState<SapphireSigner | null>(null);
  const [zkLoginSession, setZkLoginSession] = useState<ZkLoginSession | null>(null);

  useEffect(() => {
    if (walletClient) {
      setEvmSigner(walletClient);
    }
  }, [walletClient]);

useEffect(() => {
  const initSapphire = async () => {
    try {
      const signer = await createSapphireSigner();
      setSapphireSigner(signer);
    } catch (err) {
      console.error('Sapphire signer init failed:', err);
    }
  };

  if (isConnected) {
    initSapphire();
  }
}, [isConnected]);

useEffect(() => {
  const initZkLogin = async () => {
    const session = await createZkLoginSession();
    setZkLoginSession(session);
  };

  if (isConnected) {
    initZkLogin();
  }
}, [isConnected]);


  return (
    <SignerContext.Provider
      value={{
        evmSigner,
        sapphireSigner,
        zkLoginSession,
        isConnected,
      }}
    >
      {children}
    </SignerContext.Provider>
  );
};

export const useSigner = () => useContext(SignerContext);