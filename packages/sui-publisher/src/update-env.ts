import fs from "fs-extra";
import path from "path";

export async function upsertFrontendEnv(key: string, value: string) {
  const envPath = path.resolve(process.cwd(), "frontend", ".env.local");
  let content = "";
  try {
    content = await fs.readFile(envPath, "utf8");
  } catch {
    content = "";
  }
  const lines = content.split(/\r?\n/).filter(Boolean);
  const without = lines.filter(l => !l.startsWith(`${key}=`));
  without.push(`${key}=${value}`);
  await fs.outputFile(envPath, without.join("\n") + "\n");
  console.log(`Updated ${envPath}: ${key}=${value}`);
}

if (require.main === module) {
  const key = process.argv[2];
  const value = process.argv[3];
  if (!key || !value) {
    console.error("Usage: tsx src/update-env.ts NEXT_PUBLIC_SUI_PACKAGE_ID 0x...");
    process.exit(1);
  }
  upsertFrontendEnv(key, value).catch(err => {
    console.error(err);
    process.exit(1);
  });
}


