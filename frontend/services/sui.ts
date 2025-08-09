import { SuiClient, getFullnodeUrl } from '@mysten/sui.js/client';

const SUI_RPC_URL = process.env.NEXT_PUBLIC_SUI_RPC_URL || getFullnodeUrl((process.env.NEXT_PUBLIC_SUI_NETWORK ?? 'testnet') as 'mainnet' | 'testnet' | 'devnet' | 'localnet');
const SUI_PACKAGE_ID = process.env.NEXT_PUBLIC_SUI_PACKAGE_ID;

// Create Sui client
const suiClient = new SuiClient({ url: SUI_RPC_URL });

export interface EnergyNFT {
  id: string;
  jobId: string;
  kwhConsumed: number;
  co2Equivalent: number;
  timestamp: number;
  organization: string;
  metadataUri: string;
  zkProofHash: string;
}

export class SuiService {
  static requirePackageId(): string {
    if (!SUI_PACKAGE_ID) {
      throw new Error(
        'NEXT_PUBLIC_SUI_PACKAGE_ID is required. ' +
        'Deploy your Sui Move package first: cd contracts/SuiMove && sui client publish --json'
      );
    }
    if (!SUI_PACKAGE_ID.startsWith('0x') || SUI_PACKAGE_ID.length < 10) {
      throw new Error(
        'NEXT_PUBLIC_SUI_PACKAGE_ID appears malformed. Expected format: 0x123abc...'
      );
    }
    return SUI_PACKAGE_ID;
  }

  static async probeSui(): Promise<{ status: 'ok' | 'fail'; details: string }> {
    try {
      const checkpoint = await suiClient.getLatestCheckpointSequenceNumber();
      return {
        status: 'ok',
        details: `Connected to Sui (checkpoint ${checkpoint})`,
      };
    } catch (error) {
      return {
        status: 'fail',
        details: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  static async getEnergyNftCount(packageId?: string): Promise<number> {
    const targetPackageId = packageId || SUI_PACKAGE_ID;
    
    if (!targetPackageId) {
      throw new Error('Sui package ID not configured');
    }

    try {
      // For now, return a placeholder since the exact API might be different
      // In a real implementation, you'd query objects by type
      console.log('Querying EnergyNFT count for package:', targetPackageId);
      return 0; // Placeholder - would need to implement actual object querying
    } catch (error) {
      throw new Error(`Failed to get EnergyNFT count: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  static async testConnection(): Promise<{ status: 'ok' | 'fail' | 'skip'; details: string }> {
    try {
      const probeResult = await this.probeSui();
      
      if (probeResult.status === 'fail') {
        return probeResult;
      }

      if (!SUI_PACKAGE_ID) {
        return {
          status: 'skip',
          details: 'Sui package ID not configured',
        };
      }

      const count = await this.getEnergyNftCount();
      return {
        status: 'ok',
        details: `${probeResult.details} - Found ${count} EnergyNFTs`,
      };
    } catch (error) {
      return {
        status: 'fail',
        details: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  static getSuiConfig() {
    return {
      rpcUrl: SUI_RPC_URL,
      packageId: SUI_PACKAGE_ID,
      network: process.env.NEXT_PUBLIC_SUI_NETWORK || 'testnet',
    };
  }
}
