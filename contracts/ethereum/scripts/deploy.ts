import hre from "hardhat";
const { ethers } = hre as typeof import("hardhat");
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

function loadFrontendEnv(): Record<string, string> {
  try {
    const root = path.resolve(__dirname, '../../..');
    const feEnvPath = path.join(root, 'frontend', '.env.local');
    if (!fs.existsSync(feEnvPath)) return {};
    const content = fs.readFileSync(feEnvPath, 'utf-8');
    const env: Record<string, string> = {};
    for (const line of content.split(/\r?\n/)) {
      const m = line.match(/^([A-Z0-9_]+)=(.*)$/);
      if (m) env[m[1]] = m[2];
    }
    return env;
  } catch {
    return {};
  }
}

async function main() {
  const feEnv = loadFrontendEnv();
  const usdcEnv = process.env.NEXT_PUBLIC_USDC_ADDRESS || feEnv['NEXT_PUBLIC_USDC_ADDRESS'] || '';
  if (!usdcEnv) {
    console.error('USDC address missing: set NEXT_PUBLIC_USDC_ADDRESS');
    process.exit(1);
  }
  const PaymentProcessor = await ethers.getContractFactory("PaymentProcessor");
  const pp = await PaymentProcessor.deploy(usdcEnv);
  await pp.waitForDeployment();
  const address = await pp.getAddress();
  console.log("PaymentProcessor deployed:", address);

  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  const root = path.resolve(__dirname, '../../..');
  const out = path.join(root, 'artifacts', 'paymentProcessor.address');
  fs.mkdirSync(path.dirname(out), { recursive: true });
  fs.writeFileSync(out, address, 'utf-8');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});


