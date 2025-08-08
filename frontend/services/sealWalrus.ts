const WALRUS_URL = process.env.NEXT_PUBLIC_WALRUS_URL;

export interface SealServer {
  objectId: string;
  network: string;
  url: string;
}

export class SealWalrusService {
  static async testConnection(): Promise<{ status: 'ok' | 'fail' | 'skip'; details: string }> {
    try {
      const sealResult = await this.probeSeal();
      const walrusResult = await this.probeWalrus();

      if (sealResult.servers.length > 0) {
        return {
          status: 'ok',
          details: `Seal: ${sealResult.servers.length} servers, Walrus: ${walrusResult ? 'configured' : 'not configured'}`,
        };
      } else {
        return {
          status: 'skip',
          details: 'Seal servers not available',
        };
      }
    } catch (error) {
      return {
        status: 'fail',
        details: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  static async probeSeal(): Promise<{ servers: SealServer[]; firstObjectId?: string }> {
    try {
      // TODO: Implement actual Seal client with @mysten/seal
      // For now, return placeholder data
      console.log('Probing Seal servers...');
      return {
        servers: [],
        firstObjectId: undefined,
      };
    } catch (error) {
      throw new Error(`Seal probe failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  static async probeWalrus(): Promise<boolean> {
    if (!WALRUS_URL) {
      return false;
    }

    try {
      // TODO: Implement actual Walrus health check
      // For now, just check if URL is configured
      console.log('Probing Walrus at:', WALRUS_URL);
      return true;
    } catch (error) {
      console.error('Walrus probe failed:', error);
      return false;
    }
  }

  static getWalrusUrl(): string | undefined {
    return WALRUS_URL;
  }
}
