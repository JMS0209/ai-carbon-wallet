import { useScaffoldReadContract } from "~~/hooks/scaffold-eth";

// USDC Token ABI - minimal interface for reading data
const USDC_ABI = [
  {
    "inputs": [],
    "name": "decimals",
    "outputs": [{"type": "uint8"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "symbol",
    "outputs": [{"type": "string"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{"type": "address"}, {"type": "address"}],
    "name": "allowance",
    "outputs": [{"type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  }
] as const;

const USDC_ADDRESS = process.env.NEXT_PUBLIC_USDC_ADDRESS;

export class UsdcService {
  static async testConnection(): Promise<{ status: 'ok' | 'fail' | 'skip'; details: string }> {
    if (!USDC_ADDRESS) {
      return {
        status: 'skip',
        details: 'USDC address not configured',
      };
    }

    try {
      // TODO: Implement actual USDC contract read
      // For now, return a placeholder
      return {
        status: 'skip',
        details: 'USDC test not fully implemented yet',
      };
    } catch (error) {
      return {
        status: 'fail',
        details: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  static getUsdcAddress(): string | undefined {
    return USDC_ADDRESS;
  }

  static async allowanceOf(user: string, spender: string): Promise<string> {
    if (!USDC_ADDRESS) {
      throw new Error('USDC address not configured');
    }

    try {
      // TODO: Implement actual allowance query
      console.log('Querying USDC allowance for user:', user, 'spender:', spender);
      return '0'; // Placeholder
    } catch (error) {
      throw new Error(`Failed to get USDC allowance: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
}

// Hook for reading USDC data
export const useUsdcData = () => {
  const { data: decimals, isLoading: decimalsLoading } = useScaffoldReadContract(
    "USDC",
    "decimals"
  );

  const { data: symbol, isLoading: symbolLoading } = useScaffoldReadContract(
    "USDC",
    "symbol"
  );

  return {
    decimals,
    symbol,
    isLoading: decimalsLoading || symbolLoading,
    error: null,
    isConfigured: !!USDC_ADDRESS,
  };
};
