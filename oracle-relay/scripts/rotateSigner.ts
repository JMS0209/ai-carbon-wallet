import { ethers } from "hardhat";

async function main() {
  const registryAddress = "0xYourSignerRegistryAddress";
  const signerToAdd = "0xNewSignerAddress";
  const signerToRemove = "0xOldSignerAddress";

  const [deployer] = await ethers.getSigners();
  const registry = await ethers.getContractAt("SignerRegistry", registryAddress);

  console.log(`🔐 Using deployer: ${deployer.address}`);

  // Add new signer
  const txAdd = await registry.addSigner(signerToAdd);
  await txAdd.wait();
  console.log(`✅ Added signer: ${signerToAdd}`);

  // Remove old signer
  const txRemove = await registry.removeSigner(signerToRemove);
  await txRemove.wait();
  console.log(`🗑️ Removed signer: ${signerToRemove}`);

  // Confirm current signers
  const currentSigners = await registry.getSigners();
  console.log("📜 Current trusted signers:", currentSigners);
}

main().catch((error) => {
  console.error("❌ Rotation failed:", error);
  process.exit(1);
});