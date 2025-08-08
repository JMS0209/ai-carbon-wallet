const WALRUS_URL = process.env.NEXT_PUBLIC_WALRUS_URL;
const SUI_NETWORK = process.env.NEXT_PUBLIC_SUI_NETWORK || 'testnet';

export interface SealServer {
  objectId: string;
  network: string;
  url: string;
}

export class SealWalrusService {
  static async probeSeal(network = SUI_NETWORK): Promise<{ servers: SealServer[]; firstObjectId?: string }> {
    try {
      // TODO: Import and use @mysten/seal when available
      // For now, return placeholder data
      console.log('Probing Seal servers for network:', network);
      
      // Placeholder implementation - in real implementation:
      // import { getAllowlistedKeyServers, SealClient } from '@mysten/seal'
      // const ids = getAllowlistedKeyServers(network);
      // const client = new SealClient({ 
      //   serverConfigs: ids.map(id => ({ objectId: id, weight: 1 })), 
      //   verifyKeyServers: true 
      // });
      
      return {
        servers: [],
        firstObjectId: undefined,
      };
    } catch (error) {
      throw new Error(`Seal probe failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  static async probeWalrus(): Promise<{ ok: boolean; url?: string }> {
    if (!WALRUS_URL) {
      return { ok: false };
    }

    try {
      // TODO: Implement actual Walrus health check
      // For now, just check if URL is configured
      console.log('Probing Walrus at:', WALRUS_URL);
      return { ok: true, url: WALRUS_URL };
    } catch (error) {
      console.error('Walrus probe failed:', error);
      return { ok: false };
    }
  }

  static async testConnection(): Promise<{ status: 'ok' | 'warn' | 'fail' | 'skip'; details: string }> {
    try {
      const sealResult = await this.probeSeal();
      const walrusResult = await this.probeWalrus();

      if (sealResult.servers.length > 0) {
        return {
          status: 'ok',
          details: `Seal: ${sealResult.servers.length} servers, Walrus: ${walrusResult.ok ? 'configured' : 'not configured'}`,
        };
      } else if (walrusResult.ok) {
        return {
          status: 'warn',
          details: `Seal: no servers, Walrus: configured at ${walrusResult.url}`,
        };
      } else {
        return {
          status: 'skip',
          details: 'Seal servers not available, Walrus not configured',
        };
      }
    } catch (error) {
      return {
        status: 'fail',
        details: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  static getWalrusUrl(): string | undefined {
    return WALRUS_URL;
  }
}
