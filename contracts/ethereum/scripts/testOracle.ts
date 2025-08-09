import hre from "hardhat";
const { ethers } = hre;

async function main() {
  const contractAddress = "0x0f14a0D000509d4B086F5b92167E3672F1e74Bf7";
  
  console.log("🔍 Testing Oracle Receiver contract...");
  console.log("📍 Address:", contractAddress);
  console.log("🌐 Network: Base Sepolia");
  
  try {
    // Connect to the deployed contract
    const OracleReceiver = await ethers.getContractFactory("OracleReceiver");
    const oracle = OracleReceiver.attach(contractAddress);
    
    // Test read functions
    console.log("\n📖 Reading contract state...");
    
    const trustedSigner = await oracle.trustedSigner();
    console.log("🔑 Trusted Signer:", trustedSigner);
    
    const latestData = await oracle.latestOracleData();
    console.log("📊 Latest Oracle Data:", latestData || "(empty)");
    
    const lastUpdate = await oracle.lastUpdateTimestamp();
    console.log("⏰ Last Update:", new Date(Number(lastUpdate) * 1000).toISOString());
    
    console.log("\n✅ Contract is live and responding!");
    console.log("🎯 Oracle integration ready for frontend testing");
    
  } catch (error) {
    console.error("❌ Contract test failed:", error);
    throw error;
  }
}

main().catch((e) => {
  console.error("Test failed:", e.message);
  process.exit(1);
});
