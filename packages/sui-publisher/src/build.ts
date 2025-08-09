import { execa } from "execa";
import path from "path";

async function main() {
  const cwd = path.resolve(process.cwd(), "contracts", "SuiMove");
  try {
    console.log(`▶ sui move build (cwd=${cwd})`);
    const { stdout } = await execa("sui", ["move", "build"], { cwd });
    console.log(stdout);
  } catch (e: any) {
    if (e?.code === "ENOENT") {
      console.log("sui CLI not found. Install from https://docs.sui.io");
      process.exit(0);
    }
    console.error(e.stdout || e.message);
    process.exit(1);
  }
}

main();


