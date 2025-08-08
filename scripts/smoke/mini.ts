#!/usr/bin/env node

// Mini smoke test for AI Carbon Wallet integration
// Run with: npx tsx scripts/smoke/mini.ts

import { BackendService } from "../../frontend/services/backend";
import { OracleService } from "../../frontend/services/oracle";
import { SuiService } from "../../frontend/services/sui";
import { SealWalrusService } from "../../frontend/services/sealWalrus";
import { SubgraphService } from "../../frontend/services/subgraph";
import { UsdcService } from "../../frontend/services/usdc";

interface TestSummary {
  module: string;
  status: 'ok' | 'warn' | 'fail' | 'skip';
  details: string;
}

async function runSmokeTests(): Promise<TestSummary[]> {
  const results: TestSummary[] = [];

  console.log('🧪 Running AI Carbon Wallet smoke tests...\n');

  // Test 1: Backend
  try {
    const backendResult = await BackendService.testConnection();
    results.push({ module: 'Backend', ...backendResult });
    console.log(`✅ Backend: ${backendResult.status} - ${backendResult.details}`);
  } catch (error) {
    results.push({ 
      module: 'Backend', 
      status: 'fail', 
      details: error instanceof Error ? error.message : 'Unknown error' 
    });
    console.log(`❌ Backend: fail - ${error instanceof Error ? error.message : 'Unknown error'}`);
  }

  // Test 2: Oracle
  try {
    const oracleResult = await OracleService.testConnection();
    results.push({ module: 'Oracle', ...oracleResult });
    console.log(`✅ Oracle: ${oracleResult.status} - ${oracleResult.details}`);
  } catch (error) {
    results.push({ 
      module: 'Oracle', 
      status: 'fail', 
      details: error instanceof Error ? error.message : 'Unknown error' 
    });
    console.log(`❌ Oracle: fail - ${error instanceof Error ? error.message : 'Unknown error'}`);
  }

  // Test 3: Sui
  try {
    const suiResult = await SuiService.testConnection();
    results.push({ module: 'Sui', ...suiResult });
    console.log(`✅ Sui: ${suiResult.status} - ${suiResult.details}`);
  } catch (error) {
    results.push({ 
      module: 'Sui', 
      status: 'fail', 
      details: error instanceof Error ? error.message : 'Unknown error' 
    });
    console.log(`❌ Sui: fail - ${error instanceof Error ? error.message : 'Unknown error'}`);
  }

  // Test 4: Seal + Walrus
  try {
    const sealResult = await SealWalrusService.testConnection();
    results.push({ module: 'Seal+Walrus', ...sealResult });
    console.log(`✅ Seal+Walrus: ${sealResult.status} - ${sealResult.details}`);
  } catch (error) {
    results.push({ 
      module: 'Seal+Walrus', 
      status: 'fail', 
      details: error instanceof Error ? error.message : 'Unknown error' 
    });
    console.log(`❌ Seal+Walrus: fail - ${error instanceof Error ? error.message : 'Unknown error'}`);
  }

  // Test 5: Subgraph
  try {
    const subgraphResult = await SubgraphService.testConnection();
    results.push({ module: 'Subgraph', ...subgraphResult });
    console.log(`✅ Subgraph: ${subgraphResult.status} - ${subgraphResult.details}`);
  } catch (error) {
    results.push({ 
      module: 'Subgraph', 
      status: 'fail', 
      details: error instanceof Error ? error.message : 'Unknown error' 
    });
    console.log(`❌ Subgraph: fail - ${error instanceof Error ? error.message : 'Unknown error'}`);
  }

  // Test 6: USDC
  try {
    const usdcResult = await UsdcService.testConnection();
    results.push({ module: 'USDC', ...usdcResult });
    console.log(`✅ USDC: ${usdcResult.status} - ${usdcResult.details}`);
  } catch (error) {
    results.push({ 
      module: 'USDC', 
      status: 'fail', 
      details: error instanceof Error ? error.message : 'Unknown error' 
    });
    console.log(`❌ USDC: fail - ${error instanceof Error ? error.message : 'Unknown error'}`);
  }

  return results;
}

async function main() {
  const results = await runSmokeTests();
  
  console.log('\n📊 Summary:');
  const okCount = results.filter(r => r.status === 'ok').length;
  const warnCount = results.filter(r => r.status === 'warn').length;
  const skipCount = results.filter(r => r.status === 'skip').length;
  const failCount = results.filter(r => r.status === 'fail').length;
  
  console.log(`✅ OK: ${okCount}`);
  console.log(`⚠️ WARN: ${warnCount}`);
  console.log(`⏭️ SKIP: ${skipCount}`);
  console.log(`❌ FAIL: ${failCount}`);
  
  // Print JSON summary
  console.log('\n📋 JSON Summary:');
  console.log(JSON.stringify(results, null, 2));
  
  if (failCount > 0) {
    process.exit(1);
  }
}

if (require.main === module) {
  main().catch(console.error);
}
