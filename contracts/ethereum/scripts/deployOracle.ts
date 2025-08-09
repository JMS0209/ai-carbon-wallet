import hre from "hardhat";
const { ethers } = hre as typeof import("hardhat");
import * as fs from 'fs';
import * as path from 'path';

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
  console.log("🔮 Deploying Oracle Receiver contract to Base Sepolia...");
  
  // Get the deployer account
  const [deployer] = await ethers.getSigners();
  console.log("📝 Deploying with account:", deployer.address);
  
  // Check balance
  const balance = await ethers.provider.getBalance(deployer.address);
  console.log("💰 Account balance:", ethers.formatEther(balance), "ETH");
  
  if (balance === 0n) {
    console.error("❌ Insufficient balance. Get Base Sepolia ETH from: https://faucet.quicknode.com/base/sepolia");
    process.exit(1);
  }
  
  // Deploy Oracle Receiver with deployer as trusted signer
  const OracleReceiver = await ethers.getContractFactory("OracleReceiver");
  console.log("🚀 Deploying OracleReceiver...");
  
  const oracle = await OracleReceiver.deploy(deployer.address);
  await oracle.waitForDeployment();
  
  const address = await oracle.getAddress();
  console.log("✅ OracleReceiver deployed to:", address);
  console.log("🔑 Trusted signer set to:", deployer.address);
  
  // Save to artifacts
  const root = path.resolve(__dirname, '../../..');
  const artifactsDir = path.join(root, 'artifacts');
  fs.mkdirSync(artifactsDir, { recursive: true });
  
  const addressFile = path.join(artifactsDir, 'oracleReceiver.address');
  fs.writeFileSync(addressFile, address, 'utf-8');
  console.log("💾 Address saved to:", addressFile);
  
  // Update frontend .env.local
  const frontendEnvPath = path.join(root, 'frontend', '.env.local');
  if (fs.existsSync(frontendEnvPath)) {
    const envContent = fs.readFileSync(frontendEnvPath, 'utf-8');
    const lines = envContent.split(/\r?\n/);
    let updated = false;
    
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].startsWith('NEXT_PUBLIC_ORACLE_RECEIVER_ADDRESS=')) {
        lines[i] = `NEXT_PUBLIC_ORACLE_RECEIVER_ADDRESS=${address}`;
        updated = true;
        break;
      }
    }
    
    if (!updated) {
      lines.push(`NEXT_PUBLIC_ORACLE_RECEIVER_ADDRESS=${address}`);
    }
    
    fs.writeFileSync(frontendEnvPath, lines.join('\n'), 'utf-8');
    console.log("🔧 Updated frontend/.env.local with oracle address");
  }
  
  console.log("\n🎉 Oracle deployment complete!");
  console.log("🔗 Next steps:");
  console.log("   1. Restart your frontend dev server");
  console.log("   2. Test the 'Oracle Network' card on the dashboard");
  console.log("   3. The card should now show ✅ status");
}

main().catch((e) => {
  console.error("❌ Deployment failed:", e.message);
  process.exit(1);
});
