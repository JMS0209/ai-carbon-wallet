import { ethers } from 'ethers';

export function createWallet(privateKey: string, rpcUrl: string): ethers.Wallet {
  const provider = new ethers.providers.JsonRpcProvider(rpcUrl);
  return new ethers.Wallet(privateKey, provider);
}