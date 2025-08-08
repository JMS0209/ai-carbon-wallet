import { readOracleLatest, testEvmConnection } from './evm';

export class OracleService {
  static async readOracleLatest(): Promise<{ latestData: string; trustedSigner: string; isConfigured: boolean }> {
    return await readOracleLatest();
  }

  static async testConnection(): Promise<{ status: 'ok' | 'fail' | 'skip'; details: string }> {
    try {
      // First test EVM connection
      const evmResult = await testEvmConnection();
      if (evmResult.status === 'fail') {
        return {
          status: 'skip',
          details: 'EVM connection failed',
        };
      }

      // Try to read oracle data
      const oracleData = await this.readOracleLatest();
      
      return {
        status: 'ok',
        details: `Oracle data: ${oracleData.latestData.substring(0, 50)}...`,
      };
    } catch (error) {
      return {
        status: 'skip',
        details: 'Oracle receiver address not configured or contract not found',
      };
    }
  }

  static getOracleReceiverAddress(): string | undefined {
    return process.env.NEXT_PUBLIC_ORACLE_RECEIVER_ADDRESS;
  }
}


