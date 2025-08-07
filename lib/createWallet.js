import { ethers } from 'ethers';

export function createWallet(privateKey, rpcUrl) {
  const provider = new ethers.providers.JsonRpcProvider(rpcUrl);
  return new ethers.Wallet(privateKey, provider);
}
