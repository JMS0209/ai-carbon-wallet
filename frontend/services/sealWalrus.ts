import { probeSeal as rbacProbeSeal, probeWalrus as rbacProbeWalrus } from "~~/services/rbac/sealStore";

const WALRUS_URL = process.env.NEXT_PUBLIC_WALRUS_URL;

export interface SealServer {
  objectId: string;
  network: string;
  url: string;
}

export class SealWalrusService {
  static async probeSeal(): Promise<{ servers: number; first?: string }> {
    try {
      return await rbacProbeSeal();
    } catch (error) {
      console.error('Seal probe failed:', error);
      return { servers: 0 };
    }
  }

  static async probeWalrus(): Promise<{ ok: boolean; url?: string }> {
    try {
      return await rbacProbeWalrus();
    } catch (error) {
      console.error('Walrus probe failed:', error);
      return { ok: false };
    }
  }

  static async testConnection(): Promise<{ status: 'ok' | 'warn' | 'fail' | 'skip'; details: string }> {
    try {
      const sealResult = await this.probeSeal();
      const walrusResult = await this.probeWalrus();

      if (sealResult.servers > 0) {
        const walrusMsg = walrusResult.ok ? `Walrus: OK (${walrusResult.url})` : 'Walrus: SKIP (no URL)';
        return {
          status: 'ok',
          details: `Seal: ${sealResult.servers} servers${sealResult.first ? ` (first: ${sealResult.first.slice(0, 8)}...)` : ''}; ${walrusMsg}`,
        };
      } else if (walrusResult.ok) {
        return {
          status: 'warn',
          details: `Seal: no servers available; Walrus: configured at ${walrusResult.url}`,
        };
      } else {
        return {
          status: 'skip',
          details: 'Seal: no servers available; Walrus: SKIP (set NEXT_PUBLIC_WALRUS_URL to enable)',
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
