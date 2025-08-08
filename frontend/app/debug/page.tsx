"use client";

import React, { useState } from "react";
import { BackendService } from "~~/services/backend";
import { OracleService } from "~~/services/oracle";
import { SuiService } from "~~/services/sui";
import { SealWalrusService } from "~~/services/sealWalrus";
import { SubgraphService } from "~~/services/subgraph";
import { UsdcService } from "~~/services/usdc";

interface TestResult {
  module: string;
  status: 'ok' | 'warn' | 'fail' | 'skip';
  details: string;
  data?: any;
}

export default function DebugPage() {
  const [results, setResults] = useState<TestResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);

  const runAllTests = async () => {
    setIsRunning(true);
    const newResults: TestResult[] = [];

    // Backend test
    try {
      const health = await BackendService.pingHealth();
      newResults.push({
        module: 'Backend',
        status: 'ok',
        details: `Health check passed (${health.latency}ms)`,
        data: health
      });
    } catch (error) {
      newResults.push({
        module: 'Backend',
        status: 'fail',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }

    // Oracle test
    try {
      const oracleResult = await OracleService.testConnection();
      newResults.push({
        module: 'Oracle',
        status: oracleResult.status,
        details: oracleResult.details,
        data: { address: OracleService.getOracleReceiverAddress() }
      });
    } catch (error) {
      newResults.push({
        module: 'Oracle',
        status: 'fail',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }

    // Sui test
    try {
      const suiResult = await SuiService.testConnection();
      newResults.push({
        module: 'Sui',
        status: suiResult.status,
        details: suiResult.details,
        data: SuiService.getSuiConfig()
      });
    } catch (error) {
      newResults.push({
        module: 'Sui',
        status: 'fail',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }

    // Seal test
    try {
      const sealResult = await SealWalrusService.testConnection();
      newResults.push({
        module: 'Seal + Walrus',
        status: sealResult.status,
        details: sealResult.details,
        data: { walrusUrl: SealWalrusService.getWalrusUrl() }
      });
    } catch (error) {
      newResults.push({
        module: 'Seal + Walrus',
        status: 'fail',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }

    // Subgraph test
    try {
      const subgraphResult = await SubgraphService.testConnection();
      newResults.push({
        module: 'Subgraph',
        status: subgraphResult.status,
        details: subgraphResult.details
      });
    } catch (error) {
      newResults.push({
        module: 'Subgraph',
        status: 'fail',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }

    // USDC test
    try {
      const usdcResult = await UsdcService.testConnection();
      newResults.push({
        module: 'USDC',
        status: usdcResult.status,
        details: usdcResult.details,
        data: { address: UsdcService.getUsdcAddress() }
      });
    } catch (error) {
      newResults.push({
        module: 'USDC',
        status: 'fail',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }

    setResults(newResults);
    setIsRunning(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ok': return 'text-success';
      case 'fail': return 'text-error';
      case 'skip': return 'text-warning';
      default: return 'text-base-content/50';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'ok': return '✅';
      case 'fail': return '❌';
      case 'skip': return '⏭️';
      default: return '⏭️';
    }
  };

  return (
    <div className="flex-grow bg-base-300 w-full mt-16 px-8 py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Debug & Testing</h1>
        
        <div className="mb-8">
          <button
            onClick={runAllTests}
            disabled={isRunning}
            className={`btn btn-primary ${isRunning ? 'btn-disabled' : ''}`}
          >
            {isRunning ? 'Running Tests...' : 'Run All Tests'}
          </button>
        </div>

        {results.length > 0 && (
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold">Test Results</h2>
            
            {results.map((result, index) => (
              <div key={index} className="bg-base-100 p-6 rounded-lg border border-base-300">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">{result.module}</h3>
                  <div className={`text-xl ${getStatusColor(result.status)}`}>
                    {getStatusIcon(result.status)}
                  </div>
                </div>
                
                <p className="text-sm text-base-content/70 mb-4">{result.details}</p>
                
                {result.data && (
                  <div className="bg-base-200 p-4 rounded">
                    <h4 className="text-sm font-semibold mb-2">Debug Data:</h4>
                    <pre className="text-xs overflow-x-auto">
                      {JSON.stringify(result.data, null, 2)}
                    </pre>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
