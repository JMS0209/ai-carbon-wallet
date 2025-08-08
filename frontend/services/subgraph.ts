import { request, gql } from 'graphql-request';

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
  static async getEnergyIssuedCount(): Promise<{ count: number; meta?: any }> {
    if (!SUBGRAPH_URL) {
      throw new Error('Subgraph URL not configured');
    }

    const query = gql`
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
      const data = await request(SUBGRAPH_URL, query) as any;
      
      if (data.errors) {
        throw new Error(`GraphQL errors: ${JSON.stringify(data.errors)}`);
      }

      return {
        count: data.energyIssueds?.length || 0,
        meta: data._meta,
      };
    } catch (error) {
      throw new Error(`Subgraph query failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  static async getEnergyIssuedRecords(limit: number = 10): Promise<EnergyIssued[]> {
    if (!SUBGRAPH_URL) {
      throw new Error('Subgraph URL not configured');
    }

    const query = gql`
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
      const data = await request(SUBGRAPH_URL, query, { limit }) as any;
      
      if (data.errors) {
        throw new Error(`GraphQL errors: ${JSON.stringify(data.errors)}`);
      }

      return data.energyIssueds || [];
    } catch (error) {
      throw new Error(`Subgraph query failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  static async testConnection(): Promise<{ status: 'ok' | 'fail' | 'skip'; details: string }> {
    if (!SUBGRAPH_URL) {
      return {
        status: 'skip',
        details: 'Subgraph URL not configured',
      };
    }

    try {
      const result = await this.getEnergyIssuedCount();
      return {
        status: 'ok',
        details: `Connected - ${result.count} energy records indexed`,
      };
    } catch (error) {
      return {
        status: 'fail',
        details: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }
}
