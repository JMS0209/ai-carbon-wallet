import { execa } from "execa";
import path from "path";
import fs from "fs-extra";
import { upsertFrontendEnv } from "./update-env";

function parseArg(name: string, fallback?: string) {
  const idx = process.argv.indexOf(`--${name}`);
  if (idx >= 0 && process.argv[idx + 1]) return process.argv[idx + 1];
  return fallback;
}

async function main() {
  const network = parseArg("network", "testnet");
  const gasBudget = process.env.SUI_GAS_BUDGET;
  const cwd = path.resolve(process.cwd(), "contracts", "SuiMove");

  try {
    await execa("sui", ["client", "active-address"], { stdio: "inherit" });
  } catch (e: any) {
    if (e?.code === "ENOENT") {
      console.log("sui CLI not found. Install from https://docs.sui.io");
      process.exit(0);
    }
    console.error("No active address. Run: sui client new-address ed25519 && sui client switch --env", network);
    process.exit(1);
  }

  const args = ["client", "publish", "--json"] as string[];
  if (gasBudget) {
    args.push("--gas-budget", gasBudget);
  }

  console.log(`▶ sui ${args.join(" ")} (cwd=${cwd})`);
  const { stdout } = await execa("sui", args, { cwd });
  let obj: any;
  try {
    obj = JSON.parse(stdout);
  } catch {
    console.error("Failed to parse JSON from publish output");
    console.log(stdout);
    process.exit(1);
  }

  const packageId: string | undefined = obj?.effects?.created?.find((x: any) => x.owner === "Immutable")?.reference?.packageId
    || obj?.objectChanges?.find((x: any) => x?.type === "published")?.packageId
    || obj?.published?.packageId;

  if (!packageId) {
    console.error("Could not find packageId in publish output.");
    console.log(JSON.stringify(obj, null, 2));
    process.exit(1);
  }

  const outDir = path.resolve(cwd, ".publish");
  await fs.ensureDir(outDir);
  const latestPath = path.resolve(outDir, "latest.json");
  await fs.writeJson(latestPath, { network, packageId, ts: new Date().toISOString() }, { spaces: 2 });
  console.log(`Published packageId: ${packageId}`);

  await upsertFrontendEnv("NEXT_PUBLIC_SUI_PACKAGE_ID", packageId);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});


