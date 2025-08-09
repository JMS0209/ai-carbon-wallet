import { formatUnits, parseUnits } from 'viem';
import { getPublicClient } from './evmClient';
import { evmAddresses } from '~~/contracts/addresses';
import { ERC20ABI } from '~~/contracts/abi/ERC20';
import { PaymentProcessorABI } from '~~/contracts/abi/PaymentProcessor';

export async function getTokenMeta() {
  if (!evmAddresses.usdc) throw new Error('USDC address not configured');
  const client = getPublicClient();
  const [symbol, decimals] = await Promise.all([
    client.readContract({ address: evmAddresses.usdc, abi: ERC20ABI, functionName: 'symbol' }),
    client.readContract({ address: evmAddresses.usdc, abi: ERC20ABI, functionName: 'decimals' }),
  ]);
  return { symbol: symbol as string, decimals: Number(decimals) };
}

export async function getBalances(owner: `0x${string}`) {
  if (!evmAddresses.usdc) throw new Error('USDC address not configured');
  const client = getPublicClient();
  const usdcBalance = await client.readContract({ address: evmAddresses.usdc, abi: ERC20ABI, functionName: 'balanceOf', args: [owner] });
  return { usdcBalance: usdcBalance as bigint };
}

export async function getAllowance(owner: `0x${string}`) {
  if (!evmAddresses.usdc || !evmAddresses.paymentProcessor) throw new Error('Contracts not configured');
  const client = getPublicClient();
  const allowance = await client.readContract({ address: evmAddresses.usdc, abi: ERC20ABI, functionName: 'allowance', args: [owner, evmAddresses.paymentProcessor] });
  return { allowance: allowance as bigint };
}

export function quoteOffset({ usdCents }: { usdCents: number }) {
  // Simplified: 1 USDC = 1 credit; convert cents to 6-decimals USDC
  const amount = BigInt(Math.round(usdCents * 10_000)); // cents -> 6 decimals (cents*10^4)
  const carbonCredits = amount; // 1:1 mock
  return { amount, carbonCredits };
}

function ensureWritesEnabled() {
  if (process.env.PAYMENTS_DEV_ENABLED !== 'true') throw new Error('Writes disabled');
}

export async function approveIfNeeded({ owner, requiredAmount, infinite = false }: { owner: `0x${string}`; requiredAmount: bigint; infinite?: boolean }) {
  ensureWritesEnabled();
  if (!evmAddresses.usdc || !evmAddresses.paymentProcessor) throw new Error('Contracts not configured');
  const client = getPublicClient();
  const current = await client.readContract({ address: evmAddresses.usdc, abi: ERC20ABI, functionName: 'allowance', args: [owner, evmAddresses.paymentProcessor] }) as bigint;
  if (current >= requiredAmount) return { hash: undefined };
  const amount = infinite ? (BigInt(2) ** BigInt(256) - BigInt(1)) : requiredAmount;
  // simulate+write handled by wagmi in UI; here we prepare call data as guidance
  return { hash: 'simulate-in-ui' };
}

export async function purchaseOffset({ amount, carbonCredits, jobId }: { amount: bigint; carbonCredits: bigint; jobId: string }) {
  ensureWritesEnabled();
  if (!evmAddresses.paymentProcessor) throw new Error('PaymentProcessor not configured');
  // simulate+write handled by wagmi in UI; here we prepare call data as guidance
  return { hash: 'simulate-in-ui' };
}


