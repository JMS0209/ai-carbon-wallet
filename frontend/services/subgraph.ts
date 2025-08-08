const SUBGRAPH_URL = process.env.NEXT_PUBLIC_SUBGRAPH_URL;

export interface EnergyIssued {
  id: string;
  jobId: string;
  kWh: string;
  co2eq: string;
  timestamp: string;
  org: string;
  nftId: string;
  zkProofHash: string;
  blockNumber: string;
  transactionHash: string;
}

export interface SubgraphResponse<T> {
  data: T;
  errors?: any[];
}

export class SubgraphService {
  static async testConnection(): Promise<{ status: 'ok' | 'fail' | 'skip'; details: string }> {
    if (!SUBGRAPH_URL) {
      return {
        status: 'skip',
        details: 'Subgraph URL not configured',
      };
    }

    try {
      const count = await this.getEnergyIssuedCount();
      return {
        status: 'ok',
        details: `Connected - ${count} energy records indexed`,
      };
    } catch (error) {
      return {
        status: 'fail',
        details: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  static async getEnergyIssuedCount(): Promise<number> {
    if (!SUBGRAPH_URL) {
      throw new Error('Subgraph URL not configured');
    }

    const query = `
      query {
        energyIssueds(first: 1) {
          id
        }
        _meta {
          hasIndexingErrors
          block {
            number
          }
        }
      }
    `;

    try {
      const response = await fetch(SUBGRAPH_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query }),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const result: SubgraphResponse<{ energyIssueds: EnergyIssued[] }> = await response.json();
      
      if (result.errors) {
        throw new Error(`GraphQL errors: ${JSON.stringify(result.errors)}`);
      }

      // For now, return a placeholder count
      // In a real implementation, you'd query the total count
      return result.data.energyIssueds.length;
    } catch (error) {
      throw new Error(`Subgraph query failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  static async getEnergyIssuedRecords(limit: number = 10): Promise<EnergyIssued[]> {
    if (!SUBGRAPH_URL) {
      throw new Error('Subgraph URL not configured');
    }

    const query = `
      query($limit: Int!) {
        energyIssueds(first: $limit, orderBy: timestamp, orderDirection: desc) {
          id
          jobId
          kWh
          co2eq
          timestamp
          org
          nftId
          zkProofHash
          blockNumber
          transactionHash
        }
      }
    `;

    try {
      const response = await fetch(SUBGRAPH_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          query,
          variables: { limit }
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const result: SubgraphResponse<{ energyIssueds: EnergyIssued[] }> = await response.json();
      
      if (result.errors) {
        throw new Error(`GraphQL errors: ${JSON.stringify(result.errors)}`);
      }

      return result.data.energyIssueds;
    } catch (error) {
      throw new Error(`Subgraph query failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
}
