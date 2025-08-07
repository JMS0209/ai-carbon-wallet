import { readdirSync, statSync } from 'fs';
import { join, resolve } from 'path';
import { fileURLToPath } from 'url';

// Get current directory in ES module context
const __dirname = resolve(fileURLToPath(import.meta.url), '..');

const expectedStructure = {
  'contracts': ['Ecologits.sol', 'CarbonCredit.sol'],
  'src/pages': ['index.tsx', 'dashboard.tsx'],
  'src/components': ['CarbonStats.tsx', 'EnergyChart.tsx'],
  'src/hooks': ['useWallet.ts', 'useCarbonData.ts'],
  'src/utils': ['formatAddress.ts', 'calculateFootprint.ts'],
  'src/subgraphs': ['schema.graphql', 'mapping.ts'],
  'src/oracles': ['TrustlessOracle.ts'],
  'src/sui': ['zkLogin.ts', 'kiosk.ts', 'smartContracts.ts'],
  'src/payments': ['usdc.ts'],
};

function walk(dir, fileList = []) {
  const items = readdirSync(dir);
  for (const item of items) {
    const fullPath = join(dir, item);
    const stat = statSync(fullPath);
    if (stat.isDirectory()) {
      walk(fullPath, fileList);
    } else {
      fileList.push(fullPath.replace(__dirname + '/', ''));
    }
  }
  return fileList;
}

function auditStructure() {
  const allFiles = walk(__dirname);
  const misplaced = [];
  const missing = [];

  for (const [folder, files] of Object.entries(expectedStructure)) {
    for (const file of files) {
      const expectedPath = join(folder, file);
      if (!allFiles.includes(expectedPath)) {
        missing.push(expectedPath);
      } else {
        const actualPath = allFiles.find(f => f.endsWith(file));
        if (actualPath && !actualPath.startsWith(folder)) {
          misplaced.push({ file, actualPath, expectedPath });
        }
      }
    }
  }

  console.log('\n🔍 Missing Files:');
  for (const f of missing) {
    console.log(`❌ ${f}`);
  }

  console.log('\n📦 Misplaced Files:');
  for (const { file, actualPath, expectedPath } of misplaced) {
    console.log(`⚠️ ${file} found at ${actualPath}, expected at ${expectedPath}`);
  }
}

auditStructure();