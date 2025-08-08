import { useScaffoldReadContract } from "~~/hooks/scaffold-eth";

// Oracle Receiver ABI - minimal interface for reading data
const ORACLE_RECEIVER_ABI = [
  {
    "inputs": [],
    "name": "latestOracleData",
    "outputs": [{"type": "string"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "trustedSigner",
    "outputs": [{"type": "address"}],
    "stateMutability": "view",
    "type": "function"
  }
] as const;

const ORACLE_RECEIVER_ADDRESS = process.env.NEXT_PUBLIC_ORACLE_RECEIVER_ADDRESS;

export class OracleService {
  static async testConnection(): Promise<{ status: 'ok' | 'fail' | 'skip'; details: string }> {
    if (!ORACLE_RECEIVER_ADDRESS) {
      return {
        status: 'skip',
        details: 'Oracle receiver address not configured',
      };
    }

    try {
      // This would need to be implemented with wagmi/viem
      // For now, return a placeholder
      return {
        status: 'skip',
        details: 'Oracle test not fully implemented yet',
      };
    } catch (error) {
      return {
        status: 'fail',
        details: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  static getOracleReceiverAddress(): string | undefined {
    return ORACLE_RECEIVER_ADDRESS;
  }
}

// Hook for reading oracle data
export const useOracleLatest = () => {
  const { data: latestData, isLoading } = useScaffoldReadContract(
    "OracleReceiver",
    "latestOracleData"
  );

  return {
    latestData,
    isLoading,
    error: null,
    isConfigured: !!ORACLE_RECEIVER_ADDRESS,
  };
};
