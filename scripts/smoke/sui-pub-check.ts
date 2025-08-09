import { execa } from "execa";
import fs from "fs-extra";
import path from "path";

async function main() {
  try {
    await execa("sui", ["--version"]);
  } catch {
    console.log("sui CLI not found. Install from https://docs.sui.io");
    process.exit(0);
  }

  try {
    const { stdout } = await execa("sui", ["client", "active-address"]);
    console.log(`Active address: ${stdout.trim()}`);
  } catch (e) {
    console.log("No active address. Run: sui client new-address ed25519 && sui client switch --env testnet");
  }

  const cwd = path.resolve(process.cwd(), "contracts", "SuiMove");
  try {
    await execa("sui", ["move", "build"], { cwd });
    console.log("Move build ok");
  } catch {
    console.log("Move build failed");
  }

  const latest = path.resolve(cwd, ".publish", "latest.json");
  if (await fs.pathExists(latest)) {
    const obj = await fs.readJson(latest);
    console.log(`Last publish: packageId=${obj.packageId} network=${obj.network}`);
  } else {
    console.log("No previous publish artifact found");
  }
}

main();


