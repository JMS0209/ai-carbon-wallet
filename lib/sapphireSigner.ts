import { wrap } from '@oasisprotocol/sapphire-paratime';
import { ethers } from 'ethers';

export async function createSapphireSigner(): Promise<ethers.Signer> {
  if (!window.ethereum) throw new Error('No wallet found');

  const provider = new ethers.providers.Web3Provider(window.ethereum);
  await provider.send('eth_requestAccounts', []);
  const signer = provider.getSigner();

  // Wrap signer with Sapphire privacy layer
  return wrap(signer);
}