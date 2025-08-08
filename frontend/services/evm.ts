import { createPublicClient, http, getContract } from 'viem';
import { baseSepolia } from 'viem/chains';
import { addresses } from '../contracts/addresses';
import { OracleReceiverABI } from '../contracts/abi/OracleReceiver';
import { USDCABI } from '../contracts/abi/USDC';

// Create public client for read-only operations
export function getPublicClient() {
  const chainId = addresses.chainId;
  const chain = chainId === 84532 ? baseSepolia : baseSepolia; // Default to Base Sepolia
  
  return createPublicClient({
    chain,
    transport: http(),
  });
}

// Read oracle latest data
export async function readOracleLatest() {
  if (!addresses.oracleReceiver) {
    throw new Error('Oracle receiver address not configured');
  }

  const client = getPublicClient();
  const contract = getContract({
    address: addresses.oracleReceiver,
    abi: OracleReceiverABI,
    client,
  });

  try {
    const [latestData, trustedSigner] = await Promise.all([
      contract.read.latestOracleData(),
      contract.read.trustedSigner(),
    ]);

    return {
      latestData: latestData || 'No data available',
      trustedSigner,
      isConfigured: true,
    };
  } catch (error) {
    throw new Error(`Oracle read failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

// Read USDC metadata
export async function readUsdcMeta() {
  if (!addresses.usdc) {
    throw new Error('USDC address not configured');
  }

  const client = getPublicClient();
  const contract = getContract({
    address: addresses.usdc,
    abi: USDCABI,
    client,
  });

  try {
    const [symbol, decimals, name] = await Promise.all([
      contract.read.symbol(),
      contract.read.decimals(),
      contract.read.name(),
    ]);

    return {
      symbol,
      decimals,
      name,
      address: addresses.usdc,
      isConfigured: true,
    };
  } catch (error) {
    throw new Error(`USDC read failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

// Test EVM connection
export async function testEvmConnection() {
  try {
    const client = getPublicClient();
    const blockNumber = await client.getBlockNumber();
    
    return {
      status: 'ok' as const,
      details: `Connected to chain ${addresses.chainId} (block ${blockNumber})`,
      blockNumber: blockNumber.toString(),
    };
  } catch (error) {
    return {
      status: 'fail' as const,
      details: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}
