import { readUsdcMeta, testEvmConnection } from './evm';

export class UsdcService {
  static async readUsdcReadiness(): Promise<{ status: 'ok' | 'fail' | 'skip'; details: string }> {
    try {
      // First test EVM connection
      const evmResult = await testEvmConnection();
      if (evmResult.status === 'fail') {
        return {
          status: 'skip',
          details: 'EVM connection failed',
        };
      }

      // Try to read USDC metadata
      const usdcMeta = await readUsdcMeta();
      
      return {
        status: 'ok',
        details: `USDC ${usdcMeta.symbol} (${usdcMeta.decimals} decimals) - ${usdcMeta.name}`,
      };
    } catch (error) {
      return {
        status: 'skip',
        details: 'USDC address not configured or contract not found',
      };
    }
  }

  static async testConnection(): Promise<{ status: 'ok' | 'fail' | 'skip'; details: string }> {
    return await this.readUsdcReadiness();
  }

  static getUsdcAddress(): string | undefined {
    return process.env.NEXT_PUBLIC_USDC_ADDRESS;
  }
}


