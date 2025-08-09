import { useEffect } from 'react';
import { getOrCreateBurnerWallet } from '../lib/walletManager';
import { createWallet } from '../lib/createWallet';
import { NETWORKS } from '../lib/networks';
import { ethers } from 'ethers';

export default function Home() {
  useEffect(() => {
    const run = async () => {
      const burner = getOrCreateBurnerWallet();
      const wallet = createWallet(burner.privateKey, NETWORKS.sapphireTestnet.rpcUrl);

      const balance = await wallet.getBalance();
      console.log(`Address: ${wallet.address}`);
      console.log(`Balance: ${ethers.utils.formatEther(balance)} ETH`);
    };

    run();
  }, []);

  return <div>Check console for burner wallet info</div>;
}
