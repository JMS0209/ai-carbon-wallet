import { createPublicClient, createWalletClient, http } from 'viem';
import { baseSepolia } from 'viem/chains';
import { evmAddresses } from '~~/contracts/addresses';

export function getPublicClient() {
  const chain = evmAddresses.chainId === 84532 ? baseSepolia : baseSepolia;
  return createPublicClient({ chain, transport: http(evmAddresses.rpcUrl) });
}

export function getWalletClient() {
  const chain = evmAddresses.chainId === 84532 ? baseSepolia : baseSepolia;
  // In wagmi UI flows, wallet client is generally provided; this helper can be used for server contexts if needed
  return createWalletClient({ chain, transport: http(evmAddresses.rpcUrl) });
}


