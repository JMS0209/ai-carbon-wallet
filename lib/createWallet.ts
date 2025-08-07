import { ethers } from 'ethers';

/**
 * Creates a wallet instance connected to a given RPC provider.
 * 
 * @param privateKey - The private key of the wallet.
 * @param rpcUrl - The RPC URL of the Ethereum network.
 * @returns An ethers Wallet instance connected to the provider.
 */
export function createWallet(privateKey: string, rpcUrl: string): ethers.Wallet {
  const provider: ethers.providers.JsonRpcProvider = new ethers.providers.JsonRpcProvider(rpcUrl);
  return new ethers.Wallet(privateKey, provider);
}
