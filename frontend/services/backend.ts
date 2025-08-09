const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3001';

export interface BackendHealthResponse {
  status: string;
  message: string;
  timestamp: string;
  latency?: number;
}

export interface EnergySampleResponse {
  success: boolean;
  data?: {
    jobId: string;
    kwh: number;
    co2eq: number;
    timestamp: number;
  };
  error?: string;
}

export class BackendService {
  static async pingHealth(): Promise<BackendHealthResponse> {
    const startTime = Date.now();
    
    try {
      const response = await fetch(`${BACKEND_URL}/api/health`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      const latency = Date.now() - startTime;
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      return {
        ...data,
        latency,
      };
    } catch (error) {
      throw new Error(`Backend health check failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  static async sampleEnergyRead(): Promise<EnergySampleResponse> {
    try {
      const response = await fetch(`${BACKEND_URL}/api/energy`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        if (response.status === 404) {
          return {
            success: false,
            error: 'Energy endpoint not implemented',
          };
        }
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      throw new Error(`Energy sample read failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  static async testConnection(): Promise<{ status: 'ok' | 'fail' | 'skip'; details: string }> {
    try {
      const health = await this.pingHealth();
      return {
        status: 'ok',
        details: `Backend: Connected (${health.latency}ms) - ${health.message}`,
      };
    } catch (error) {
      // Try the proxy route when backend fails
      try {
        const startTime = Date.now();
        const proxyResponse = await fetch('/api/proxy/health', {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        });
        
        const latency = Date.now() - startTime;
        
        if (proxyResponse.ok) {
          const data = await proxyResponse.json();
          return {
            status: 'ok',
            details: `Proxy: Using health proxy (${latency}ms) - ${data.message || 'Proxy OK'}`,
          };
        } else {
          return {
            status: 'skip',
            details: 'Backend not running; proxy also failed',
          };
        }
      } catch (proxyError) {
        return {
          status: 'skip',
          details: 'Backend not configured or running',
        };
      }
    }
  }
}
